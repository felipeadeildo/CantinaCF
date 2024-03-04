import hashlib
import os
from datetime import datetime, timedelta

from flask import (
    abort,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from sqlalchemy import func, or_
from sqlalchemy.orm import aliased
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename

from . import app, cache, db
from .auth import verify_password
from .models import (
    Affiliation,
    EditHistory,
    Payment,
    PaymentMethod,
    Payroll,
    Product,
    ProductSale,
    Role,
    StockHistory,
    User,
)
from .settings import ALLOWED_EXTENSIONS, SERIES, UPLOAD_FOLDER


@app.route("/usuarios", methods=("POST", "GET"))
def users():
    """
    A function that handles requests related to users.
    """
    if request.method == "POST":
        if session["user"].role.id != 1:
            abort(403)
        name = request.form.get("name")
        username = request.form.get("username")
        password = request.form.get("password")
        name = request.form.get("name")
        role_id = request.form.get("role_id")
        serie = request.form.get("serie")
        turma = request.form.get("turma")
        matricula = request.form.get("matricula")
        if not password:
            flash("Por favor, insira uma senha!", category="error")
            return redirect(url_for("users"))
        has_username = False
        has_matricula = False
        if username:
            has_username = (
                User.query.filter(User.username == username).first() is not None
            )
        if matricula:
            has_matricula = (
                User.query.filter(User.matricula == matricula).first()
                is not None
            )

        if not (has_username and has_matricula):
            # TODO: verificar role, serie e turma antes de adicionar, por exemplo, verificar se a pessoa está tentando colocar um role com mais perm que ela, ou se está colocando serie ou turma que não existe no escopo do sistema
            role = Role.query.filter(Role.id == role_id).first()
            is_aluno = role.name.lower() == "aluno"

            if not role:
                flash("Por favor, insira um cargo!", category="error")
                return redirect(url_for("users"))
            try:
                serie = SERIES[int(serie)]  # type: ignore
            except:
                if is_aluno:
                    flash("A série especificada não existe!", category="error")
                    return redirect(url_for("users"))

            new_user = User(
                name=name,
                username=username,
                password=generate_password_hash(password),
                role_id=role_id,
                serie=serie if is_aluno else None,
                turm=turma if is_aluno else None,
                role=role,
                matricula=matricula,
            )
            db.session.add(new_user)
            db.session.commit()
            flash(
                f"Usuário {username} foi registrado com sucesso!",
                category="success",
            )
        else:
            flash(
                f"Usuário {username}{f' ou matrícula {matricula} ' if matricula else ' '}já existe!",
                category="warning",
            )

    context = {
        "users": User.query.all(),
        "roles": Role.query.all(),
        "series": SERIES,
        "aluno_role_id": Role.query.filter(Role.name == "Aluno").first().id,
    }
    return render_template("users.html", **context)


def security_edit_password(
    to_change_user, changer_user, old_password, new_password
):
    """
    A function that allows a user with the role of "admin" to edit the password of another user.

    Args:
        to_change_user (models.User): A dictionary representing the user whose password will be changed.
        changer_user (models.User): A dictionary representing the user who is changing the password.
        old_password (str): The old password of the user being changed. Required if the changer_user is not an admin.
        new_password (str): The new password that will replace the old password.

    Returns:
        None
    """
    if new_password is None:
        flash(
            "Por favor, insira a nova senha!", category="error"
        )  # no new password
        return

    if changer_user.role.name != "Admin" and old_password is None:
        flash(
            "Por favor, insira a senha antiga!", category="error"
        )  # no old password when is not admin
        return

    if changer_user.role.name != "Admin" and not verify_password(
        old_password, changer_user.password
    ):
        flash(
            "Senha antiga incorreta!", category="error"
        )  # old password is incorrect
        return

    motivo = request.form.get("motivo", "Não informado")
    setattr(to_change_user, "password", generate_password_hash(new_password))
    setattr(to_change_user, "updated_at", datetime.now())
    db.session.commit()
    edit_history = EditHistory(
        edited_by=changer_user.id,
        key="password",
        old_value=old_password,
        new_value=generate_password_hash(new_password),
        reason=motivo,
        user_id=to_change_user.id,
    )
    db.session.add(edit_history)
    db.session.commit()
    flash("Senha alterada com sucesso!", category="success")


@app.route("/editar-senha", methods=("POST", "GET"))
def edit_password():
    """
    Edit the password of a user.
    """
    to_change_user_id = request.args.get("user_id") or session["user"].id
    to_change_user = User.query.filter_by(id=to_change_user_id).first()
    changer_user = session["user"]
    # verify if user is non-admin and id that it wants to change
    if (
        changer_user.role.name != "Admin"
        and int(to_change_user_id) != changer_user.id
    ):
        abort(403)
    if request.method == "POST":
        old_password = request.form.get("old_password")
        new_password = request.form.get("new_password")
        security_edit_password(
            to_change_user, changer_user, old_password, new_password
        )

    return render_template("edit-password.html", user=to_change_user)


@app.route("/perfil")
def profile():
    """
    Renders the profile page for a user.
    """
    user_id = request.args.get("user_id")
    if user_id is None:
        user_id = session["user"].id
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        flash(
            "Usuário de ID {} não encontrado!".format(user_id),
            category="error",
        )
        abort(404)

    transactions = []
    inputs = Payment.query.filter_by(user_id=user_id).all()
    outputs = ProductSale.query.filter_by(sold_to=user_id).all()
    for input in inputs:
        dict_input = input.as_dict()
        dict_input["allowed_by"] = User.query.filter_by(
            id=dict_input["allowed_by"]
        ).first()
        dict_input["payment_type"] = (
            PaymentMethod.query.filter_by(id=dict_input["payment_method_id"])
            .first()
            .name
        )
        dict_input["transaction_type"] = "input"
        dict_input["formatted_added_at"] = input.formatted_added_at
        transactions.append(dict_input)
    for output in outputs:
        dict_output = output.as_dict()
        dict_output["product"] = Product.query.filter_by(
            id=dict_output["product_id"]
        ).first()
        dict_output["sold_by"] = User.query.filter_by(
            id=dict_output["sold_by"]
        ).first()
        dict_output["transaction_type"] = "output"
        dict_output["formatted_added_at"] = output.formatted_added_at
        transactions.append(dict_output)

    transactions.sort(key=lambda x: x["added_at"], reverse=True)

    context = {
        "user": user.as_friendly_dict(),
        "transactions": transactions,
    }
    return render_template("profile.html", **context)


@app.route("/editar-perfil", methods=("POST", "GET"))
def edit_profile():
    """
    Edit the user's profile.
    """
    user_id = request.args.get("user_id")
    if user_id is None:
        flash("Por favor, insira o ID do usuário!", category="error")
        return redirect(url_for("profile"))
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        flash(
            "Usuário de ID {} não encontrado!".format(user_id),
            category="error",
        )
        return redirect(url_for("profile"))

    if request.method == "POST":
        motivo = request.form.get("motivo", "Não informado")
        # TODO: Perguntar se o motivo é obrigatório, se sim, tem que fazer tratamento aqui
        for key, value in request.form.items():
            if key in (app.config["CSRF_COOKIE_NAME"], "action", "motivo"):
                continue
            if key == "serie":
                value = SERIES[
                    int(value)
                ]  # TODO: Verificar se isso daqui está certo mesmo....
            if key == "turma":
                value = value.lower()
            value = value.strip()
            if value == "":
                continue
            old_value = str(getattr(user, key))
            if old_value != value and old_value is not None:
                setattr(user, key, value)
                setattr(user, "updated_at", datetime.now())
                db.session.commit()
                new_history = EditHistory(
                    edited_by=session["user"].id,
                    key=key,
                    old_value=old_value,
                    new_value=value,
                    reason=motivo,
                    object_type="user",
                    user_id=user.id,
                )
                db.session.add(new_history)
                db.session.commit()
                flash(
                    f"Alteração de {key} foi feita com sucesso ({old_value} -> {value})!",
                    category="success",
                )
    context = {"user": user, "roles": Role.query.all(), "series": SERIES}

    return render_template("edit-profile.html", **context)


def allowed_file(filename):
    """
    Check if the given filename is allowed based on its extension.

    Parameters:
        filename (str): The name of the file to check.

    Returns:
        bool: True if the file is allowed, False otherwise.
    """
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def security_recharge():
    """
    Recharges the user's account balance with a specified value.
    """
    target_id = request.form.get("target-id", "").strip()
    try:
        target_id = int(target_id)
    except ValueError:
        flash("Por favor, insira um ID de usuário válido!", category="error")
        return
    if session["user"].role_id != 1 and target_id != session["user"].id:
        flash(
            "Você não tem permissão para realizar esta operação!",
            category="error",
        )
        return

    user_id = target_id

    user = User.query.filter_by(id=user_id).first()
    if user is None:
        flash(
            "Usuário de ID {} não encontrado!".format(user_id),
            category="error",
        )
        return
    payment_method = request.form.get("payment-method")
    if payment_method is None:
        flash("Por favor, insira o método de pagamento!", category="error")
        return
    value = request.form.get("reload-value")
    if value is None:
        flash("Por favor, insira o valor!", category="error")
        return
    try:
        value = float(value)
    except ValueError:
        flash("Por favor, insira um valor válido!", category="error")
        return
    if value < 0:
        flash(
            f"Então, espertinho(a), por favor, insira um valor positivo!",
            category="error",
        )
        return
    if value == 0:
        flash(
            f"Não vejo como uma recarga de R$ 0 poderia lhe ser útil...",
            category="error",
        )
        return
    payment_method = PaymentMethod.query.filter_by(id=payment_method).first()
    if payment_method is None:
        flash("Método de pagamento não encontrado!", category="error")
        return
    if payment_method.is_protected:
        flash("Tenta a sorte!", category="error")
        return
    observations = request.form.get("observations")
    new_payment = Payment(
        payment_method_id=payment_method.id,
        observations=observations,
        value=value,
        user_id=user_id,
        status="to allow",
        payment_method=payment_method,
    )
    if payment_method.need_proof:
        file = request.files.get("proof")
        if file is None:
            flash(
                "Por favor, insira o comprovante de pagamento!",
                category="error",
            )
            return
        current_datetime_str = datetime.now().strftime("%Y-%m-%d %H-%M-%S")
        filename = secure_filename(
            f"{user_id}.{payment_method}.{current_datetime_str}.{file.filename}"
        )
        if not allowed_file(filename):
            flash(
                f"Por favor, insira um comprovante de pagamento válido! (A extensão do arquivo deve ser algumas dessas: {', '.join(ALLOWED_EXTENSIONS)})",
                category="error",
            )
            return
        new_payment.proof_path = filename
        file.save(os.path.join(UPLOAD_FOLDER, filename))

    if payment_method.is_payroll:
        is_affiliation = (
            Affiliation.query.filter_by(affiliated_id=user_id).first()
            is not None
        )
        if not is_affiliation:
            flash(
                f"Então, meu anjo, você não está afiliado a ninguém ainda...",
                category="error",
            )
            return
        new_payment.is_payroll = True

    db.session.add(new_payment)
    db.session.commit()

    flash(
        f"A solicitação de recarga de R$ {value} foi registrada com sucesso! Aguarde verificação!",
        category="success",
    )


@app.route("/recarregar", methods=["POST", "GET"])
def recharge():
    """
    A function that handles the '/recarregar' route for both POST and GET requests.
    """
    if request.method == "POST":
        security_recharge()
    context = {
        "payment_methods": PaymentMethod.query.filter(
            ~PaymentMethod.is_protected
        ).all()
    }
    return render_template("recharge.html", **context)


@app.route("/pedidos-recargas")
def verify_payments():
    """
    A function that handles requests to refill orders.

    Returns:
        The rendered template for the refill requests page.
    """
    recharge_requests = Payment.query.filter_by(status="to allow").all()
    requests = []
    for request in recharge_requests:
        request = request.as_dict()
        request["payment_method"] = PaymentMethod.query.filter_by(
            id=request["payment_method_id"]
        ).first()
        request["user"] = User.query.filter_by(id=request["user_id"]).first()
        request["proof_url"] = url_for(
            "static", filename=f"uploads/{request['proof_path']}"
        )
        requests.append(request)
    context = {"verify_payments": requests}
    return render_template("verify_payments.html", **context)


def add_to_stock():
    """
    Adds the specified product to the stock.
    """
    product_id = request.form.get("product")
    try:
        product_quantity = int(request.form.get("quantity"))  # type: ignore
    except:
        flash(
            "Por favor, insira uma quantidade válida, safado!", category="error"
        )
        return
    try:
        product_purchase_price = float(request.form.get("purchase_price"))  # type: ignore
    except:
        flash(
            "Por favor, insira um preço de compra válido, safado!",
            category="error",
        )
        return

    observations = request.form.get("observations")
    if product_id is not None:
        product = Product.query.filter_by(id=product_id).first()
        if product is None:
            flash(
                "Produto de ID {} não encontrado!".format(product_id),
                category="error",
            )
            return
        product.quantity += product_quantity
        product.updated_at = datetime.now()
        db.session.commit()
    else:
        product_name = request.form.get("product_name")
        product_description = request.form.get("product_description")
        product_value = request.form.get("product_value")
        product_type = request.form.get("product_type")
        if None in (product_name, product_value, product_type):
            flash("Por favor, insira todos os campos!", category="error")
            return
        added_at = datetime.now()
        new_product = Product(
            name=product_name,
            description=product_description,
            value=product_value,
            type=product_type,
            quantity=product_quantity,
            added_at=added_at,
        )
        db.session.add(new_product)
        db.session.commit()
        product_id = new_product.id
    product = Product.query.filter_by(id=product_id).first()
    received_by = User.query.filter_by(id=session["user"].id).first()

    new_history = StockHistory(
        observations=observations,
        product_id=product_id,
        received_by=received_by.id,
        purchase_price=product_purchase_price,
        sale_value=product.value,
        product=product,
        received_by_user=received_by,
        quantity=product_quantity,
    )
    db.session.add(new_history)
    db.session.commit()
    flash(
        f"Produto {product.name} ({product_quantity} unidades) adicionado com sucesso!",
        category="success",
    )


@app.route("/controle-estoque", methods=["POST", "GET"])
def stock_control():
    """
    Perform stock control operations based on the HTTP request method.
    If the method is POST, add products to the stock.
    """
    if request.method == "POST":
        add_to_stock()

    context = {
        "products": Product.query.all(),
        "types": [
            x[0]
            for x in Product.query.with_entities(Product.type).distinct().all()
        ],
    }
    # context["types"] = set(map(lambda x: x['tipo'], context["products"]))
    # unique_types = db.session.query(Product.type).distinct().all()
    return render_template("stock-control.html", **context)


@app.route("/historico-estoque")
def stock_history():
    recebido_por = request.args.get("recebido_por", "")
    order_by = request.args.get("order_by", "")
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")
    order_mode = request.args.get("order_mode", "ASC")

    query = StockHistory.query

    if recebido_por:
        query = query.join(User, StockHistory.received_by == User.id).filter(
            User.username.contains(recebido_por)
        )

    if start_date or end_date:
        if start_date:
            start_date = datetime.strptime(start_date, "%d/%m/%Y")
        else:
            start_date = db.session.query(
                func.min(StockHistory.added_at)
            ).scalar() + timedelta(seconds=1)

        if end_date:
            end_date = datetime.strptime(end_date, "%d/%m/%Y") + timedelta(
                hours=23, minutes=59, seconds=59
            )
        else:
            end_date = db.session.query(
                func.max(StockHistory.added_at)
            ).scalar() + timedelta(seconds=1)

        query = query.filter(
            StockHistory.added_at.between(start_date, end_date)
        )

    if order_by:
        column = getattr(StockHistory, order_by)
        if order_mode.lower() == "asc":
            query = query.order_by(column.asc())
        else:
            query = query.order_by(column.desc())

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    results = pagination.items

    identifier = f"historico-estoque-{recebido_por}-{start_date}-{end_date}-{session['user'].id}"
    hashed_query = hashlib.sha256(identifier.encode("utf-8")).hexdigest()
    cache.set(hashed_query, {"identifier": identifier, "data": query.all()})

    context = {
        "results": results,
        "pagination": pagination,
        "page": page,
        "per_page": per_page,
        "result_id": hashed_query,
    }

    return render_template("stock-history.html", **context)


@app.route("/afiliados", methods=["POST", "GET"])
def affiliates():
    # TODO: Refazer isso daqui, e fazer melhorias de segurança
    action = request.args.get("action", "")
    if action == "remove":
        user_id = request.args.get("user_id")
        if user_id is None:
            flash("Por favor, insira o ID do usuário!", category="error")
            return redirect(url_for("affiliates"))
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            flash(
                "Usuário de ID {} não encontrado!".format(user_id),
                category="error",
            )
            return redirect(url_for("affiliates"))
        affiliation = Affiliation.query.filter_by(
            affiliated_id=user_id, affiliator_id=session["user"].id
        ).first()
        if affiliation is None:
            flash("Usuário não é seu afiliado!", category="error")
            return redirect(url_for("affiliates"))

        db.session.delete(affiliation)
        db.session.commit()
        flash("Usuário removido com sucesso!", category="success")
    if request.method == "POST":
        if action != "add":
            flash("O que estás tentando fazer..?!", category="error")
            return redirect(url_for("affiliates"))
        matricula = request.form.get("matricula")
        if matricula is None or matricula == "":
            flash("Por favor, insira a matrícula!", category="error")
            return redirect(url_for("affiliates"))
        user = User.query.filter(
            (User.matricula == matricula) | (User.username == matricula)
        ).first()
        if user is None:
            flash(
                "Matrícula {} não encontrada!".format(matricula),
                category="error",
            )
            return redirect(url_for("affiliates"))
        has_affiliation = Affiliation.query.filter_by(
            affiliated_id=user.id
        ).first()
        if has_affiliation:
            flash(
                "Usuário já é afiliado do usuário de ID {}!".format(
                    has_affiliation.affiliator_id
                ),
                category="error",
            )
            return redirect(url_for("affiliates"))
        new_affiliation = Affiliation(
            affiliated_id=user.id, affiliator_id=session["user"].id
        )
        db.session.add(new_affiliation)
        db.session.commit()
        flash("Usuário adicionado com sucesso!", category="success")

    affiliates = (
        User.query.join(Affiliation, Affiliation.affiliated_id == User.id)
        .filter(Affiliation.affiliator_id == session["user"].id)
        .all()
    )
    context = {
        "afiliados": affiliates,
    }
    return render_template("affiliates.html", **context)


@app.route("/afiliados/historico")
def affiliates_history():
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")
    entity_id = session["user"].id
    query = (
        db.session.query(Payroll)
        .join(Affiliation, Payroll.affiliation_id == Affiliation.id)
        .filter(Affiliation.affiliator_id == entity_id)
        .order_by(Payroll.added_at.desc())
    )

    if start_date or end_date:
        if start_date:
            start_date = datetime.strptime(start_date, "%d/%m/%Y")
        else:
            start_date = db.session.query(
                func.min(ProductSale.added_at)
            ).scalar()
        if end_date:
            end_date = datetime.strptime(end_date, "%d/%m/%Y")
        else:
            end_date = db.session.query(func.max(ProductSale.added_at)).scalar()
        query = query.filter(Payroll.added_at.between(start_date, end_date))

    page = request.args.get("page", 1)
    per_page = request.args.get("per_page", 10)
    # offset = (page - 1) * per_page:

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)  # type: ignore

    results = pagination.items

    # ammount = db.session.query(db.func.sum(Payroll.value)).join(Affiliation, Payroll.affiliation_id == Affiliation.id).filter(Affiliation.affiliator_id == session["user"].id).scalar() or 0.0

    context = {
        "results": results,
        "pagination": pagination,
        # "ammount": ammount
    }

    return render_template("affiliates-history.html", **context)


