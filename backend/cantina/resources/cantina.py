from cantina.models import Cart, Product, User
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from .. import db


class CartResource(Resource):
    @jwt_required()
    def post(self):
        data = request.json
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        product_id = data.get("id")
        if product_id is None:
            return {"message": "ID do produto deve ser especificado."}, 400

        product = Product.query.filter_by(id=product_id).first()
        if product is None:
            return {"message": "Produto não encontrado."}, 404

        if product.quantity < 1:
            return {"message": f"O produto {product.name} não possui estoque."}, 400

        product.quantity -= 1
        db.session.commit()

        user_id = get_jwt_identity()

        cart = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        if cart:
            cart.quantity += 1
        else:
            cart = Cart(user_id=user_id, product_id=product_id, quantity=1)
            db.session.add(cart)

        db.session.commit()

        return {"message": f"Produto {product.name} adicionado ao carrinho."}, 200

    @jwt_required()
    def get(self):

        user_id = get_jwt_identity()
        carts = Cart.query.filter_by(user_id=user_id).all()

        return [cart.as_dict() for cart in carts]

    @jwt_required()
    def delete(self):
        data = request.args
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        product_id = data.get("product_id")
        if product_id is None:
            return {"message": "ID do produto deve ser especificado."}, 400

        user_id = get_jwt_identity()

        cart = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        if not cart or cart.quantity < 1:
            return {"message": "Carrinho vazio."}, 404

        cart.quantity -= 1
        cart.product.quantity += 1
        db.session.commit()
        return {"message": "Item removido do carrinho."}, 200


class ProductsResource(Resource):
    @jwt_required()
    def get(self):
        product_query = Product.query.order_by(Product.name.asc())

        # TODO: Replace "á" with "a" in the query and things like this from the pt-br

        if query := request.args.get("query"):
            product_query = product_query.filter(Product.name.contains(query))

        products = product_query.all()
        return {"products": [product.as_dict() for product in products]}
