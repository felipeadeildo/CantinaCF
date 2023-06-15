import sqlite3
import os
from .settings import DB_PATH
from flask import g, abort
from getpass import getpass
from werkzeug.security import generate_password_hash
from . import app

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

    conn = get_conn()
    conn.execute("INSERT INTO user (username, password, role, name) VALUES (?, ?, ?, ?)", (username, hashed_password, role, name))
    conn.commit()


def update_user_password(identification: int, new_password: str):
    """
    Updates a user's password.
    """
    conn = get_conn()
    conn.execute("UPDATE user SET password = ? WHERE id = ?", (generate_password_hash(new_password), identification))
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
    """
    conn = get_conn()
    if by == "id":
        return conn.execute("SELECT * FROM produto WHERE id = ?", (kwargs.get("id"),)).fetchone()
    elif by == "name":
        return conn.execute("SELECT * FROM produto WHERE name = ?", (kwargs.get("name"),)).fetchone()



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