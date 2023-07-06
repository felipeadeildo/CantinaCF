from .db import get_user, get_users, insert_user, update_user_password, get_transactions, insert_recharge, update_user_key, get_refill_requests, get_products, get_product, update_product_quantity, insert_product, record_stock_history, get_conn
from flask import abort, request, session, render_template, flash, redirect, url_for
from .settings import PERMISSIONS, UPLOAD_FOLDER, ALLOWED_EXTENSIONS, SERIES
from flask_paginate import Pagination, get_page_args
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from .auth import verify_password
from . import app, cache
import hashlib
import os


@app.route("/usuarios", methods=("POST", "GET"))
def users():
    """
    A function that handles requests related to users. 
    """
    if request.method == "POST":
        if session["user"]["role"] != "admin":
            abort(403)
        username = request.form.get("username")
        password = request.form.get("password")
        name = request.form.get("name")
        role = request.form.get("role")
        serie = request.form.get("serie")
        turma = request.form.get("turma")
        matricula = request.form.get("matricula")
        if get_user(username, by="username") is None and get_user(matricula, by="matricula") is None:
            insert_user(username, generate_password_hash(password), role, name=name, serie=serie, turma=turma, matricula=matricula)
            flash(f"Usuário {username} foi registrado com sucesso!", category="success")
        else:
            flash(f"Usuário {username}{f' ou matrícula {matricula} ' if matricula else ' '}já existe!", category="warning")
    
    context = {
        "users": get_users(),
        "roles": list(PERMISSIONS.keys()),
        "series": SERIES
    }

    return render_template("users.html", **context)

def security_edit_password(to_change_user, changer_user, old_password, new_password):
    """
    A function that allows a user with the role of "admin" to edit the password of another user.
    
    Args:
        to_change_user (dict): A dictionary representing the user whose password will be changed.
        changer_user (dict): A dictionary representing the user who is changing the password.
        old_password (str): The old password of the user being changed. Required if the changer_user is not an admin.
        new_password (str): The new password that will replace the old password.
    
    Returns:
        None
    """
    if new_password is None:
        flash("Por favor, insira a nova senha!", category="error") # no new password
        return
    
    if changer_user["role"] != "admin" and old_password is None:
        flash("Por favor, insira a senha antiga!", category="error") # no old password when is not admin
        return
    
    if changer_user["role"] != "admin" and not verify_password(old_password, changer_user["password"]):
        flash("Senha antiga incorreta!", category="error") # old password is incorrect
        return
    
    update_user_password(to_change_user["id"], new_password) # if old_password is corrrect and got here, update password
    flash("Senha alterada com sucesso!", category="success")

@app.route("/editar-senha", methods=("POST", "GET"))
def edit_password():
    """
    Edit the password of a user.
    """
    to_change_user_id = request.args.get("user_id") or session.get("user")["id"]
    to_change_user = get_user(to_change_user_id, by="id")
    changer_user = session.get("user")
    # verify if user is non-admin and id that it wants to change
    if changer_user["role"] != "admin" and int(to_change_user_id) != changer_user["id"]:
        abort(403)
    if request.method == "POST":
        old_password = request.form.get("old_password")
        new_password = request.form.get("new_password")
        security_edit_password(to_change_user, changer_user, old_password, new_password)    

    return render_template("edit-password.html", user=to_change_user)

@app.route("/perfil")
def profile():
    """
    Renders the profile page for a user.
    """
    user_id = request.args.get("user_id")
    if user_id is None:
        user_id = session.get("user")["id"]
    user = get_user(user_id)
    if user is None:
        flash("Usuário de ID {} não encontrado!".format(user_id), category="error")
        abort(404)
    context = {
        "user": user,
        "transactions": get_transactions(user["id"])
    }
    return render_template("profile.html", **context)


@app.route("/editar-perfil", methods=("POST", "GET"))
def edit_profile():
    """
    Edit the user's profile.
    """
    user = request.args.get("user_id")
    if user is None:
        flash("Por favor, insira o ID do usuário!", category="error")
        return redirect(url_for("profile"))
    user = get_user(user)
    if user is None:
        flash("Usuário de ID {} não encontrado!".format(user), category="error")
        return redirect(url_for("profile"))
    
    if request.method == "POST":
        for key, value in request.form.items():
            if key in (app.config["CSRF_COOKIE_NAME"], 'action'):
                continue
            if key == "serie":
                value = SERIES[int(value)]
            if key == "turma":
                value = value.lower()
            old_value = update_user_key(user["id"], key, value)
            if old_value != value and old_value is not None:
                flash(f"Alteração de {key} foi feita com sucesso ({old_value} -> {value})!", category="success")

    user = get_user(user["id"])
    context = {
        "user": user,
        "roles": list(PERMISSIONS.keys()),
        "series": SERIES
    }
    
    return render_template("edit-profile.html", **context)


