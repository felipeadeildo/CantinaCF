from .db import get_conn, get_product, update_product_quantity, get_user as get_userdb
from flask import request, jsonify, session
from . import app


@app.route("/api/search-product", methods=["GET", "POST"])
def search_products():
    data = request.get_json()
    query = data.get("query")
    conn = get_conn()
    products = conn.execute("SELECT * FROM produto WHERE nome LIKE ? OR id = ?", ("%{}%".format(query), query)).fetchall()
    products = [dict(products) for products in products]
    return jsonify(products)


@app.route("/api/add-to-cart", methods=["GET", "POST"])
def add_to_cart():
    data = request.get_json()
    product_id = data.get("id")
    conn = get_conn()
    try:
        product = get_product(id=product_id)
        update_product_quantity(id=product_id, quantity=product["quantidade"] - 1)
        conn.commit()
    except Exception as e:
        context = {
            "message": "Alguma coisa deu errado...",
            "ok": False
        }
        return jsonify(context), 201
    else:
        context = {
            "message": f"Produto {product['nome']} adicionado com sucesso!",
            "product": dict(product),
            "ok": True
        }
        context["product"]["quantidade"] -= 1
        session["cart"].append(context["product"])
        return jsonify(context)


@app.route("/api/remove-from-cart", methods=["POST"])
def remove_from_cart():
    data = request.get_json()
    product_id = data.get("id")
    for product in session["cart"]:
        if product["id"] == product_id:
            session["cart"].remove(product)
            break
    product = dict(get_product(id=product_id))
    product["quantidade"] += 1
    update_product_quantity(id=product_id, quantity=product["quantidade"])
    return jsonify({
        "message": f"Produto {product['nome']} removido com sucesso!",
        "product": product,
    })


@app.route("/api/get-user", methods=["POST"])
def get_user():
    data = request.get_json()
    user_id = data.get("id")
    user = get_userdb(user_id)
    if user is None:
        context = {
            "message": f"Usuário de ID {user_id} não encontrado!",
            "user": False
        }
    else:
        context = {
            "message": f"Comprimente bem o usuário {user['name']}! :D",
            "user": dict(user)
        }
    return jsonify(context)

@app.route("/api/generate-random-username", methods=["POST"])
def generate_random_username():
    data = request.get_json()
    name = data.get("name", "aluno usuario").lower().split()
    if len(name) >= 2:
        username = f"{name[0]}.{name[1]}"
    else:
        username = name[0]
    conn = get_conn()
    # get usersnames that startswith the username
    usernames = conn.execute("SELECT username FROM user WHERE username LIKE ?", ("%{}%".format(username),)).fetchall()
    if len(usernames) > 0:
        username = f"{username}{len(usernames)}"
    return jsonify({
        "username": username
    })