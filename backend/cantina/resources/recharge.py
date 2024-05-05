from datetime import datetime

from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from werkzeug.utils import secure_filename

from cantina.models import Affiliation, Payment, PaymentMethod, User
from cantina.settings import UPLOAD_FOLDER
from cantina.utils import allowed_file

from .. import db


class RechargeResource(Resource):
    @jwt_required()
    def post(self):
        data = request.form
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        requester_user_id = get_jwt_identity()
        requester_user = User.query.filter_by(id=requester_user_id).first()
        if not requester_user:
            return {"message": "Usuário não encontrado."}, 404

        target_user_id = data.get("targetUserId", -1, type=int)

        if requester_user.role.id != 1 and target_user_id != requester_user_id:
            return {
                "message": "Você não tem permissão de recarregar para outra pessoa."
            }, 403

        target_user = User.query.filter_by(id=target_user_id).first()
        if not target_user:
            return {"message": "Usuário não encontrado."}, 404

        payment_method_id = data.get("paymentMethod")
        try:
            recharge_value = abs(float(data.get("rechargeValue", 0)))
        except ValueError:
            return {"message": "Valor de recarga inválido."}, 400

        if recharge_value == 0:
            return {
                "message": "Não vejo como uma recarga de R$ 0,00 poderia lhe ser útil..."
            }, 400

        payment_method = PaymentMethod.query.filter_by(id=payment_method_id).first()
        if not payment_method:
            return {"message": "Método de pagamento inválido."}, 400

        if payment_method.is_protected:
            return {
                "message": "Método de pagamento não pode ser usado para recargas."
            }, 400

        observations = data.get("observations")
        new_payment = Payment(
            payment_method=payment_method,
            observations=observations,
            value=recharge_value,
            user_id=target_user.id,
            status="to allow",
        )

        if payment_method.is_payroll:
            # target user is employee
            if target_user.role.id in (1, 2, 4):
                new_payment.payroll_receiver_id = target_user_id
            # target user is affiliated
            else:
                affiliation = Affiliation.query.filter_by(
                    affiliated_id=target_user_id
                ).first()
                if not affiliation:
                    return {
                        "message": "Você não está afiliado à nenhum funcionário."
                    }, 400
                new_payment.payroll_receiver_id = affiliation.affiliator_id

        if payment_method.need_proof:
            file = request.files.get("proof")
            if file is None:
                return {"message": "Comprovante de recarga obrigatório."}, 400

            current_datetime_str = datetime.now().strftime("%Y-%m-%d %H-%M-%S")
            filename = secure_filename(
                f"{target_user_id}.{payment_method.name}.{current_datetime_str}.{file.filename}"
            )
            if not allowed_file(filename):
                return {"message": "Comprovante de recarga inválido."}, 400
            file.save(UPLOAD_FOLDER / filename)
            new_payment.proof_path = filename

        db.session.add(new_payment)
        db.session.commit()

        return {"message": "Recarga registrada com sucesso."}, 201
