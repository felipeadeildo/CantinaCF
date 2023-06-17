from flask import flash, redirect, render_template, request, session, url_for, abort
from werkzeug.security import check_password_hash, generate_password_hash
from .db import get_user, get_users, insert_user, update_user_password, get_transactions
from .settings import PERMISSIONS
from . import app


@app.route("/login", methods=("GET", "POST"))
def login():
    user_id = session["user_id"] if session.get("user_id") != "guest" else None
    if user_id is not None:
        flash(f"Você já está logado como {session['user']['name']}.", category="warning")
    elif request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        user = get_user(username, by="username")
        if user is None:
            flash("Usuário e/ou Senha incorretos.", category="error")
        elif not verify_password(password, user["password"]):
            flash("Usuário e/ou Senha incorretos.", category="error")
        else:
            login_user(user)
            flash("Você está logado com sucesso!", category="success")
    return render_template("login.html")

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for("login"))

def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)
    
def login_user(user):
    session["user_id"] = user["id"]
    session["user"] = dict(user)

@app.before_request
def check_permission():
    """Check user permission before each request"""
    current_user_id = session.get("user_id")
    if current_user_id is None: # the first request to the app
        set_guest_user() # set user_id to 'guest' in session
        flash("Você não está logado", category="warning")
        return redirect(url_for("login")) # redirect to login page
    
    if current_user_id == "guest" and not role_has_permission("guest"):
        flash("Você não está logado", category="warning")
        return redirect(url_for("login"))
    
    if current_user_id != "guest":
        user = get_user(current_user_id, by="id")
        if user is None:
            abort(404) # user not found
        if not role_has_permission(user["role"]):
            abort(403) # user does not have permission
    
    if "cart" not in session:
        session["cart"] = []
    


def set_guest_user():
    """Set user_id to 'guest' in session"""
    session["user_id"] = "guest"


def role_has_permission(role):
    """Check if user has permission to access current endpoint"""
    permitted_endpoints = PERMISSIONS.get(role, [])
    return request.endpoint in permitted_endpoints
    


@app.route("/users", methods=("POST", "GET"))
def users():
    if request.method == "POST":
        if session["user"]["role"] != "admin":
            abort(403)
        username = request.form.get("username")
        password = request.form.get("password")
        name = request.form.get("name")
        role = request.form.get("role")
        if get_user(username, by="username") is None:
            insert_user(username, generate_password_hash(password), role, name=name)
            flash(f"Usuário {username} foi registrado com sucesso!", category="success")
        else:
            flash(f"Usuário {username} já existe!", category="warning")
    
    context = {
        "users": get_users(),
        "roles": list(PERMISSIONS.keys()),
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

    
@app.route("/edit-password", methods=("POST", "GET"))
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

@app.route("/profile")
def profile():
    context = {
        "user": session.get("user"),
        "transactions": get_transactions(session["user"]["id"])
    }
    return render_template("profile.html", **context)

@app.route("/edit-profile")
def edit_profile():
    return render_template("edit-profile.html")