def allowed_file(filename):
    """
    Check if the given filename is allowed based on its extension.

    Parameters:
        filename (str): The name of the file to check.

    Returns:
        bool: True if the file is allowed, False otherwise.
    """
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def security_recharge():
    """
    Recharges the user's account balance with a specified value.
    """
    user_id = session["user"]["id"]
    user = get_user(user_id)
    if user is None:
        flash("Usuário de ID {} não encontrado!".format(user_id), category="error")
        return
    payment_method = request.form.get("payment-method")
    if payment_method is None:
        flash("Por favor, insira o método de pagamento!", category="error")
        return
    value = request.form.get("reload-value")
    if value is None:
        flash("Por favor, insira o valor!", category="error")
        return
    value = float(value)
    # new_value = user["saldo"] + value
    observations = request.form.get("observations")
    if payment_method not in ('cash', 'payroll'):
        file = request.files.get("proof")
        if file is None:
            flash("Por favor, insira o comprovante de pagamento!", category="error")
            return
        current_datetime_str = datetime.now().strftime("%Y-%m-%d %H-%M-%S")
        filename = secure_filename(f"{user_id}.{payment_method}.{current_datetime_str}.{file.filename}")
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        insert_recharge(user_id, value, payment_method, filename=filename, observations=observations)
    else:
        insert_recharge(user_id, value, payment_method, observations=observations)
    flash(f"A solicitação de recarga de R$ {value} foi registrada com sucesso! Aguarde verificação!", category="success")


@app.route('/recarregar', methods=["POST", "GET"])
def recharge():
    """
    A function that handles the '/recarregar' route for both POST and GET requests.
    """
    if request.method == "POST":
        security_recharge()
    return render_template('recharge.html')


@app.route("/pedidos-recargas")
def refill_requests():
    """
    A function that handles requests to refill orders.

    Returns:
        The rendered template for the refill requests page.
    """
    context = {
        "refill_requests": get_refill_requests()
    }
    return render_template('refill-requests.html', **context)


def add_to_stock():
    """
    Adds the specified product to the stock.

    Parameters:
        None

    Returns:
        None
    """
    product_id = request.form.get("product")
    product_quantity = int(request.form.get("quantity"))
    product_purchase_price = request.form.get("purchase_price")
    observations = request.form.get("observations")
    if product_quantity is None:
        flash("Por favor, insira a quantidade!", category="error")
        return

    if product_id is not None:
        product = get_product(id=product_id)
        if product is None:
            flash("Produto de ID {} não encontrado!".format(product_id), category="error")
            return
        new_quantity = product_quantity + product["quantidade"]
        update_product_quantity(id=product_id, quantity=new_quantity)
    else:
        product_name = request.form.get("product_name")
        product_description = request.form.get("product_description")
        product_value = request.form.get("product_value")
        product_type = request.form.get("product_type")
        if None in (product_name, product_value, product_type):
            flash("Por favor, insira todos os campos!", category="error")
            return
        product_id = insert_product(name=product_name, description=product_description, value=product_value, type=product_type, quantity=product_quantity)
        product = get_product(id=product_id)
    
    record_stock_history(
        product_id = product_id, 
        quantity = product_quantity, 
        received_by = session["user"]["id"],
        valor_compra = product_purchase_price,
        valor_venda = product["valor"],
        description = observations
    )
    flash(f"Produto {product['nome']} ({product_quantity} unidades) adicionado com sucesso!", category="success")


@app.route("/controle-estoque", methods=["POST", "GET"])
def stock_control():
    """
    Perform stock control operations based on the HTTP request method.
    If the method is POST, add products to the stock.
    
    Parameters:
        None
        
    Returns:
        The rendered stock-control.html template with the updated context.
    """
    if request.method == "POST":
        add_to_stock()

    context = {
        "products": get_products()
    }
    context["types"] = set(map(lambda x: x['tipo'], context["products"]))
    return render_template('stock-control.html', **context)


