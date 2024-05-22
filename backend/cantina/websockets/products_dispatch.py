from itertools import groupby

from cantina import socketio
from cantina.models import ProductSale
from flask import Flask

from .base import WSocket


class ProductsDispatch(WSocket):
    def __init__(self, namespace: str, app: Flask):
        super().__init__(namespace, app)

    def emitter(self):
        products_sales = ProductSale.query.filter_by(status="to dispatch").all()
        products_sales_grouped_by_user = groupby(
            [p.as_dict() for p in products_sales],
            key=lambda p: p["sold_to"],
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