from .settings import SECRET_KEY, DEBUG, UPLOAD_FOLDER, CSRF_HEADER_NAME, DB_PATH
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_seasurf import SeaSurf
from flask_migrate import Migrate
from flask_caching import Cache
from datetime import timedelta
from flask import Flask
import tempfile
import threading

lock = threading.Lock()

SESSION_TYPE = 'filesystem'
SESSION_PERMANENT = True
SESSION_USE_SIGNER = False
PERMANENT_SESSION_LIFETIME = timedelta(days=30)

tmp_dir = tempfile.mkdtemp(prefix='cantina_')

CACHE_TYPE = 'FileSystemCache'
CACHE_DEFAULT_TIMEOUT = 60*3 # 3 minutes
CACHE_DIR = tmp_dir

CSRF_COOKIE_TIMEOUT = timedelta(days=30)
CSRF_COOKIE_NAME = 'csrf-token-topzera'

settings_map = {
    'SQLALCHEMY_DATABASE_URI': DB_PATH,
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'SECRET_KEY': SECRET_KEY,
    'DEBUG': DEBUG,
    'UPLOAD_FOLDER': UPLOAD_FOLDER,
    'SESSION_TYPE': SESSION_TYPE,
    'SESSION_PERMANENT': SESSION_PERMANENT,
    'SESSION_USE_SIGNER': SESSION_USE_SIGNER,
    'PERMANENT_SESSION_LIFETIME': PERMANENT_SESSION_LIFETIME,
    'CSRF_COOKIE_NAME': CSRF_COOKIE_NAME,
    'CSRF_COOKIE_TIMEOUT': CSRF_COOKIE_TIMEOUT,
    'CSRF_HEADER_NAME': CSRF_HEADER_NAME,
    'SITE_NAME': 'CF Cantina',
    'CACHE_TYPE': CACHE_TYPE,
    'CACHE_DIR': CACHE_DIR,
    'CACHE_DEFAULT_TIMEOUT': CACHE_DEFAULT_TIMEOUT,
    'AUTHOR': {
        'name': 'Felipe Adeildo',
        'whatsapp': '558294011841',
        'email': 'felipe.adeildo0@gmail.com',
        'instagram': 'felipe.adeildo.new',
        'linkedin': 'felipe-adeildo',
        'github': 'sr-pato',
    }
}


app = Flask(__name__, template_folder='templates', static_folder='static')

app.config.from_mapping(settings_map)

Session(app)
SeaSurf(app)
cache = Cache(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from . import functionalities
from . import cantina
from . import auth
from . import api
from . import database
from . import admin
from . import tasks