@app.route("/historico-estoque")
def stock_history():
    # Obtém conexão com banco de dados
    conn = get_conn()
    cur  = conn.cursor()

    # Obtém dados para filtro
    recebido_por = request.args.get("recebido_por", "")
    order_by = request.args.get("order_by", "")
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")
    order_mode = request.args.get("order_mode", "ASC")

    # Define a query inicial e os parametros iniciais
    query = "SELECT * FROM historico_abastecimento_estoque"
    params = []

    if recebido_por: # se recebido_por for diferente de ""
        query += ' INNER JOIN user ON historico_abastecimento_estoque.recebido_por = user.id WHERE user.username LIKE ?'
        params.extend([f"%{recebido_por}%"])

    if start_date or end_date: # se start_date ou end_date for diferente de ""
        if start_date: # se a data inicial for diferente de ""
            start_date = datetime.strptime(start_date, "%b %d, %Y").strftime("%Y-%m-%d") # transforma a data inicial em datetime
        else: # se a data inicial for igual a ""
            start_date = datetime(year=2000, month=1, day=1).strftime("%Y-%m-%d") # transforma a data inicial em datetime com início em 2000
        
        if end_date: # se a data final for diferente de ""
            end_date = datetime.strptime(end_date, "%b %d, %Y").strftime("%Y-%m-%d") # transforma a data final em datetime
        else: # se a data final for igual a ""
            end_date = datetime.now().strftime("%Y-%m-%d") # transforma a data final em datetime onde a data atual é a de agora
        query += f" {'WHERE' if not query.endswith('LIKE ?') else 'AND'} data_hora BETWEEN ? AND datetime(?, '+1 day', '-1 second')"
        params.extend([start_date, end_date])
    
    if order_by: # se é pra ordernar
        query += f" ORDER BY {order_by} {order_mode}" # adiciona a ordenação
    
    page, per_page, offset = get_page_args(page_parameter='page', per_page_parameter='per_page') # obtém a página e o número de páginas
    offset = (page - 1) * per_page

    query += " LIMIT ?, ?" # adiciona os limites
    params.extend([offset, per_page])


    results_obj = cur.execute(query, params).fetchall()
    results_obj = list(map(dict, results_obj))

    results = []
    # define e trata os resultados
    for result in results_obj:
        result = dict(result)
        result["recebido_por"] = dict(get_user(result["recebido_por"], safe=True))
        result["produto"] = dict(get_product(id=result["produto_id"]))
        result["data_hora"] = datetime.strptime(result["data_hora"], "%Y-%m-%d %H:%M:%S").strftime("%d/%m/%Y às %H:%M:%S")
        results.append(result)

    total_query = query.split("LIMIT")[0].split('ORDER BY')[0].strip() # obtém o total
    total_params = []
    if total_query.count("?") == 1:
        total_params.append(recebido_por)
    elif total_query.count("?") == 2:
        total_params.append(start_date)
        total_params.append(end_date)
    elif total_query.count("?") == 3:
        total_params.append(recebido_por)
        total_params.append(start_date)
        total_params.append(end_date)
    
    identificador = f"historico-estoque-{recebido_por}-{start_date}-{end_date}-{session['user']['id']}"
    hashed_query = hashlib.sha256(identificador.encode('utf-8')).hexdigest()
    results_obj = cur.execute(total_query, total_params).fetchall()
    results_obj = list(map(dict, results_obj))
    cache.set(hashed_query, results_obj)

    total = len(results_obj)


    # define paginação
    pagination = Pagination(page=page, per_page=per_page, total=total, css_framework='materialize')

    context = {
        "results": results,
        "pagination": pagination,
        "page": page,
        "per_page": per_page,
        "result_id": hashed_query
    }
    return render_template("stock-history.html", **context)


@app.route("/afiliados", methods=["POST", "GET"])
def affiliates():
    # normalmente eu deixaria o trabalho da db com o DB, porém tem umas verificações de segurança aqui que devem ser feitas antes de qlqr coisa
    conn = get_conn()
    action = request.args.get("action", "")
    if action == "remove":
        user_id = request.args.get("user_id")
        if user_id is None:
            flash("Por favor, insira o ID do usuário!", category="error")
            return redirect(url_for("affiliates"))
        user = get_user(user_id)
        if user is None:
            flash("Usuário de ID {} não encontrado!".format(user_id), category="error")
            return redirect(url_for("affiliates"))
        is_affiliate = conn.execute("SELECT * FROM affiliation WHERE user_id = ? AND entidade_id = ?", (user_id, session["user"]["id"])).fetchone() is not None
        if not is_affiliate:
            flash("Usuário não é seu afiliado!", category="error")
            return redirect(url_for("affiliates"))
        conn.execute("DELETE FROM affiliation WHERE user_id = ? AND entidade_id = ?", (user_id, session["user"]["id"]))
        conn.commit()
        flash("Usuário removido com sucesso!", category="success")
    if request.method == 'POST':
        if action != 'add':
            flash("O que estás tentando fazer..?!", category="error")
            return redirect(url_for("affiliates"))
        matricula = request.form.get("matricula")
        user = get_user(matricula, by="matricula")
        if user is None:
            flash("Matrícula {} não encontrada!".format(matricula), category="error")
            return redirect(url_for("affiliates"))
        is_affiliate = conn.execute("SELECT * FROM affiliation WHERE user_id = ?", (user['id'],)).fetchone()
        if is_affiliate is not None:
            flash("Usuário já é afiliado do usuário de ID {}!".format(is_affiliate['entidade_id']), category="error")
            return redirect(url_for("affiliates"))
        conn.execute("INSERT INTO affiliation (user_id, entidade_id) VALUES (?, ?)", (user['id'], session["user"]["id"]))
        conn.commit()
        flash("Usuário adicionado com sucesso!", category="success")
    
    afiliados = conn.execute("SELECT * FROM affiliation WHERE entidade_id = ?", (session["user"]["id"],)).fetchall()
    afiliados = [get_user(affiliate['user_id']) for affiliate in afiliados]
    ammount = conn.execute("SELECT valor FROM folha_de_pagamento WHERE entidade_id = ?", (session["user"]["id"],)).fetchall()
    ammount = sum(v['valor'] for v in ammount)
    context = {
        "afiliados": afiliados,
        "ammount": ammount
    } 
    return render_template("affiliates.html", **context)


