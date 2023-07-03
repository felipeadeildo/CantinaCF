from werkzeug.security import generate_password_hash
from .settings import DB_PATH, SERIES
from datetime import datetime
from flask import g, abort, url_for
from getpass import getpass
from . import app
import sqlite3
import os

def get_conn(ignore_errors=False):
    """
    Returns a connection to the SQLite database located at DB_PATH if it exists.
    
    :return: A connection object to the SQLite database located at DB_PATH.
    :rtype: sqlite3.Connection
    
    :raises: 503 error if the database file does not exist.
    """
    if not os.path.isfile(DB_PATH) and not ignore_errors:
        print("The db file does not exist.")
        abort(503)
    
    # TODO: Make this more robust.
    try:
        session_db = g.get("db")
    except RuntimeError:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    else:
        if session_db is None:
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            g.db = conn
    return g.db


def close_db():
    """
    Closes the database connection.
    """
    db = g.pop("db", None)
    if db is not None:
        db.close()

@app.after_request
def after_request(response):
    """Closes the database connection after each request"""
    close_db()
    return response


def get_user(identification: int, by: str = "id"):
    """
    Retrieves a user from the database by either their ID or username.

    :param identification: An integer representing the user's ID or a string representing their username.
    :param by: A string indicating whether to search by ID or username. Defaults to "id".
    :return: A tuple representing the user's information from the database or None if not found.
    :raises: Exception if an invalid 'by' parameter is provided.
    """
    conn = get_conn()
    if by == "id":
        return conn.execute("SELECT * FROM user WHERE id = ?", (identification,)).fetchone()
    elif by == "username":
        return conn.execute("SELECT * FROM user WHERE username = ?", (identification,)).fetchone()
    raise Exception("Invalid by parameter")


def insert_user(username: str, hashed_password: str, role: str, **kwargs):
    """
    Inserts a user into the database.

    :param username: A string representing the user's username.
    :param hashed_password: A string representing the user's hashed password.
    :param role: A string representing the user's role. Can be "user" or "admin".
    :param kwargs: Additional parameters where "name" is the user's name.
    """
    if kwargs.get("name") is not None:
        name = kwargs.get("name")
    else:
        name = username.capitalize()
    
    serie = kwargs.get("serie")
    if serie is not None:
        serie = SERIES[int(serie)]
    turma = kwargs.get("turma")
    if turma is not None:
        turma = turma.lower()

    conn = get_conn()
    conn.execute("INSERT INTO user (username, password, role, name, serie, turma) VALUES (?, ?, ?, ?, ?, ?)", (username, hashed_password, role, name, serie, turma))
    conn.commit()


def update_user_password(identification: int, new_password: str):
    """
    Updates a user's password.
    """
    conn = get_conn()
    conn.execute("UPDATE user SET password = ? WHERE id = ?", (generate_password_hash(new_password), identification))
    conn.commit()


def update_user_saldo(user_id: int, new_saldo: float):
    """
    Updates a user's saldo.
    """
    conn = get_conn()
    conn.execute("UPDATE user SET saldo = ? WHERE id = ?", (new_saldo, user_id))
    conn.commit()


def insert_product_sales(sold_by: int, sold_to: int, products: list):
    """
    Inserts a product sale into the database.
    """
    current_datetime = datetime.now()
    current_datetime_str = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    turno = "Manhã" if current_datetime.hour < 12 else "Tarde"
    
    query_values = [
        (current_datetime_str, product['id'], sold_by, sold_to, turno) for product in products
    ]

    conn = get_conn()
    conn.executemany("INSERT INTO venda_produto (data_hora, produto_id, vendido_por, vendido_para, turno) VALUES (?, ?, ?, ?, ?)", query_values)
    conn.commit()

def get_users():
    """
    Retrieves all user from the database.

    :return: A list of dictionaries, where each dict represents a row in the user table.
    """
    conn = get_conn()
    return conn.execute("SELECT * FROM user").fetchall()


def get_products():
    """
    Retrieves all products from the database.
    """
    conn = get_conn()
    return conn.execute("SELECT * FROM produto").fetchall()


def get_product(by: str = "id", **kwargs):
    """
    Retrieves a product from the database.
    :param by: A string indicating whether to search by ID or name.
    :param kwargs: Additional parameters where "id" is the product's ID and "name" is the product's name.
    """
    conn = get_conn()
    if by == "id":
        return conn.execute("SELECT * FROM produto WHERE id = ?", (kwargs.get("id"),)).fetchone()
    elif by == "name":
        return conn.execute("SELECT * FROM produto WHERE name = ?", (kwargs.get("name"),)).fetchone()


def update_product_quantity(by: str = "id", **kwargs):
    """
    Updates the quantity of a product in the database.
    """
    conn = get_conn()
    if by == "id":
        conn.execute("UPDATE produto SET quantidade = ? WHERE id = ?", (kwargs.get("quantity"), kwargs.get("id")))
    elif by == "name":
        conn.execute("UPDATE produto SET quantidade = ? WHERE name = ?", (kwargs.get("quantity"), kwargs.get("name")))
    conn.commit()

def normalize_datetime(date: str, format: str = "%Y-%m-%d %H:%M:%S", output_format: str = "%d/%m/%y %H:%M"):
    return datetime.strptime(date, format).strftime(output_format)

