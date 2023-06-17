from flask import render_template, request, flash, session
from . import app
from .db import get_products, get_user, update_user_saldo, insert_product_sales
from .auth import verify_password

@app.route("/")
@app.route("/venda-produtos")
def index():
    context = {
        "products": get_products()
    }
    return render_template("index.html", **context)

@app.route("/venda-produtos/confirmar-compra", methods=["POST", "GET"])
def confirm_purchase():
    if request.method == "POST":
        process_purchase(request.form)
    return render_template("confirm-purchase.html")


def process_purchase(form):
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
        flash(f"O usuário {user['name']} não tem saldo suficiente para realizar a compra...", "error")
        return
    
    # TODO: adicionar sugestão de pagamento em espécie
    
    change_saldo = user["saldo"] - total_compra
    update_user_saldo(user["id"], change_saldo)


    insert_product_sales(sold_by=user["id"], sold_to=user["id"], products=session["cart"])

    session["cart"] = []
    flash("Compra realizada com sucesso!", "success")