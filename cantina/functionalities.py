from .db import get_user, get_users, insert_user, update_user_password, get_transactions, update_user_saldo, insert_recharge, update_user_key
from flask import abort, request, session, render_template, flash, redirect, url_for
from .settings import PERMISSIONS, UPLOAD_FOLDER, ALLOWED_EXTENSIONS, SERIES
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from .auth import verify_password
from datetime import datetime
from . import app
import os


@app.route("/usuarios", methods=("POST", "GET"))
def users():
    if request.method == "POST":
        if session["user"]["role"] != "admin":
            abort(403)
        username = request.form.get("username")
        password = request.form.get("password")
        name = request.form.get("name")
        role = request.form.get("role")
        serie = request.form.get("serie")
        turma = request.form.get("turma")
        if get_user(username, by="username") is None:
            insert_user(username, generate_password_hash(password), role, name=name, serie=serie, turma=turma)
            flash(f"Usuário {username} foi registrado com sucesso!", category="success")
        else:
            flash(f"Usuário {username} já existe!", category="warning")
    
    context = {
        "users": get_users(),
        "roles": list(PERMISSIONS.keys()),
        "series": SERIES
    }

    return render_template("users.html", **context)

def security_edit_password(to_change_user, changer_user, old_password, new_password):
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
    user_id = request.args.get("user_id")
    if user_id is None:
        user_id = session.get("user")["id"]
    user = get_user(user_id)
    context = {
        "user": user,
        "transactions": get_transactions(user["id"])
    }
    return render_template("profile.html", **context)


@app.route("/editar-perfil", methods=("POST", "GET"))
def edit_profile():
    user = request.args.get("user_id")
    if user is None:
        flash("Por favor, insira a matricula do usuário!", category="error")
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
            if old_value != value:
                flash(f"Alteração de {key} foi feita com sucesso ({old_value} -> {value})!", category="success")

    user = get_user(user["id"])
    context = {
        "user": user,
        "roles": list(PERMISSIONS.keys()),
        "series": SERIES
    }
    
    return render_template("edit-profile.html", **context)


def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def security_recharge():
    user_id = request.form.get("matricula")
    if user_id is None:
        flash("Por favor, insira a matricula do usuário!", category="error")
        return
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
    new_value = user["saldo"] + value
    observations = request.form.get("observations")
    if payment_method != 'cash':
        file = request.files.get("proof")
        if file is None:
            flash("Por favor, insira o documento de pagamento!", category="error")
            return
        current_datetime_str = datetime.now().strftime("%Y-%m-%d %H-%M-%S")
        filename = secure_filename(f"{user_id}.{payment_method}.{current_datetime_str}.{file.filename}")
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        insert_recharge(user_id, session["user"]["id"], value, payment_method, filename=filename, observations=observations)
    else:
        insert_recharge(user_id, session["user"]["id"], value, payment_method, observations=observations)
    update_user_saldo(user_id, new_value)
    flash(f"Saldo de {user['name']} atualizado com sucesso!", category="success")
    


@app.route('/recarregar', methods=["POST", "GET"])
def recharge():
    if request.method == "POST":
        security_recharge()
    return render_template('recharge.html')