from . import app
from flask import abort, request, jsonify
from .db import get_conn


@app.route("/search-product", methods=["GET", "POST"])
def search_products():
    conn = get_conn()
    search = request.args.get("search")
    products = conn.execute("SELECT * FROM produto WHERE nome LIKE ?", ("%{}%".format(search),)).fetchall()
    products = [dict(products) for products in products]
    return jsonify(products)


@app.route("/change-product-quantity", methods=["GET", "POST"])
def change_product_quantity():
    conn = get_conn()
    product_id = request.args.get("id")
    quantity = request.args.get("quantity")
    try:
        conn.execute("UPDATE produto SET quantidade = ? WHERE id = ?", (quantity, product_id))
        conn.commit()
    except:
        abort(400)
    else:
        return "true"