from datetime import datetime

from cantina.models import Affiliation, Payment, PaymentMethod, User
from cantina.settings import UPLOAD_FOLDER
from cantina.utils import allowed_file
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from sqlalchemy import and_, or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import aliased
from werkzeug.datastructures import MultiDict
from werkzeug.utils import secure_filename

from .. import cache, db
from ..utils import generate_query_hash


class RechargeResource(Resource):
    @jwt_required()
    def post(self):
        data = request.form
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        requester_user_id = get_jwt_identity()
        requester_user = User.query.filter_by(id=requester_user_id).first()
        if not requester_user:
            return {"message": "Usuário não encontrado."}, 404

        target_user_id = data.get("targetUserId", -1, type=int)

        if requester_user.role.id != 1 and target_user_id != requester_user_id:
            return {
                "message": "Você não tem permissão de recarregar para outra pessoa."
            }, 403

        target_user = User.query.filter_by(id=target_user_id).first()
        if not target_user:
            return {"message": "Usuário não encontrado."}, 404

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

        payment_exists = Payment.query.filter_by(
            user_id=target_user_id, status="to allow"
        ).first()
        if payment_exists:
            return {
                "message": "Já existe um pedido de recarga em aberto. Aguarde aprovação."
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
            affiliation = Affiliation.query.filter_by(
                affiliated_id=target_user_id
            ).first()
            # if isn't affiliate
            if not affiliation:
                # the target user is not affiliate, so the payment is for the user itself
                new_payment.payroll_receiver_id = target_user_id
            else:
                # the target user is affiliate, so the payment is for the affiliator
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

    @jwt_required()
    def put(self):
        data = request.json
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        requester_user_id = get_jwt_identity()
        requester_user = User.query.filter_by(id=requester_user_id).first()

        if requester_user.role.id != 1:
            return {"message": "Você precisa ser admin para fazer isso."}, 403

        payment_id = data.get("id")
        if payment_id is None:
            return {"message": "ID de pagamento inválido."}, 400

        payment = Payment.query.filter_by(id=payment_id).first()
        if not payment:
            return {"message": "Pagamento não encontrado."}, 404

        if payment.status != "to allow":
            return {
                "message": "Esta recarga não pode ser editada uma vez que ela já foi aceita/rejeitada (Espere site atualizar a lista de recargas)."
            }, 400

        accept = data.get("accept")
        if not isinstance(accept, bool):
            return {"message": "Aceitar recarga inválido."}, 400

        if accept:
            payment.status = "accepted"
            if payment.payroll_receiver:
                payment.payroll_receiver.balance_payroll += payment.value

            payment.user.balance += payment.value

        else:
            payment.status = "rejected"

        payment.allowed_by = requester_user_id

        db.session.commit()

        return {
            "message": f"Recarga de R$ {payment.value} para {payment.user.name} foi {'ACEITA' if accept else 'REJEITADA'} com sucesso!"
        }, 200

    @classmethod
    def generate_query(cls, params: MultiDict):
        query = Payment.query

        if params.get("isPayrollHistory", "").lower() == "true":
            payroll_receiver_id = params.get("payrollReceiverId", "")
            query = query.filter(
                or_(
                    and_(
                        Payment.payroll_receiver_id == payroll_receiver_id,
                        Payment.payment_method_id == 5,
                    ),
                    and_(Payment.is_paypayroll, Payment.user_id == payroll_receiver_id),
                )
            )

            if user_id := params.get("userId"):
                query = query.filter_by(user_id=user_id)

        else:
            if user_id := params.get("userId"):
                query = query.filter_by(user_id=user_id)

            if allowed_by_user_id := params.get("allowedByUserId"):
                query = query.filter_by(allowed_by=allowed_by_user_id)

            if payroll_receiver_id := params.get("payrollReceiverId"):
                query = query.filter_by(payroll_receiver_id=payroll_receiver_id)

            if payment_method_ids := params.getlist("paymentMethodIds[]"):
                query = query.filter(Payment.payment_method_id.in_(payment_method_ids))

            if role_ids := params.getlist("roleIds[]"):
                user_aliases = aliased(User)
                query = query.join(
                    user_aliases, Payment.user_id == user_aliases.id
                ).filter(user_aliases.role_id.in_(role_ids))

            if status := params.get("status"):
                query = query.filter(Payment.status == status)

            if params.get("onlyIsPayroll", "").lower() == "true":
                query = query.filter(Payment.payroll_receiver_id.isnot(None))

            if params.get("onlyIsPayPayroll", "").lower() == "true":
                query = query.filter(Payment.is_paypayroll)

        if unparsed_from := params.get("from"):
            parsed_from = datetime.strptime(
                unparsed_from, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")
            query = query.filter(Payment.added_at >= parsed_from)

        if unparsed_to := params.get("to"):
            parsed_to = datetime.strptime(
                unparsed_to, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")
            query = query.filter(Payment.added_at <= parsed_to)

        query = query.order_by(Payment.added_at.desc())

        return query

    @jwt_required()
    def get(self):
        data = request.args

        try:
            page = int(data.get("page", 1))
        except ValueError:
            page = 1

        query = self.generate_query(data)
        query_hash = generate_query_hash(data)
        cache.set(query_hash, {"generator": "RechargeResource", "params": data})

        pagination = query.paginate(page=page, per_page=10, error_out=False)
        data = [payment.as_dict() for payment in pagination.items]

        return {
            "payments": data,
            "nextPage": page + 1 if pagination.has_next else None,
            "queryId": query_hash,
        }

    @jwt_required()
    def delete(self):
        data = request.args
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        requester_user_id = get_jwt_identity()
        requester_user = User.query.filter_by(id=requester_user_id).first()

        if requester_user.role.id != 1:
            return {"message": "Você precisa ser admin para fazer isso."}, 403

        payment_id = data.get("id")
        if payment_id is None:
            return {"message": "ID de pagamento inválido."}, 400

        payment = Payment.query.filter_by(id=payment_id).first()
        if not payment:
            return {"message": "Pagamento não encontrado."}, 404

        if payment.status == "rejected":
            return {"message": "Este pagamento já foi rejeitado anteriormente."}, 400

        if payment.payment_method.is_payroll or payment.is_paypayroll:
            return {
                "message": "Não é possível reverter pagamentos de folha de pagamento."
            }, 400

        try:
            # Verificar se o usuário tem saldo suficiente para a reversão
            if payment.value > payment.user.balance:
                difference = payment.value - payment.user.balance
                payment.user.balance = 0
                payment.user.balance_payroll += difference
            else:
                payment.user.balance -= payment.value

            payment.status = "rejected"

            db.session.commit()

            return {
                "message": f"Pagamento de R$ {payment.value} para {payment.user.name} foi revertido com sucesso."
            }, 200

        except SQLAlchemyError:
            db.session.rollback()
            return {
                "message": "Erro ao reverter o pagamento. Por favor, tente novamente."
            }, 500
