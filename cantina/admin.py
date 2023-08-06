from . import app, db
from flask import request, render_template, redirect, url_for, flash
from .models import Route, CategoryPage, Page, Role, PaymentMethod, EditHistory


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