def security_pay_payroll():
    user_id = session["user"].id
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        flash(
            "Usuário de ID {} não encontrado!".format(user_id),
            category="error",
        )
        return redirect(url_for("index"))
    payment_method = request.form.get("payment-method")
    if payment_method is None:
        flash("Por favor, insira o método de pagamento!", category="error")
        return
    payment_method = PaymentMethod.query.filter_by(id=payment_method).first()
    if payment_method is None:
        flash("Método de pagamento não encontrado!", category="error")
        return

    if payment_method.is_payroll:
        flash(
            "Você não pode pagar o saldo devedor com MAIS saldo devedor, engraçadinho(a)!"
        )
        return

    payment_value = request.form.get("payment-value")
    if payment_value is None:
        flash("Por favor, insira o valor do pagamento!", category="error")
        return

    value = float(payment_value)
    observations = request.form.get("obs")
    new_payment = Payment(
        payment_method_id=payment_method.id,
        observations=observations,
        value=value,
        user_id=user_id,
        status="to allow",
        is_paypayroll=True,
    )
    if payment_method.need_proof:
        file = request.files.get("proof")
        if file is None:
            flash(
                "Por favor, insira o documento de pagamento!", category="error"
            )
            return
        if not allowed_file(file.filename):
            flash("Arquivo não permitido!", category="error")
            return
        current_datetime_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        filename = secure_filename(
            f"{user_id}-{payment_method}-{value}-{current_datetime_str}.{file.filename}"
        )
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
        new_payment.proof_path = filename
    db.session.add(new_payment)
    db.session.commit()
    flash(
        f"A solicitação de quitação de dívida no valor de R$ {value} foi realizada com sucesso! O saldo devedor em seu perfil será atualizado caso a solicitação seja aceita.",
        category="success",
    )


