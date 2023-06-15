from flask import render_template, request
from . import app
from .db import get_products


@app.route("/")
@app.route("/venda-produtos")
def index():
    context = {
        "products": get_products()
    }
    return render_template("index.html", **context)

@app.route("/venda-produtos/confirmar-compra")
def confirm_purchase():
    pass