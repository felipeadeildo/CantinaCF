from . import app
from flask import abort, request, jsonify, session
from .db import get_conn, get_product, update_product_quantity
from datetime import datetime


@app.route("/search-product", methods=["GET", "POST"])
def search_products():
    data = request.get_json()
    query = data.get("query")
    conn = get_conn()
    products = conn.execute("SELECT * FROM produto WHERE nome LIKE ? OR id = ?", ("%{}%".format(query), query)).fetchall()
    products = [dict(products) for products in products]
    return jsonify(products)

@app.route("/add-to-cart", methods=["GET", "POST"])
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

@app.route("/remove-from-cart", methods=["POST"])
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