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
    "admin": ["static", "login", "/", "edit_password", "logout", "users", "index", "search_products", "add_to_cart", "confirm_purchase", "remove_from_cart", "profile", 'recharge', "get_user"],
    "user": ["static", "login", "/", "edit_password", "users", "logout", "index", "add_to_cart", "search_products", "profile"],
    "aluno": ["login", "static", "users", "edit_password", "logout"],
    "guest": ["static", "login"]
}
"""Mapping of permissions to routes that can be accessed by roles"""

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
"""Upload folder to save uploaded files with proof of recharge"""

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}
"""Allowed extensions for uploaded files"""

PAYMENT_TYPES = {
    'cash': 'Espécie',
    'debit_card': 'Cartão de Débito',
    'credit_card': 'Cartão de Crédito',
    'pix': 'PIX',
}