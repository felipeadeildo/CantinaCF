from .db import get_products, get_user, update_user_saldo, insert_product_sales, get_product, update_product_key, get_conn, record_stock_history, insert_edit_product_history
from flask import render_template, request, flash, session, redirect, url_for
from flask_paginate import Pagination, get_page_args
from .auth import verify_password
from datetime import datetime
from .settings import PAGES
from . import app, cache
import hashlib


@app.route("/")
def index():
    """
    A function that handles the index route.
    """
    context = {
        "pages": [page for page in PAGES if session["user"]["role"] in page["allowed_roles"]],
    }
    return render_template("index.html", **context)

@app.route("/venda-produtos")
def cantina():
    """
    A function that handles the index route and the venda-produtos route.

    Returns:
        The rendered index.html template with the products as the context.
    """
    context = {
        "products": get_products()
    }
    return render_template("cantina.html", **context)


@app.route("/venda-produtos/confirmar-compra", methods=["POST", "GET"])
def confirm_purchase():
    """
    A function that confirms a purchase by processing the purchase details and rendering the 'confirm-purchase.html' template.
    """
    if len(session["cart"]) == 0:
        flash("Nenhum produto adicionado ao carrinho para confirmação...", "error")
        return redirect(url_for("index"))
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
    
    user = get_user(matricula, by="matricula") or get_user(matricula, by="id")
    if user is None:
        flash("Identificação (matrícula ou id) e/ou Senha incorretos...", "error")
        return
    
    if not verify_password(password, user["password"]):
        flash(f"Identificação (matrícula ou id) e/ou Senha incorretos...", "error")
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
    
    updated_values = []
    if request.method == "POST":
        motivo = request.form.get("motivo")
        if motivo is None:
            flash("Por favor, insira o motivo, é obrigatório!", category="error")
            return redirect(url_for('products')) # TODO: trocar isso daqui para redirecionar para a página de edição de produto em si
        for key, value in request.form.items():
            if key in (app.config["CSRF_COOKIE_NAME"], 'action', 'motivo'):
                continue
            old_value = update_product_key(product_id=product_id, key=key, value=value)
            if str(old_value) != str(value) and old_value is not None:
                updated_values.append((key, old_value, value))
                flash(f"Alteração de {key} foi feita com sucesso ({old_value} -> {value})!", category="success")
        insert_edit_product_history(product_id=product_id, updated_values=updated_values, motivo=motivo, edited_by=session["user"]["id"])
        
        
        

    context = {
        "product": get_product(id=product_id)
    }
    return render_template("edit-product.html", **context)

@app.route("/historico-vendas")
def sales_history():
    conn = get_conn()
    cur = conn.cursor()

    vendido_por = request.args.get("vendido_por", "")
    vendido_para = request.args.get("vendido_para", "")
    order_by = request.args.get("order_by", "id")
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")
    order_mode = request.args.get("order_mode", "ASC")

    query = "SELECT * FROM venda_produto"
    params = []


    if vendido_por or vendido_para: # se vendido_por ou vendido_para forem diferentes de ""
        query += ' INNER JOIN user ON (venda_produto.vendido_por = user.id OR venda_produto.vendido_para = user.id)'

    if vendido_por: # se vendido_por for diferente de ""
        query += ' WHERE (user.username LIKE ? or user.matricula LIKE ?)' if 'WHERE' not in query else ' AND (user.username LIKE ? or user.matricula LIKE ?) '
        params.extend([f"%{vendido_por}%", f"%{vendido_por}%"])
        
    if vendido_para: # se vendido_para for diferente de ""
        query += ' WHERE (user.username LIKE ? or user.matricula LIKE ?)' if 'WHERE' not in query else ' AND (user.username LIKE ? or user.matricula LIKE ?)'
        params.extend([f"%{vendido_para}%", f"%{vendido_para}%"])

    
    if start_date or end_date: # se start_date ou end_date for diferente de ""
        if start_date: # se a data inicial for diferente de ""
            start_date = datetime.strptime(start_date, "%b %d, %Y").strftime("%Y-%m-%d") # transforma a data inicial em datetime
        else: # se a data inicial for igual a ""
            start_date = datetime(year=2000, month=1, day=1).strftime("%Y-%m-%d") # transforma a data inicial em datetime com início em 2000
        
        if end_date: # se a data final for diferente de ""
            end_date = datetime.strptime(end_date, "%b %d, %Y").strftime("%Y-%m-%d") # transforma a data final em datetime
        else: # se a data final for igual a ""
            end_date = datetime.now().strftime("%Y-%m-%d") # transforma a data final em datetime onde a data atual é a de agora
        query += f" {'AND' if (query.endswith('LIKE ?)') or query.endswith('LIKE ?')) else 'WHERE'} data_hora BETWEEN ? AND datetime(?, '+1 day', '-1 second')"
        params.extend([start_date, end_date])
    
    query += f" ORDER BY {order_by} {order_mode}"

    page, per_page, offset = get_page_args(page_parameter="page", per_page_parameter="per_page")
    offset = (page - 1) * per_page

    query += f" LIMIT ?, ?"
    params.extend([offset, per_page])
    results_obj = cur.execute(query, params).fetchall()
    results_obj = list(map(dict, results_obj))

    results = []
    for result in results_obj:
        result = dict(result)
        result["vendido_por"] = dict(get_user(result["vendido_por"], safe=True))
        result["vendido_para"] = dict(get_user(result["vendido_para"]), safe=True)
        result["produto"] = dict(get_product(id=result["produto_id"]))
        result["data_hora"] = datetime.strptime(result["data_hora"], "%Y-%m-%d %H:%M:%S").strftime("%d/%m/%Y às %H:%M:%S")
        results.append(result)
    
    total_query = query.split("LIMIT")[0].split("ORDER BY")[0].strip()
    total_params = params[:-2]
    
    identificador = f"historico-vendas-{vendido_por}-{vendido_para}-{start_date}-{end_date}-{session['user']['id']}"
    hashed_query = hashlib.sha256(identificador.encode("utf-8")).hexdigest()
    results_obj = cur.execute(total_query, total_params).fetchall()
    results_obj = list(map(dict, results_obj))
    stats = {}
    for result in results_obj:
        product = dict(get_product(id=result["produto_id"]))
        if product["nome"] in stats:
            stats[product["nome"]]['ammount'] += result['valor']
            stats[product["nome"]]['quantity'] += 1
        else:
            stats[product["nome"]] = {}
            stats[product["nome"]]['id'] = product['id']
            stats[product["nome"]]['quantity'] = 1
            stats[product["nome"]]['valor'] = result['valor']
            stats[product["nome"]]['ammount'] = result['valor']
    cache.set(hashed_query, results_obj)

    total = len(results_obj)
    
    pagination = Pagination(page=page, per_page=per_page, total=total, css_framework="materialize")
    context = {
        "results": results,
        "pagination": pagination,
        "page": page,
        "per_page": per_page,
        "result_id": hashed_query,
        "stats": stats
    }
    return render_template("sales-history.html", **context)

@app.route('/vendas-hoje')
def filter_today_sales():
    today_str = datetime.now().strftime(datetime.now().strftime("%b %d, %Y"))
    args = request.args.copy()
    args.pop('page', None)
    args['start_date'] = today_str
    args['end_date'] = today_str
    return redirect(url_for('sales_history', **args))