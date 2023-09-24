from flask import flash, redirect, render_template, request, session, url_for, abort, g
from .models import User, Route, Role, Route, Page, Task
from werkzeug.security import check_password_hash
from . import app, lock
import json



@app.route("/login", methods=("GET", "POST"))
def login():
    """Login page"""
    user_id = session["user_id"] if session.get("user_id") != "Guest" else None
    if user_id is not None:
        flash(f"Você já está logado como {session['user'].name}.", category="warning")
        return redirect(url_for("index"))
    elif request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        user = User.query.filter((User.username == username) | (User.matricula == username)).first()
        if user is None:
            flash("Usuário e/ou Senha incorretos.", category="error")
        elif not verify_password(password, user.password):
            flash("Usuário e/ou Senha incorretos.", category="error")
        else:
            login_user(user)
            flash("Você está logado com sucesso!", category="success")
            return redirect(url_for("index"))
    return render_template("login.html")


@app.route('/sair')
def logout():
    """Logout"""
    session.clear()
    return redirect(url_for("login"))


def verify_password(password, hashed_password):
    """Verify password"""
    return check_password_hash(hashed_password, password)


def login_user(user):
    """Login user"""
    session["user_id"] = user.id
    session["user"] = user


def set_guest_user():
    """Set user_id to 'Guest' in session"""
    session["user_id"] = "Guest"


@app.before_request
def check_permission():
    """Check user permission before each request"""
    current_user_id = session.get("user_id")
    if current_user_id is None: # the first request to the app
        set_guest_user() # set user_id to 'guest' in session
        flash("Você não está logado", category="warning")
        return redirect(url_for("login")) # redirect to login page
    
    if current_user_id == "Guest" and not role_has_permission("Guest"):
        flash("Você não está logado", category="warning")
        return redirect(url_for("login"))
    
    if current_user_id != "Guest":
        user = User.query.filter_by(id=current_user_id).first()
        session["user"] = user
        if user is None:
            abort(404) # user not found
        if not role_has_permission(user.role.name):
            abort(403) # user does not have permission

    session["cart"] = [task.target for task in Task.query.filter_by(user_id=current_user_id, type="product_cleanup", is_done=False).all()]
    g.current_endpoint = Route.query.filter_by(endpoint=request.endpoint).first()
    if g.current_endpoint.block_recurring_access:
        lock.acquire()

def role_has_permission(role_name:str):
    """Check if user has permission to access current endpoint"""
    role = Role.query.filter_by(name=role_name).first()
    if role is None:
        raise Exception(f"Role {role_name} not found!")
    allowed_routes_ids = json.loads(role.allowed_routes)
    session["allowed_routes"] = Route.query.filter(Route.id.in_(allowed_routes_ids)).all()
    session["permissions"] = list(map(lambda route: route.endpoint, session["allowed_routes"]))
    session["navbar_pages"] = Page.query.filter_by(appear_navbar=True).all()
    session["navbar_pages"] = [p for p in session["navbar_pages"] if p.route.id in allowed_routes_ids]
    return request.endpoint in session["permissions"]


@app.after_request
def after_request(response):
    try:
        lock.release()
    except RuntimeError:
        pass
    return response