@app.route("/afiliados/pagar", methods=["POST", "GET"])
def pay_payroll():
    flash(
        f"Olá {session['user'].name}, atualmente você tem um saldo devedor de R$ {session['user'].balance_payroll} na sua conta no sistema.",
        category="warning",
    )
    if request.method == "POST":
        security_pay_payroll()
    context = {
        "payment_methods": PaymentMethod.query.filter(
            ~PaymentMethod.is_payroll
        ).all()
    }
    return render_template("pay-payroll.html", **context)


@app.route("/historico-edicoes-produtos")
def history_edits_products():
    editado_por = request.args.get("editado_por", "")
    produto = request.args.get("produto", "")
    start_date = request.args.get("data_inicial", "")
    end_date = request.args.get("data_final", "")
    order_by = request.args.get("order_by", "added_at")
    order_mode = request.args.get("order_mode", "ASC")

    query = (
        db.session.query(EditHistory)
        .join(User, EditHistory.edited_by == User.id)
        .join(Product, EditHistory.product_id == Product.id)
        .filter(EditHistory.object_type == "product")
    )

    if editado_por:
        query = query.filter(
            or_(
                User.username.contains(editado_por),
                User.matricula.contains(editado_por),
            )
        )

    if produto:
        query = query.filter(
            or_(Product.name.contains(produto), Product.id == produto)
        )

    if start_date or end_date:
        if start_date:
            start_date = datetime.strptime(start_date, "%d/%m/%Y")
        else:
            start_date = db.session.query(
                func.min(EditHistory.added_at)
            ).scalar() + timedelta(seconds=1)

        if end_date:
            end_date = datetime.strptime(end_date, "%d/%m/%Y") + timedelta(
                hours=23, minutes=59, seconds=59
            )
        else:
            end_date = db.session.query(
                func.max(EditHistory.added_at)
            ).scalar() + timedelta(seconds=1)

        query = query.filter(EditHistory.added_at.between(start_date, end_date))

    query = query.order_by(
        getattr(EditHistory, order_by).asc()
        if order_mode == "ASC"
        else getattr(EditHistory, order_by).desc()
    )

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)  # type: ignore [paginate is a method on sqlalchemy.orm.query.Query]
    results = pagination.items

    identificador = f"historico-edicoes-produtos-{editado_por}-{start_date}-{end_date}-{session['user'].id}"
    hashed_query = hashlib.sha256(identificador.encode("utf-8")).hexdigest()
    cache.set(hashed_query, {"identifier": identificador, "data": query.all()})

    context = {
        "results": results,
        "pagination": pagination,
        "page": page,
        "per_page": per_page,
        "result_id": hashed_query,
    }

    return render_template("history-edits-products.html", **context)


