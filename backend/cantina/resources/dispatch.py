from datetime import datetime

from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from cantina.models import ProductSale

from .. import db


class DispatchResource(Resource):
    @jwt_required()
    def post(self):
        data = request.json
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        user_id = data.get("user_id")
        if not user_id or user_id is None:
            return {"message": "ID do usuário deve ser especificado."}, 400

        requester_user_id = get_jwt_identity()

        product_sales = ProductSale.query.filter_by(
            status="to dispatch", sold_to=user_id
        ).all()

        for product_sale in product_sales:
            product_sale.status = "dispatched"
            product_sale.dispatched_by = requester_user_id
            product_sale.dispatched_at = datetime.now()
            db.session.commit()

        return {
            "message": f"{len(product_sales)} produtos despachados com sucesso."
        }, 200
