from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from cantina import db
from cantina.models import Payment, User


class PayrollResource(Resource):
    @jwt_required()
    def post(self):
        if not request.json:
            return {"message": "Nenhum dado enviado."}, 400

        requester_id = get_jwt_identity()
        requester = User.query.filter_by(id=requester_id).first()

        if not requester:
            return {"message": "Matrix error: requester not found."}, 400

        if requester.role_id != 1:
            return {
                "message": "Somente administradores podem realizar liquidação de folha."
            }, 403

        user_id = request.json.get("user_id")
        if not user_id:
            return {"message": "ID do usuário deve ser especificado."}, 400

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return {"message": "Usuário não encontrado."}, 404

        try:
            value = float(request.json.get("value"))
        except ValueError:
            return {"message": "O valor deve ser um número."}, 400

        if value <= 0:
            return {"message": "O valor deve ser maior que 0."}, 400

        if float(user.balance_payroll) < value:
            return {"message": "O valor ultrapassa o limite de folha."}, 400

        user.balance_payroll = float(user.balance_payroll) - value

        new_payment = Payment(
            user_id=user_id,
            payment_method_id=6,
            observations="(System) Baixa no pagamento",
            value=value,
            allowed_by=requester_id,
            is_paypayroll=True,
            status="accepted",
        )

        db.session.add(new_payment)

        db.session.commit()

        return {"message": "Liquidação de folha concluída com sucesso."}