@app.route("/historico-edicoes-usuarios")
def history_edits_users():
    editado_por = request.args.get("editado_por", "")
    start_date = request.args.get("data_inicial", "")
    end_date = request.args.get("data_final", "")
    order_mode = request.args.get("ordenacao", "ASC")
    order_by = request.args.get("ordenar_por", "added_at")
    usuario = request.args.get("usuario", "")

    edited_by_user = aliased(User)
    user_user = aliased(User)

    query = (
        db.session.query(EditHistory)
        .join(edited_by_user, EditHistory.edited_by == edited_by_user.id)
        .join(user_user, EditHistory.user_id == user_user.id)
        .filter(EditHistory.object_type == "user")
    )

    if editado_por:
        query = query.filter(
            (edited_by_user.username.contains(editado_por))
            | (user_user.username.contains(editado_por))
        )

    if usuario:
        query = query.filter(user_user.username.contains(usuario))

    if start_date or end_date:
        if start_date:
            start_date = datetime.strptime(start_date, "%d/%m/%Y")
        else:
            start_date = db.session.query(
                func.min(EditHistory.added_at)
            ).scalar()

        if end_date:
            end_date = datetime.strptime(end_date, "%d/%m/%Y") + timedelta(
                hours=23, minutes=59, seconds=59
            )
        else:
            end_date = datetime.now() + timedelta(days=1)

        query = query.filter(EditHistory.added_at.between(start_date, end_date))

    query = query.order_by(
        getattr(EditHistory, order_by).asc()
        if order_mode == "ASC"
        else getattr(EditHistory, order_by).desc()
    )

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)  # type: ignore [paginate is a method on sqlalchemy.orm.query.Query]
    results = pagination.items

    identificador = f"historico-edicoes-usuarios-{editado_por}-{usuario}-{start_date}-{end_date}"
    hashed_query = hashlib.sha256(identificador.encode("utf-8")).hexdigest()
    cache.set(hashed_query, {"identifier": identificador, "data": query.all()})

    context = {
        "results": results,
        "pagination": pagination,
        "page": page,
        "per_page": per_page,
        "result_id": hashed_query,
    }

    return render_template("history-edits-users.html", **context)


