from random import randint

from cantina import socketio
from cantina.models import ProductSale
from flask import Flask
from flask_socketio import Namespace, emit  # type: ignore


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
                socketio.emit(
                    "products_dispatch",
                    {"products_sales": [p.as_friendly_dict() for p in products_sales]},
                    namespace=self.namespace,
                )
                socketio.sleep(randint(1, 5))

    def on_connect(self):
        self.should_run = True
        socketio.start_background_task(self.__load_products)

    def on_disconnect(self):
        self.should_run = False
