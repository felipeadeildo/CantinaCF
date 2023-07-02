import random
import os

debug = os.getenv("DEBUG")
debug = debug or "false"
DEBUG = debug.lower() == "true"
"""Debug mode"""

SECRET_KEY = "".join([chr(random.randint(97, 122)) for i in range(32)])
"""Flask APP Secret Key"""

CSRF_HEADER_NAME = "".join([chr(random.randint(97, 122)) for i in range(32)])
"""Random CSRF Header Name"""

DB_PATH = os.path.join(os.getcwd(), "database.sqlite")
"""Database Sqlite3 PATH"""

PERMISSIONS = {
    "admin": [
        "static",  # arquivos static
        "login",  # rota de login
        "logout",  # rota de logout
        "users", # rota de usários (permite a inclusão de novos usários)
        "edit_password",  # rota de editar senha (permite a alteração de senha)
        "index", # rota da cantina (permite venda) 
        "search_products_api",  # rota de pesquisa de produtos (usado na cantina)
        "add_to_cart_api",  # rota de adicionar produtos ao carrinho
        "confirm_purchase",  # rota de confirmar compra
        "remove_from_cart_api",  # rota de remover produtos do carrinho
        "profile",  # rota de perfil (mostra informações do perfil)
        "get_user_api", # rota de obter dados do perfil
        "generate_random_username_api", # rota de gerar nome de usuário (usado na criação de usuário)
        "edit_profile",  # rota de editar perfil
        "recharge",  # rota de recarga
        "payments_verification", # rota de verificação de pagamentos feitos pelos alunos
        "get_payments_api",  # rota de verificação de pagamentos feitos pelos alunos
        "refill_manage_request_api", # rota de verificação de pagamentos feitos pelos alunos
        "refill_requests", # rota de verificação de pagamentos feitos pelos alunos
        "stock_control", # rota de controle de estoque
        "stock_history" # rota de histórico de estoque
    ],
    "user": [
        "static", 
        "login", 
        "logout", 
        "edit_password", 
        "users", 
        "index", 
        "add_to_cart_api", 
        "search_products_api", 
        "profile",
        "generate_random_username_api"
    ],
    "aluno": [
        "static",
        "login", 
        "logout",
        "profile",
        "generate_random_username_api",
        "recharge",
        "edit_password",
    ],
    "vendedor": [
        "static",
        "login",
        "logout",
        "profile",
        "index",
        "add_to_cart_api",
        "search_products_api",
        "confirm_purchase",
        "remove_from_cart_api",
    ],

    "caixa": [
        "static",
        "login",
        "logout",
        "profile",
        
    ],

    "guest": [
        "static", 
        "login"
    ]
}
"""Mapping of permissions to routes that can be accessed by roles"""

# static/uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), "cantina", "static", "uploads")
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