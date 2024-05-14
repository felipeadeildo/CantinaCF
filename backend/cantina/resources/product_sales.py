from datetime import datetime

from cantina.models import ProductSale
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource


class ProductSalesResource(Resource):
    @jwt_required()
    def get(self):
        data = request.args

        try:
            page = int(data.get("page", 1))
        except ValueError:
            page = 1

        query = ProductSale.query

        if product_id := data.get("productId"):
            query = query.filter_by(product_id=product_id)

        if sold_to := data.get("soldToUserId"):
            query = query.filter_by(sold_to=sold_to)

        if unparsed_from := data.get("from"):
            parsed_from = datetime.strptime(
                unparsed_from, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")
            query = query.filter(ProductSale.added_at >= parsed_from)

        if unparsed_to := data.get("to"):
            parsed_to = datetime.strptime(
                unparsed_to, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")
            query = query.filter(ProductSale.added_at <= parsed_to)

        query = query.order_by(ProductSale.added_at.desc())

        pagination = query.paginate(page=page, per_page=10, error_out=False)
        data = [sale.as_friendly_dict() for sale in pagination.items]

        return {"sales": data, "nextPage": page + 1 if pagination.has_next else None}
