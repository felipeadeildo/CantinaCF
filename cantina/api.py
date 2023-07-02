from .db import get_conn, get_product, update_product_quantity, get_user, update_user_saldo
from flask import request, jsonify, session
from . import app


@app.route("/api/pesquisar-produto", methods=["POST"])
def search_products_api():
    """
    Handle API requests for searching products.

    Returns:
    - A JSON response containing a list of products that match the search query.
    """
    data = request.get_json()
    query = data.get("query")
    conn = get_conn()
    products = conn.execute(
        "SELECT * FROM produto WHERE nome LIKE ? OR id = ?",
        ("%{}%".format(query), query)
    ).fetchall()
    products = [dict(product) for product in products]
    return jsonify(products)


@app.route("/api/adicionar-ao-carrinho", methods=["POST"])
def add_to_cart_api():
    """
    Adds a product to the cart API.

    :return: The JSON response containing the status of the operation.
    :rtype: dict
    """
    data = request.get_json()
    product_id = data.get("id")
    conn = get_conn()
    try:
        product = get_product(id=product_id)
        update_product_quantity(id=product_id, quantity=product["quantidade"] - 1)
        conn.commit()
    except Exception as e:
        context = {
            "message": "Alguma coisa deu errado...",
            "ok": False
        }
        return jsonify(context), 201
    else:
        context = {
            "message": f"Produto {product['nome']} adicionado com sucesso!",
            "product": dict(product),
            "ok": True
        }
        context["product"]["quantidade"] -= 1
        session["cart"].append(context["product"])
        return jsonify(context)


@app.route("/api/remover-do-carrinho", methods=["POST"])
def remove_from_cart_api():
    """
    Removes a product from the shopping cart.

    This API endpoint is used to remove a product from the shopping cart. It expects a POST request
    with a JSON payload containing the product ID. The function retrieves the product ID from the
    request payload and iterates through the session's cart to find the corresponding product. If
    found, it removes the product from the cart and updates the quantity of the product in the
    database. Finally, it returns a JSON response with a success message and the updated product
    information.

    Returns:
        A JSON response containing a success message and the updated product information.
    """
    data = request.get_json()
    product_id = data.get("id")
    for product in session["cart"]:
        if product["id"] == product_id:
            session["cart"].remove(product)
            break
    product = dict(get_product(id=product_id))
    product["quantidade"] += 1
    update_product_quantity(id=product_id, quantity=product["quantidade"])
    return jsonify({
        "message": f"Produto {product['nome']} removido com sucesso!",
        "product": product,
    })


@app.route("/api/obter-usuario", methods=["POST"])
def get_user_api():
    """
    Retrieves a user from the API based on the provided user ID.
    
    Returns a JSON response containing either an error message and a boolean value indicating if the user was found or not,
    or a success message and a dictionary representing the user.
    """
    data = request.get_json()
    user_id = data.get("id")
    user = get_user(user_id)
    if user is None:
        context = {
            "message": f"Usuário de ID {user_id} não encontrado!",
            "user": False
        }
    else:
        context = {
            "message": f"Comprimente bem o usuário {user['name']}! :D",
            "user": dict(user)
        }
    return jsonify(context)

@app.route("/api/gerar-usuario-aleatorio", methods=["POST"])
def generate_random_username_api():
    """
    Generate a random username for the API.
    
    This function receives a POST request to the endpoint '/api/gerar-usuario-aleatorio' and generates a random username based on the provided name parameter. If the name parameter is not provided, it defaults to 'aluno usuario'. The generated username is then checked against existing usernames in the database and if it already exists, a number is appended to the username. Finally, the generated username is returned as a response in JSON format.
    
    Parameters:
        None
        
    Returns:
        A JSON response containing the generated username. The response has the following format:
        {
            "username": "The generated username"
        }
    """
    data = request.get_json()
    name = data.get("name", "aluno usuario").lower().split()
    if len(name) >= 2:
        username = f"{name[0]}.{name[1]}"
    else:
        username = name[0]
    conn = get_conn()
    # get usersnames that startswith the username
    usernames = conn.execute("SELECT username FROM user WHERE username LIKE ?", ("%{}%".format(username),)).fetchall()
    if len(usernames) > 0:
        username = f"{username}{len(usernames)}"
    return jsonify({
        "username": username
    })

@app.route("/api/obter-pagamentos", methods=["POST"])
def get_payments_api():
    """
    Retrieves payments based on a query string and returns them as a JSON response.

    Returns:
        A JSON response containing a list of payments.
    """
    data = request.get_json()
    query = data.get("query")
    conn = get_conn()
    payments = conn.execute("SELECT * FROM controle_pagamento WHERE (liberado_por IS NULL AND id LIKE ?) ORDER BY id ASC", ("%{}%".format(query),)).fetchall()
    payments = [dict(payment) for payment in payments]
    for payment in payments:
        payment["user"] = dict(get_user(payment["aluno_id"]))
        payment["is_approved"] = payment["liberado_por"] is not None
        # TODO: Adicionar url para visualização do comprovante
    return jsonify(payments)


@app.route("/api/editar-pagamento", methods=["POST"])
def refill_manage_request_api():
    """
    A function to handle API requests for editing payments.
    
    Returns:
        A JSON response containing a message and a boolean indicating success or failure.
    """
    data = request.get_json()
    payment_id = data.get("id")
    accepted = data.get("accept")
    conn = get_conn()
    payment_infos = conn.execute("SELECT * FROM controle_pagamento WHERE id = ?", (payment_id,)).fetchone()
    if payment_infos is None:
        return jsonify({
            "message": f"Pagamento de ID {payment_id} não encontrado!",
            "error": True
        })
    
    requester = get_user(payment_infos["aluno_id"])
    new_saldo = requester["saldo"] + payment_infos["valor"]
    if accepted:
        update_user_saldo(user_id=payment_infos["aluno_id"], new_saldo=new_saldo)
        conn.execute("UPDATE controle_pagamento SET liberado_por = ? WHERE id = ?", (session["user"]["id"], payment_id))
        conn.commit()
        message = f"Pagamento de ID {payment_id} liberado com sucesso! Saldo atualizado para {new_saldo} para o usuário {requester['name']}"
        ok = True
    else:
        conn.execute("DELETE FROM controle_pagamento WHERE id = ?", (payment_id,))
        # TODO: apagar comprovante do static/uploads
        conn.commit()
        message = f"Pagamento de ID {payment_id} cancelado!"
        ok = False
    
    return jsonify({
        "message": message,
        "ok": ok
    })