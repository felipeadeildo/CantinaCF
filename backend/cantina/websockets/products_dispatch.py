from random import randint

from cantina import socketio
from cantina.models import ProductSale
from flask_socketio import Namespace, emit  # type: ignore


class ProductsDispatch(Namespace):

    def __init__(self, namespace):
        self.should_run = True
        super().__init__(namespace)

    def __load_products(self):
        while self.should_run:
            products_sales = ProductSale.query.filter_by(status="to dispatch").all()
            emit(
                "products_dispatch",
                {"product_sales": [p.as_friendly_dict() for p in products_sales]},
            )
            socketio.sleep(randint(1, 5))

    def on_connect(self):
        self.should_run = True
        self.__load_products()

    def on_disconnect(self):
        self.should_run = False


socketio.on_namespace(ProductsDispatch("/products_dispatch"))
