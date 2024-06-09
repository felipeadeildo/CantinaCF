import locale
from functools import reduce

from cantina.models import Cart, Product, ProductSale, User
from cantina.utils import verify_password
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from .. import db

locale.setlocale(locale.LC_ALL, "pt_BR.UTF-8")


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

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()

        if user.role_id not in [1, 2]:
            return {
                "message": "Apenas administradores podem adicionar produtos no estoque."
            }, 403

        data = request.json
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        product = None
        if product_id := data.get("id"):
            product = Product.query.filter_by(id=product_id).first()
            if product is None:
                return {"message": "Produto não encontrado."}, 404

        product_fields = (
            ["name", "value", "quantity"] if product is None else ["quantity"]
        )

        if any(map(lambda field: not data.get(field), product_fields)):
            return {
                "message": "Todos os campos do produto devem ser especificados."
            }, 400

        data.update(
            {
                "value": float(data["value"]) if product is None else product.value,
                "quantity": int(data["quantity"]),
            }
        )

        if product is None:
            product = Product(
                name=data["name"],
                value=data["value"],
                quantity=data["quantity"],
            )
            db.session.add(product)
        else:
            product.quantity += data["quantity"]

        db.session.commit()
        return {"message": f"Produto {product.name} criado com sucesso."}, 200

    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()

        if user.role_id not in [1, 2]:
            return {"message": "Apenas administradores podem editar produtos."}, 403

        data = request.json
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        if not data.get("name"):
            return {"message": "Nome do produto deve ser especificado."}, 400

        if not data.get("value"):
            return {"message": "Valor do produto deve ser especificado."}, 400

        if not data.get("quantity"):
            return {"message": "Quantidade do produto deve ser especificado."}, 400

        product_id = data.get("id")
        if product_id is None:
            return {"message": "ID do produto deve ser especificado."}, 400

        product = Product.query.filter_by(id=product_id).first()
        if product is None:
            return {"message": "Produto não encontrado."}, 404

        try:
            value = float(data["value"])
        except ValueError:
            return {"message": "O valor do produto deve ser um número."}, 400

        message = ""
        if product.name != data["name"]:
            message = f"{message} Nome do Produto alterado de {product.name} para {data['name']}."
        if float(product.value) != value:
            message = f"{message} Valor alterado de {locale.currency(product.value, grouping=True)} para {locale.currency(value, grouping=True)}."
        if int(product.quantity) != int(data["quantity"]):
            message = f"{message} Quantidade alterada de {product.quantity} para {data['quantity']}."

        product.value = value
        product.name = data["name"]
        product.quantity = data["quantity"]

        db.session.commit()

        return {"message": message.strip() or "Sem alteração! Ok :P"}, 200


class PurchaseResource(Resource):
    @jwt_required()
    def post(self):
        target_user_data = request.json
        if not target_user_data:
            return {"message": "Nenhum dado enviado."}, 400

        requester_id = get_jwt_identity()

        requester_user = User.query.filter_by(id=requester_id).first()
        if not requester_user:
            return {"message": "Matrix error: requester not found."}, 400

        target_user = User.query.filter_by(
            username=target_user_data.get("username")
        ).first()
        if not target_user:
            return {
                "message": f"Usuário {target_user_data.get('username')} não encontrado."
            }, 404

        is_admin_purchase = requester_user.role.id == 1
        if is_admin_purchase:
            target_hashed_password = requester_user.password
        else:
            target_hashed_password = target_user.password

        if not verify_password(
            target_user_data.get("password"), target_hashed_password
        ):
            return {
                "message": f"{'(ADMIN) ' if is_admin_purchase else ''}Senha incorreta."
            }, 400

        cart_list = Cart.query.filter(
            Cart.user_id == requester_id, Cart.quantity > 0
        ).all()
        if not cart_list:
            return {"message": "Carrinho de compras vazio."}, 400

        total_price = reduce(
            lambda acc, cart: acc + cart.product.value * cart.quantity, cart_list, 0
        )

        if total_price > target_user.balance:
            return {
                "message": f"{target_user.username} tem somente R$ {target_user.balance:.2f} de saldo (insuficiente)."
            }, 400

        target_user.balance -= total_price

        sales = []
        for cart_item in cart_list:
            for _ in range(cart_item.quantity):
                product_sale = ProductSale(
                    product_id=cart_item.product.id,
                    value=cart_item.product.value,
                    sold_by=requester_user.id,
                    sold_to=target_user.id,
                    status="to dispatch",
                )
                sales.append(product_sale)
            cart_item.quantity = 0
            db.session.commit()

        db.session.add_all(sales)
        db.session.commit()

        return {
            "message": (
                "Tudo Certo, pode ir lá pegar!"
                if not is_admin_purchase
                else f"Tudo certo, {requester_user.username}, pode mandar o cliente {target_user.username} pegar o que comprou!"
            )
        }, 200
