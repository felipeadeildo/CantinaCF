from . import app
from flask import abort, request, jsonify, session
from .db import get_conn
from datetime import datetime


@app.route("/search-product", methods=["GET", "POST"])
def search_products():
    data = request.get_json()
    query = data.get("query")
    conn = get_conn()
    products = conn.execute("SELECT * FROM produto WHERE nome LIKE ? OR id = ?", ("%{}%".format(query), query)).fetchall()
    products = [dict(products) for products in products]
    return jsonify(products)

@app.route("/add2cart", methods=["GET", "POST"])
def add_to_cart():
    data = request.get_json()
    product_id = data.get("id")
    conn = get_conn()
    try:
        product = conn.execute("SELECT * FROM produto WHERE id = ?", (product_id, )).fetchone()
        conn.execute("UPDATE produto SET quantidade = ? WHERE id = ?", (product["quantidade"] - 1, product_id))
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