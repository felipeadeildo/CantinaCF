from cantina.models import Product, User
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

        # TODO: Add clanup task to remove this product from the cart after a certain amount of time

        # TODO: Add the product to the user cart list (create the table to save this.)

        return {"message": f"Produto {product.name} adicionado ao carrinho."}, 200

    @jwt_required()
    def get(self):
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        if user is None:
            return {"message": "Usuário não encontrado."}, 404

        # TODO: this must be a list of products on the cart
        return []
    
    @jwt_required()
    def delete(self):
        # TODO: delete a product from the user's cart
        ...
