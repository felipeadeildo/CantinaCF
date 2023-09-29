from . import app, db
from flask import request, render_template, redirect, url_for, flash, session
from .models import Route, CategoryPage, Page, Role, User, Payment, PaymentMethod
import json
from decimal import Decimal

@app.route('/administração/rotas', methods=('GET', 'POST'))
def routes():
    route_id = request.args.get('route_id')
    is_editor = False
    if route_id is not None:
        route = Route.query.filter_by(id=route_id).first()
        if route is None:
            flash("Rota de ID {} não encontrada!".format(route_id), category="error")
        else:
            is_editor = True
        if request.method == "POST":
            name = request.form.get("name")
            if name is not None and name != route.name:
                flash(f"Nome da rota alterada com sucesso ({route.name} -> {name})!", category="success")
                route.name = name
            db.session.commit()
        context = {
            'route': route,
            'is_editor': is_editor
        }
    else:
        context = {
            'routes': Route.query.all()
        }
    return render_template('admin/routes.html', **context)

@app.route("/administração/categorias-paginas", methods=('GET', 'POST'))
def category_pages():
    category_page_id = request.args.get('category_page_id')
    is_editor = False
    if category_page_id is not None:
        category_page = CategoryPage.query.filter_by(id=category_page_id).first()
        if category_page is None:
            flash("Categoria de página de ID {} não encontrada!".format(category_page_id), category="error")
        else:
            is_editor = True
        if request.method == "POST":
            name = request.form.get("name")
            description = request.form.get("description")
            if name is not None and name != category_page.name:
                flash(f"Nome da categoria de página alterada com sucesso ({category_page.name} -> {name})!", category="success")
                category_page.name = name
            if description is not None and description != category_page.description:
                flash(f"Descrição da categoria de página alterada com sucesso ({category_page.description} -> {description})!", category="success")
                category_page.description = description
            db.session.commit()
        context = {
            'category_page': category_page,
            'is_editor': is_editor
        }
    else:
        context = {
            'category_pages': CategoryPage.query.all()
        }
    return render_template('admin/category-pages.html', **context)


@app.route("/administração/paginas", methods=('GET', 'POST'))
def pages():
    page_id = request.args.get('page_id')
    is_editor = False
    if page_id is not None:
        page = Page.query.filter_by(id=page_id).first()
        if page is None:
            flash("Página de ID {} não encontrada!".format(page_id), category="error")
        else:
            is_editor = True
        if request.method == "POST":
            title = request.form.get("title")
            description = request.form.get("description")
            route_id = request.form.get("route_id")
            category_page_id = request.form.get("category_page_id")
            appear_navbar = request.form.get("appear_navbar") == 'on'
            if title is not None and title != page.title:
                flash(f"Nome da página alterada com sucesso ({page.title} -> {title})!", category="success")
                page.title = title
            if description is not None and description != page.description:
                flash(f"Descrição da página alterada com sucesso ({page.description} -> {description})!", category="success")
                page.description = description
            if route_id is not None and route_id != str(page.route_id):
                route = Route.query.filter_by(id=route_id).first()
                if route is None:
                    flash("Rota de ID {} não encontrada!".format(route_id), category="error")
                else:
                    flash(f"Rota da página alterada com sucesso ({page.route_id} -> {route_id})!", category="success")
                    page.route_id = route_id
                    page.route = route
            if category_page_id is not None and category_page_id != str(page.category_page_id):
                category_page = CategoryPage.query.filter_by(id=category_page_id).first()
                if category_page is None:
                    flash("Categoria de página de ID {} não encontrada!".format(category_page_id), category="error")
                else:
                    flash(f"Categoria de página da página alterada com sucesso ({page.category_page_id} -> {category_page_id})!", category="success")
                    page.category_page_id = category_page_id
                    page.category_page = category_page
            
            if appear_navbar != page.appear_navbar:
                flash(f"Aparece na Barra de Navegação da página alterada com sucesso ({page.appear_navbar} -> {appear_navbar})!", category="success")
                page.appear_navbar = appear_navbar
            db.session.commit()
        context = {
            'page': page,
            'is_editor': is_editor,
            'routes': Route.query.all(),
            'category_pages': CategoryPage.query.all()
        }
    else:
        context = {
            "pages": Page.query.all()
        }
    return render_template('admin/pages.html', **context)