def get_transactions(user_id: int, type: str = "all"):
    """
    Retrieves all transactions from the database.

    :param user_id: An integer representing the user's ID.
    :param type: A string representing the type of transaction to retrieve. Possible values are "all", "entrada", and "saida".
    """
    conn = get_conn()
    transactions = []
    if type == "all":
        transactions.extend(get_transactions(user_id, "entrada"))
        transactions.extend(get_transactions(user_id, "saida"))
    elif type == "entrada":
        result = conn.execute("SELECT * FROM controle_pagamento WHERE aluno_id = ?", (user_id,)).fetchall()
        for transaction in result:
            transaction = dict(transaction)
            transaction["liberado_por"] = get_user(transaction["liberado_por"])
            transaction["tipo"] = "entrada"
            transaction["data_hora"] = normalize_datetime(transaction["data_hora"])
            transactions.append(transaction)
    elif type == "saida":
        result = conn.execute("SELECT * FROM venda_produto WHERE vendido_para = ?", (user_id,)).fetchall()
        for transaction in result:
            transaction = dict(transaction)
            transaction["product"] = dict(get_product("id", id=transaction["produto_id"]))
            transaction["vendido_por"] = dict(get_user(transaction["vendido_por"]))
            transaction["tipo"] = "saida"
            transaction["data_hora"] = normalize_datetime(transaction["data_hora"])
            transactions.append(transaction)
    transactions.sort(key=lambda x: x["data_hora"], reverse=True)
    return transactions


def insert_recharge(user_id: int, value: float, payment_type: str, **kwargs):
    """
    Inserts a recharge into the database.
    """
    current_datetime = datetime.now()
    current_datetime_str = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    turno = "Manhã" if current_datetime.hour < 12 else "Tarde"
    conn = get_conn()
    if kwargs.get("observation") is not None:
        observation = kwargs.get("observation")
    else:
        observation = None
    if kwargs.get("filename") is not None:
        filename = kwargs.get("filename")
    else:
        filename = None
    conn.execute("INSERT INTO controle_pagamento (tipo_pagamento, descricao, aluno_id, data_hora, turno, comprovante, valor) VALUES (?, ?, ?, ?, ?, ?, ?)", (payment_type, observation, user_id, current_datetime_str, turno, filename, value))
    conn.commit()

def update_user_key(user_id: int, key: str, value: str|int|float):
    """
    Updates a user's key.
    """
    conn = get_conn()
    old_value = conn.execute(f"SELECT {key} FROM user WHERE id = ?", (user_id,)).fetchone()[0]
    if old_value != value:
        conn.execute(f"UPDATE user SET {key} = ? WHERE id = ?", (value, user_id))
        conn.commit()
    return old_value

def insert_product(**kwargs):
    """
    Inserts a product into the database.
    :params kwargs: Product information: name, quantity, price, description.
    """
    conn = get_conn()
    conn.execute(
        "INSERT INTO produto (nome, quantidade, valor, descricao, tipo) VALUES (?, ?, ?, ?, ?)", 
        (kwargs.get("name"), kwargs.get("quantity"), kwargs.get("value"), kwargs.get("description"), kwargs.get("type"))
    )
    conn.commit()
    last_id = conn.execute("SELECT id FROM produto ORDER BY id DESC LIMIT 1").fetchone()[0]
    return last_id


def record_stock_history(product_id: int, quantity: int, received_by: int, valor_compra: float, valor_venda: float, **kwargs):
    """
    Insert a record into the stock history table.

    Parameters:
        product_id (int): The ID of the product.
        quantity (int): The quantity of the product.
        received_by (int): The ID of the person who received the product.
        valor_compra (float): The purchase value of the product.
        valor_venda (float): The selling value of the product.
        **kwargs: Additional keyword arguments.

    Returns:
        None
    """
    conn = get_conn()
    conn.execute(
        "INSERT INTO historico_abastecimento_estoque (descricao, produto_id, quantidade, recebido_por, valor_compra, valor_venda) VALUES (?, ?, ?, ?, ?, ?)",
        (kwargs.get("description"), product_id, quantity, received_by, valor_compra, valor_venda)
    )
    conn.commit()



def get_refill_requests():
    """
    Retrieves all refill requests from the database.
    """
    conn = get_conn()

    result = conn.execute("SELECT * FROM controle_pagamento WHERE liberado_por IS NULL").fetchall()
    results = [dict(request) for request in result]
    for result in results:
        result["aluno"] = get_user(result["aluno_id"])
        filename = f'uploads/{result["comprovante"]}'
        result["comprovante_url"] = url_for("static", filename=filename)
    return results

@app.cli.command("initdb")
def init_db():
    """
    Initializes the database.
    """
    print("Initializing database...")
    db = get_conn(ignore_errors=True)
    with open(os.path.join(os.getcwd(), "schema.sql"), "r", encoding="utf8") as f:
        db.cursor().executescript(f.read())
    db.commit()
    print("Database initialized.")


@app.cli.command("createsuperuser")
def create_superuser():
    """
    Creates a superuser.
    """
    print("Creating superuser...")
    print("Insert the username and password for superuser: ")
    username = input("Username: ")
    while True:
        password = getpass("Password: ")
        if password == "":
            print("Password cannot be empty.")
            continue
        confimation_password = getpass("Confirm password: ")
        if password != confimation_password:
            print("Passwords do not match.")
            continue
        break
    insert_user(username, generate_password_hash(password), "admin")
    print("Superuser created.")