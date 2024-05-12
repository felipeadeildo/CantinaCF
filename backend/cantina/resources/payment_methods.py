from flask_jwt_extended import jwt_required
from flask_restful import Resource

from cantina.models import PaymentMethod


class PaymentMethodsResource(Resource):
    @jwt_required()
    def get(self):
        payment_methods = PaymentMethod.query.all()
        return [payment_method.as_dict() for payment_method in payment_methods]
