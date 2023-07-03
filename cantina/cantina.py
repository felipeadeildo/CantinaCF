from .db import get_products, get_user, update_user_saldo, insert_product_sales, get_product, update_product_key
from flask import render_template, request, flash, session, redirect, url_for
from flask_paginate import Pagination, get_page_args
from .auth import verify_password
from . import app


@app.route("/")
@app.route("/venda-produtos")
def index():
    """
    A function that handles the index route and the venda-produtos route.

    Returns:
        The rendered index.html template with the products as the context.
    """
    context = {
        "products": get_products()
    }
    return render_template("index.html", **context)


@app.route("/venda-produtos/confirmar-compra", methods=["POST", "GET"])
def confirm_purchase():
    """
    A function that confirms a purchase by processing the purchase details and rendering the 'confirm-purchase.html' template.
    """
    if request.method == "POST":
        process_purchase(request.form)
    return render_template("confirm-purchase.html")


def process_purchase(form):
    """
    Process a purchase using the given form data.

    Args:
        form (dict): A dictionary containing the form data.
    """
    matricula = form.get("matricula")
    password = form.get("password")
    if None in (matricula, password):
        flash("Preencha todos os campos", "error")
        return
    
    user = get_user(matricula)
    if user is None:
        flash(f"Matrícula e/ou Senha incorretos...", "error")
        return
    
    if not verify_password(password, user["password"]):
        flash(f"Matrícula e/ou Senha incorretos...", "error")
        return
    
    total_compra = sum(product["valor"] for product in session["cart"])
    if user["saldo"] < total_compra:
        flash(f"O usuário {user['name']} não tem saldo suficiente para realizar a compra... Seu saldo atual é de R$ {user['saldo']}", "error")
        return
    
    # TODO: adicionar sugestão de pagamento em espécie
    
    change_saldo = user["saldo"] - total_compra
    update_user_saldo(user["id"], change_saldo)


    insert_product_sales(sold_by=session["user"]["id"], sold_to=user["id"], products=session["cart"])

    session["cart"] = []
    flash("Compra realizada com sucesso!", "success")


@app.route("/produtos")
def products():
    """
    A function that renders the 'products.html' template.
    """

    page, per_page, offset = get_page_args(page_parameter="page", per_page_parameter="per_page")
    offset = (page - 1) * per_page
    products, total = get_products(offset=offset, per_page=per_page, return_total=True)

    pagination = Pagination(page=page, per_page=per_page, total=total, css_framework="materialize")
    context = {
        "products": products,
        "pagination": pagination
    }

    return render_template("products.html", **context)

@app.route("/editar-produto", methods=["POST", "GET"])
def edit_product():
    product_id = request.args.get("product_id")
    if product_id is None:
        flash("Por favor, insira o ID do produto!", category="error")
        return redirect(url_for('products'))
    product = get_product(id=product_id)
    if product is None:
        flash("Produto de ID {} não encontrado!".format(product_id), category="error")
        return redirect(url_for('products'))
    
    if request.method == "POST":
        for key, value in request.form.items():
            if key in (app.config["CSRF_COOKIE_NAME"], 'action'):
                continue
            old_value = update_product_key(product_id=product_id, key=key, value=value)
            if str(old_value) != str(value) and old_value is not None:
                flash(f"Alteração de {key} foi feita com sucesso ({old_value} -> {value})!", category="success")

    context = {
        "product": get_product(id=product_id)
    }
    return render_template("edit-product.html", **context)