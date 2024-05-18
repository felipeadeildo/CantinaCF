from datetime import datetime

from cantina.models import Payment, PaymentMethod, Product, ProductSale
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from sqlalchemy import func, not_
from werkzeug.datastructures import MultiDict

from .. import db


class StatsResource(Resource):
    def __filter_interval(
        self, query_string: MultiDict[str, str], query: ..., model: ...
    ):
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

    def __get_products_most_selling(
        self, query_string: MultiDict[str, str], data: dict
    ):
        counter = func.count(ProductSale.id).label("total_sales")
        summer = func.sum(ProductSale.value).label("total_spent")
        query = self.__filter_interval(
            query_string, db.session.query(counter, summer, Product), ProductSale
        )

        if user_id := query_string.get("userId"):
            query = query.filter(ProductSale.sold_to == user_id)

        product_sales = (
            query.join(Product, ProductSale.product_id == Product.id)
            .group_by(ProductSale.product_id)
            .order_by(counter.desc())
            .limit(10)
            .all()
        )

        data["productQuantity"] = [
            {
                "product": product.name,
                "value": total_sales,
                "spent": float(total_spent),
            }
            for total_sales, total_spent, product in product_sales
        ]

    def __get_payment_method_stats(self, query_string: MultiDict[str, str], data: dict):
        counter = func.count(Payment.id).label("total_payments")
        summer = func.sum(Payment.value).label("total_value")

        query = self.__filter_interval(
            query_string,
            db.session.query(
                PaymentMethod,
                counter,
                summer,
            ).join(Payment, Payment.payment_method_id == PaymentMethod.id),
            Payment,
        )

        query = query.filter(
            not_(PaymentMethod.is_protected), Payment.status == "accepted"
        ).group_by(PaymentMethod.id)

        if user_id := query_string.get("userId"):
            query = query.filter(Payment.user_id == user_id)

        results = query.all()

        data["paymentMethodQuantity"] = []
        data["paymentMethodMoney"] = []

        for payment_method, total_payments, total_value in results:
            data["paymentMethodQuantity"].append(
                {
                    "paymentMethod": payment_method.name,
                    "value": total_payments,
                }
            )
            data["paymentMethodMoney"].append(
                {
                    "paymentMethod": payment_method.name,
                    "value": float(total_value) if total_value is not None else 0,
                }
            )

    @jwt_required()
    def get(self):
        query_string = request.args

        data = {}

        stats_builders = [
            self.__get_products_most_selling,
            self.__get_payment_method_stats,
        ]

        for stats_builder in stats_builders:
            stats_builder(query_string, data)

        return data