@app.route("/administração/cargos", methods=('GET', 'POST'))
def roles():
    context = {}
    routes = {_route.id: _route for _route in Route.query.all()}
    action = request.args.get('action', 'view')
    if action == 'view':
        roles = []
        for role in Role.query.all():
            role = role.as_dict()
            role['allowed_routes'] = json.loads(role["allowed_routes"])
            role["allowed_routes"] = map(lambda route_id: routes[route_id], role["allowed_routes"])
            roles.append(role)
            context = {
                "roles": roles
            }
    elif action == 'edit':
        role_id = request.args.get('role_id')
        if role_id is None:
            flash("Primeiro você precisa especificar qual é o cargo né amore?", category="error")
            return redirect(url_for('roles', action='view'))
        role = Role.query.filter_by(id=role_id).first()
        if role is None:
            flash("Cargo de ID {} não encontrada!".format(role_id), category="error")
            return redirect(url_for('roles', action='view'))
        
        if request.method == "POST":
            name = request.form.get("name")
            if name is not None and name != role.name:
                flash(f"Nome do cargo alterado com sucesso ({role.name} -> {name})!", category="success")
                role.name = name
            description = request.form.get("description")
            if description is not None and description != role.description:
                flash(f"Descrição do cargo alterado com sucesso ({role.description} -> {description})!", category="success")
                role.description = description
            allowed_routes = request.form.getlist("allowed_routes[]")
            if allowed_routes is not None:
                try:
                    allowed_routes = list(map(int, allowed_routes))
                except ValueError:
                    flash("Então, a lista de cargos permitidos é inválida!", category="error")
                    return redirect(url_for('roles', action='view'))
                else:
                    old_allowed_routes = json.loads(role.allowed_routes)
                    for route_id in old_allowed_routes:
                        if route_id not in allowed_routes:
                            flash(f"Acesso à Rota '{routes[route_id].name}' (#{route_id}) foi removida do cargo!", category="success")
                    for route_id in allowed_routes:
                        if route_id not in old_allowed_routes:
                            flash(f"Acesso à Rota '{routes[route_id].name}' (#{route_id}) foi adicionada ao cargo!", category="success")
                    role.allowed_routes = json.dumps(allowed_routes)
            db.session.commit()
        role = role.as_dict()
        role["allowed_routes"] = json.loads(role["allowed_routes"])
        context = {
            "role": role,
            "routes": routes
        }
    elif action == "add":
        if request.method == 'POST':
            name = request.form.get('name')
            description = request.form.get('description')
            allowed_routes = request.form.getlist('allowed_routes[]')
            print(allowed_routes)
            try:
                allowed_routes = list(map(int, allowed_routes))
            except ValueError:
                flash("Então, a lista de cargos permitidos é inválida!", category="error")
                return redirect(url_for('roles', action='add'))
            already_exists = Role.query.filter_by(name=name).first() is not None
            if already_exists:
                flash(f"Já existe um cargo com o nome '{name}'!", category="error")
                return redirect(url_for('roles', action='add'))
            role = Role(name=name, description=description, allowed_routes=json.dumps(allowed_routes))
            db.session.add(role)
            db.session.commit()
            flash(f"Cargo adicionado '{name}' com sucesso!", category="success")
            return redirect(url_for('roles', action='edit', role_id=role.id))
        context = {
            "routes": routes
        }
    elif action == "delete":
        flash("Por enquanto essa funcionalidade está desativada para demais testes!", category="warning")
        return redirect(url_for('roles', action='view'))
        # role_id = request.args.get('role_id')
        # if role_id is None:
        #     flash("Primeiro você precisa especificar qual é o cargo né amore?", category="error")
        #     return redirect(url_for('roles', action='view'))
        # role = Role.query.filter_by(id=role_id).first()
        # if role is None:
        #     flash("Cargo de ID {} não encontrada!".format(role_id), category="error")
        #     return redirect(url_for('roles', action='view'))
        # db.session.delete(role)
        # db.session.commit()
        # flash("Cargo removido com sucesso!", category="success")
        # return redirect(url_for('roles', action='view'))
    return render_template("admin/roles.html", **context)


@app.route("/checkout-payroll", methods=("GET", "POST"))
def checkout_payroll():
    action = request.args.get("action", "view")
    search_query = request.args.get("q", "")
    users_balance_payroll_gt0 = User.query.filter(User.balance_payroll > 0, User.name.ilike(f"%{search_query}%")).all()
    if action == "view":
        return render_template("admin/checkout-payroll.html", target_users=users_balance_payroll_gt0)
    elif action == "checkout" and request.method == "POST":
        target_user_id = request.form.get("user_id")
        target_user = User.query.filter_by(id=target_user_id).first()
        if target_user is None:
            flash("Usuário de ID {} não encontrado!".format(target_user_id), category="error")
            return redirect(url_for("checkout_payroll", action="view"))
        value = request.form.get("value")
        if value is None:
            flash("Por favor, insira o valor do pagamento!", category="error")
            return redirect(url_for("checkout_payroll", action="view"))
        try:
            value = float(value)
        except ValueError:
            flash("Por favor, insira um valor numérico!", category="error")
            return redirect(url_for("checkout_payroll", action="view"))
        if value <= 0:
            flash("Então, espertinho(a), por favor, insira um estritamente positivo!", category="error")
            return redirect(url_for("checkout_payroll", action="view"))
        if value > float(target_user.balance_payroll):
            flash("Por favor, insira um valor menor ou igual ao saldo devedor do usuário!", category="error")
            return redirect(url_for("checkout_payroll", action="view"))
        
        old_balance = target_user.balance_payroll
        target_user.balance_payroll -= Decimal(value)
        payment_method = PaymentMethod.query.filter_by(name="System").first()
        new_payment = Payment(
            payment_method_id=payment_method.id,
            observations="(System) Baixa no pagamento",
            value=value,
            user_id=target_user.id,
            allowed_by=session["user"].id,
            is_paypayroll=True,
            status="accepted",
            payment_method=payment_method
        )
        db.session.add(new_payment)
        db.session.commit()
        flash(f"O saldo devedor do usuário {target_user.name} ({target_user.id}) foi atualizado de R$ {old_balance} para R$ {target_user.balance_payroll}!", category="success")
        return redirect(url_for('checkout_payroll', action="view"))
    else:
        flash("Funcionalidade requisitada é inválida!", category="error")
    return render_template("admin/checkout-payroll.html", target_users=users_balance_payroll_gt0)

