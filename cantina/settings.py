import random
import os

debug = os.getenv("DEBUG")
debug = debug or "false"
DEBUG = debug.lower() == "true"
"""Debug mode"""

SECRET_KEY = "".join([chr(random.randint(97, 122)) for i in range(32)])
"""Flask APP Secret Key"""

DB_PATH = os.path.join(os.getcwd(), "database.sqlite")
"""Database Sqlite3 PATH"""

PERMISSIONS = {
    "admin": ["static", "login", "/", "edit_password", "logout", "users", "index", "search_products", "add_to_cart", "confirm_purchase", "remove_from_cart", "profile"],
    "user": ["static", "login", "/", "edit_password", "users", "logout", "index", "add_to_cart", "search_products", "profile"],
    "aluno": ["login", "static", "users", "edit_password", "logout"],
    "guest": ["static", "login"]
}
"""Mapping of permissions to routes that can be accessed by roles"""
