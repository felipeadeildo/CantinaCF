import tempfile
from datetime import timedelta

from flask import Flask
from flask_caching import Cache
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restful import Api
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

from .settings import DB_PATH, DEBUG, SECRET_KEY, UPLOAD_FOLDER

SESSION_TYPE = "filesystem"
SESSION_PERMANENT = True
SESSION_USE_SIGNER = False
PERMANENT_SESSION_LIFETIME = timedelta(days=30)

tmp_dir = tempfile.mkdtemp(prefix="cantina_")

CACHE_TYPE = "FileSystemCache"
CACHE_DEFAULT_TIMEOUT = 60 * 3  # 3 minutes
CACHE_DIR = tmp_dir

settings_map = {
    "JWT_SECRET_KEY": SECRET_KEY,  # TODO: use another key
    "JWT_ACCESS_TOKEN_EXPIRES": timedelta(days=7),
    "SQLALCHEMY_DATABASE_URI": DB_PATH,
    "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    "SECRET_KEY": SECRET_KEY,
    "DEBUG": DEBUG,
    "UPLOAD_FOLDER": UPLOAD_FOLDER,
    "SESSION_TYPE": SESSION_TYPE,
    "SESSION_PERMANENT": SESSION_PERMANENT,
    "SESSION_USE_SIGNER": SESSION_USE_SIGNER,
    "PERMANENT_SESSION_LIFETIME": PERMANENT_SESSION_LIFETIME,
    "SITE_NAME": "CantinaCF",
    "CACHE_TYPE": CACHE_TYPE,
    "CACHE_DIR": CACHE_DIR,
    "CACHE_DEFAULT_TIMEOUT": CACHE_DEFAULT_TIMEOUT,
    "AUTHOR": {
        "name": "Felipe Adeildo",
        "email": "felipe.adeildo0@gmail.com",
        "instagram": "felipe.adeildo.old",
        "linkedin": "felipe-adeildo",
        "github": "felipe-adeildo",
    },
}

db = SQLAlchemy()
cache = Cache()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
socketio = SocketIO()

# ImportError: Cannot import name 'db' from partially initialized module 'cantina'
from .resources.api import api_bp  # noqa: E402

api = Api(api_bp)


def create_app(settings_map=settings_map):
    app = Flask(__name__, template_folder="templates", static_folder="static")

    app.config.from_mapping(settings_map)

    cache.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    socketio.init_app(app, cors_allowed_origins="*")

    from cantina.websockets import init_websockets

    init_websockets(app, socketio)

    app.register_blueprint(api_bp)

    resources_list = [
        ("UserResource", "/user"),
        ("UsersResource", "/users"),
        ("LoginResource", "/login"),
        ("CartResource", "/cart"),
        ("ProductsResource", "/products"),
        ("PurchaseResource", "/purchase"),
        ("RechargeResource", "/recharge"),
        ("DispatchResource", "/dispatch"),
    ]
    from cantina import resources

    for resource, url in resources_list:
        api.add_resource(getattr(resources, resource), url)

    register_cli_commands(app, db)

    return app


def register_cli_commands(app, db):
    from .database import create_superuser, init_db

    @app.cli.command("initdb")
    def init_db_command():
        init_db(db)

    @app.cli.command("createsuperuser")
    def create_superuser_command():
        create_superuser(db)
