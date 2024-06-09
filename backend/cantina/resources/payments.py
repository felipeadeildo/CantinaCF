from cantina.models import Payment
from flask_jwt_extended import jwt_required
from flask_restful import Resource


class PaymentsResource(Resource):
    @jwt_required()
    def get(self):
        payments = Payment.query.filter_by(status="to allow").all()

        return {"payments": [p.as_dict() for p in payments]}