@app.route("/afiliados/historico")
def affiliates_history():
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")
    conn = get_conn()
    query = "SELECT * FROM folha_de_pagamento WHERE entidade_id = ?"
    params = [session["user"]["id"]]

    if start_date or end_date:
        if start_date:
            start_date = datetime.strptime(start_date, "%b %d, %Y").strftime("%Y-%m-%d")
        else:
            start_date = datetime(year=2000, month=1, day=1).strftime("%Y-%m-%d")
        
        if end_date:
            end_date = datetime.strptime(end_date, "%b %d, %Y").strftime("%Y-%m-%d")
        else:
            end_date = datetime.now().strftime("%Y-%m-%d")
        query += f" {'WHERE' if not query.endswith('?') else 'AND'} data_hora BETWEEN ? AND datetime(?, '+1 day', '-1 second')"
        params.extend([start_date, end_date])
    
    query += " ORDER BY data_hora DESC"

    page, per_page, offset = get_page_args(page_parameter='page', per_page_parameter='per_page')
    offset = (page - 1) * per_page

    query += " LIMIT ?, ?"
    params.extend([offset, per_page])
    
    result_obj = conn.execute(query, params).fetchall()
    result_obj = list(map(dict, result_obj))
    results = []
    for item in result_obj:
        item["data_hora"] = datetime.strptime(item["data_hora"], "%Y-%m-%d %H:%M:%S").strftime("%d/%m/%Y às %H:%M:%S")
        item["afiliado"] = get_user(item["affiliation_id"])
        item["liberado_por"] = get_user(item["liberado_por"])
        results.append(item)
    
    total_query = query.split("LIMIT")[0].split('ORDER BY')[0].strip()
    total_params = []
    if total_query.count("?") == 1:
        total_params.append(session["user"]["id"])
    elif total_query.count("?") == 3:
        total_params.extend([session["user"]["id"], start_date, end_date])

    result_obj = conn.execute(total_query, total_params).fetchall()
    total = len(result_obj)

    pagination = Pagination(page=page, per_page=per_page, total=total, css_framework='materialize')

    context = {
        "results": results,
        "pagination": pagination,
    }
    
    return render_template("affiliates-history.html", **context)


def security_pay_payroll():
    user_id = session["user"]["id"]
    user = get_user(user_id)
    if user is None:
        flash("Usuário de ID {} não encontrado!".format(user_id), category="error")
        return redirect(url_for("login"))
    payment_method = request.args.get("payment-method")
    if payment_method is None:
        flash("Por favor, insira o método de pagamento!", category="error")
        return
    payment_value = request.args.get("payment-value")
    if payment_value is None:
        flash("Por favor, insira o valor do pagamento!", category="error")
        return
    value = float(payment_value)
    observations = request.args.get("obs")
    if payment_method not in ('cash', ):
        file = request.files.get('proof')
        if file is None:
            flash("Por favor, insira o documento de pagamento!", category="error")
            return
        if not allowed_file(file.filename):
            flash("Arquivo não permitido!", category="error")
            return
        current_datetime_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        filename = secure_filename(f"{user_id}-{payment_method}-{value}-{current_datetime_str}.{file.filename}")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        insert_recharge(user_id, payment_method, value, filename=filename, observations=observations, is_payroll=True)
    else:
        insert_recharge(user_id, payment_method, value, observations=observations, is_payroll=True)
    flash(f"A solicitação de quitação de dívida no valor de R$ {value} foi realizada com sucesso! O saldo devedor em seu perfil será atualizado caso a solicitação seja aceita.", category="success")


@app.route("/afiliados/pagar", methods=["POST", "GET"])
def pay_payroll():
    if request.method == 'POST':
        security_pay_payroll()
    return render_template("pay-payroll.html")


@app.route("/auditorias")
def audits():
    return render_template("audits.html")


@app.route("/historico-edições")
def history_edits():
    conn = get_conn()
    page, per_page, offset = get_page_args(page_parameter='page', per_page_parameter='per_page')
    offset = (page - 1) * per_page
    