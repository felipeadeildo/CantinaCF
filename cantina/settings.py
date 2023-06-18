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
    "admin": [
        "static", 
        "login", 
        "logout", 
        "users", 
        "edit_password", 
        "index", 
        "search_products", 
        "add_to_cart", 
        "confirm_purchase", 
        "remove_from_cart", 
        "profile", 
        "recharge", 
        "get_user",
        "generate_random_username"
    ],
    "user": [
        "static", 
        "login", 
        "logout", 
        "edit_password", 
        "users", 
        "index", 
        "add_to_cart", 
        "search_products", 
        "profile",
        "generate_random_username"
    ],
    "aluno": [
        "static",
        "login", 
        "logout",
        "profile",
        "generate_random_username"
    ],
    "guest": [
        "static", 
        "login"
    ]
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

SERIES = [
    '3º EM', '2º EM', '1º EM',
    '1º EF', '2º EF', '3º EF',
    '4º EF', '5º EF', '6º EF',
    '7º EF', '8º EF', '9º EF',
]
"""Series of School"""