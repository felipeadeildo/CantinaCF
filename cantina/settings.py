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
        "get_payments_api",  # rota de verificação de pagamentos feitos pelos alunos
        "refill_manage_request_api", # rota de verificação de pagamentos feitos pelos alunos
        "refill_requests", # rota de verificação de pagamentos feitos pelos alunos
        "stock_control", # rota de controle de estoque
        "stock_history", # rota de histórico de estoque
        "export_to_excel_api", # rota que permite exportar para escel determinado resultado em cache
        "products", # rota que faz listagem paginada dos produtos
        "edit_product", # rota que perite a editção de um determinado produto especificado
        "sales_history", # rota que lisa o o histórico de vendas paginado (salva resultado em cache para export_to_excel_api)
        "affiliates", # rota que permite que um funcionário possa gerenciar seus afiliados (adicionar, remover, visualizar)
        "affiliates_history", # permite que o funcionário veja o histórico de transações de seus afiliados na categoria de folha de pagamento pra que pague
        "filter_today_sales", # aliases para filtrar resultados de vendas somente por HOJE
        "pay_payroll", # permite fazer o pagamento do que se tem acumulado na folha de pagamento
        "history_edits_products", # visualização de histórico de edições de produtos
        "history_edits_users", # visualização de histórico de edições de usuários
    ],
    "Funcionário": [
        "static", 
        "login", 
        "logout", 
        "edit_password", 
        "profile",
        "affiliates",
        "affiliates_history",
        "recharge",
        "pay_payroll"
    ],
    "Aluno": [
        "static",
        "login", 
        "logout",
        "profile",
        "edit_password",
        "recharge",
    ],
    "Vendedor": [
        "static",
        "login",
        "logout",
        "profile",
        "index",
        "add_to_cart_api",
        "search_products_api",
        "confirm_purchase",
        "remove_from_cart_api",
        "affiliates",
        "affiliates_history",
        "recharge",
        "stock_control",
        "stock_history",
        "sales_history",
        "export_to_excel_api"
    ],
    "Caixa": [
        "static",
        "login",
        "logout",
        "profile",
        "recharge",
        "get_payments_api", 
        "refill_manage_request_api",
        "refill_requests",
        "affiliates",
        "affiliates_history",
        "stock_control",
        "stock_history",
        "get_payments_api",
        "refill_manage_request_api", 
        "refill_requests",
        "filter_today_sales",
        "sales_history",
        "export_to_excel_api"
    ],
    "guest": [
        "static", 
        "login",
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
    'payroll': 'Folha de Pagamento',
}

SERIES = [
    '1º EM', '2º EM', '3º EM',
    '1º EF', '2º EF', '3º EF',
    '4º EF', '5º EF', '6º EF',
    '7º EF', '8º EF', '9º EF',
]
"""Series of School"""