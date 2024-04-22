from itertools import groupby
from random import randint

from flask import Flask
from flask_jwt_extended import jwt_required
from flask_socketio import Namespace, emit  # type: ignore

from cantina import socketio
from cantina.models import ProductSale


class ProductsDispatch(Namespace):
    def __init__(self, namespace: str, app: Flask):
        self.should_run = True
        super().__init__(namespace)
        self.emit = emit
        self.app = app

    def __load_products(self):
        with self.app.app_context():
            while self.should_run:
                products_sales = ProductSale.query.filter_by(status="to dispatch").all()
                products_sales_grouped_by_user = groupby(
                    [p.as_friendly_dict() for p in products_sales],
                    key=lambda p: p["sold_by"],
                )
                products_sales_grouped_by_user_and_product = []
                for user, products in products_sales_grouped_by_user:
                    products_grouped = {}
                    for product_info, sales in groupby(
                        products, key=lambda p: p["product"]["id"]
                    ):
                        products_grouped[product_info] = products_grouped.get(
                            product_info, []
                        ) + list(sales)

                    products_sales_grouped_by_user_and_product.append(
                        {"user": user, "products": list(products_grouped.items())}
                    )

                socketio.emit(
                    "products_dispatch",
                    {"products_sales": products_sales_grouped_by_user_and_product},
                    namespace=self.namespace,
                )
                socketio.sleep(randint(1, 5))

    @jwt_required(locations=["query_string"])
    def on_connect(self):
        self.should_run = True
        socketio.start_background_task(self.__load_products)

    @jwt_required(locations=["query_string"])
    def on_disconnect(self):
        self.should_run = False
