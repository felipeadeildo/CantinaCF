from cantina.models import Payment
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from sqlalchemy import and_


class PaymentsResource(Resource):
    @jwt_required()
    def get(self):
        payments = Payment.query.filter(
            and_(Payment.status == "to allow", Payment.payment_method_id != 1)
        ).all()

        return {"payments": [p.as_dict() for p in payments]}
