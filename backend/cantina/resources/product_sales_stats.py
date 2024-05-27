from datetime import datetime

from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from sqlalchemy import func
from werkzeug.datastructures import MultiDict

from cantina.models import Product, ProductSale
from .. import db


class ProductSalesStatsResource(Resource):
    def __filter_interval(self, query_string: MultiDict[str, str], query, model):
        if unparsed_from := query_string.get("from"):
            parsed_from = datetime.strptime(
                unparsed_from, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")
            query = query.filter(model.added_at >= parsed_from)

        if unparsed_to := query_string.get("to"):
            parsed_to = datetime.strptime(
                unparsed_to, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")
            query = query.filter(model.added_at <= parsed_to)

        return query

    def __get_product_sales(self, query_string: MultiDict[str, str]):
        counter = func.count(ProductSale.id).label("total_sales")
        summer = func.sum(ProductSale.value).label("total_spent")

        query = self.__filter_interval(
            query_string, db.session.query(Product, counter, summer), ProductSale
        )

        query = query.join(Product, ProductSale.product_id == Product.id)

        if product_id := query_string.get("productId"):
            query = query.filter(ProductSale.product_id == product_id)

        if sold_to := query_string.get("soldToUserId"):
            query = query.filter(ProductSale.sold_to == sold_to)

        product_sales = query.group_by(Product.id).order_by(counter.desc()).all()

        return [
            {
                "product": {
                    "id": product.id,
                    "name": product.name,
                    "value": float(product.value),
                },
                "sales": total_sales,
                "spent": float(total_spent),
            }
            for product, total_sales, total_spent in product_sales
        ]

    @jwt_required()
    def get(self):
        query_string = request.args

        return self.__get_product_sales(query_string)