@app.route("/historico-recargas")
def payments_history():
    recharge_type = request.args.get("recharge_type", "")
    allowed_by = request.args.get("allowed_by", "")
    allowed_for = request.args.get("allowed_for", "")
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")
    order_mode = request.args.get("order_mode", "ASC")
    order_by = request.args.get("order_by", "added_at")

    allowed_by_user = aliased(User)
    allowed_for_user = aliased(User)

    query = (
        db.session.query(Payment, allowed_by_user, allowed_for_user)
        .join(allowed_by_user, Payment.allowed_by == allowed_by_user.id)
        .join(allowed_for_user, Payment.user_id == allowed_for_user.id)
    )

    if recharge_type:
        query = query.filter(Payment.payment_method_id == recharge_type)

    if allowed_by:
        query = query.filter(
            or_(
                allowed_by_user.username.like(f"%{allowed_by}%"),
                allowed_by_user.name.like(f"%{allowed_by}%"),
            )
        )

    if allowed_for:
        query = query.filter(
            or_(
                allowed_for_user.username.like(f"%{allowed_for}%"),
                allowed_for_user.name.like(f"%{allowed_for}%"),
            )
        )

    if start_date:
        start_date = datetime.strptime(start_date, "%d/%m/%Y")
    else:
        start_date = datetime(year=2000, month=1, day=1)

    if end_date:
        end_date = datetime.strptime(end_date, "%d/%m/%Y")
    else:
        end_date = datetime.now()

    query = query.filter(Payment.added_at.between(start_date, end_date))

    query = query.order_by(
        getattr(Payment, order_by).asc()
        if order_mode == "ASC"
        else getattr(Payment, order_by).desc()
    )

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)  # type: ignore [paginate is a method on sqlalchemy.orm.query.Query]
    results = pagination.items

    payment_types = {
        str(id_): value_
        for id_, value_ in PaymentMethod.query.with_entities(
            PaymentMethod.id, PaymentMethod.name
        ).all()
    }

    identificador = f"historico-recargas-{recharge_type}-{allowed_by}-{allowed_for}-{start_date}-{end_date}"
    hashed_query = hashlib.sha256(identificador.encode("utf-8")).hexdigest()
    cache.set(
        hashed_query,
        {
            "identifier": identificador,
            "data": list(map(lambda row: row[0], query.all())),
        },
    )

    context = {
        "results": results,
        "pagination": pagination,
        "page": page,
        "per_page": per_page,
        "payment_types": payment_types,
        "result_id": hashed_query,
    }

    return render_template("payments-history.html", **context)


@app.route("/usuarios-com-saldo")
def users_with_balance():
    users = User.query.filter(User.balance > 0).all()
    identifier = f"usuarios-com-saldo-{datetime.now().timestamp()}"
    hashed_query = hashlib.sha256(identifier.encode("utf-8")).hexdigest()
    cache.set(hashed_query, {"identifier": identifier, "data": users})
    context = {"users": users, "result_id": hashed_query}
    return render_template("users-with-balance.html", **context)


@app.route("/usuários-com-saldo-devedor")
def users_with_balance_payroll():
    users = User.query.filter(User.balance_payroll > 0).all()
    identifier = f"usuarios-com-saldo-devedor-{datetime.now().timestamp()}"
    hashed_query = hashlib.sha256(identifier.encode("utf-8")).hexdigest()
    cache.set(hashed_query, {"identifier": identifier, "data": users})
    context = {"users": users, "result_id": hashed_query}
    return render_template("users-with-balance-payroll.html", **context)
