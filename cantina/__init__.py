from flask import Flask
from flask_session import Session
from datetime import timedelta
import tempfile
from .settings import SECRET_KEY, DEBUG


SESSION_TYPE = 'filesystem'
SESSION_PERMANENT = True
SESSION_USE_SIGNER = False
PERMANENT_SESSION_LIFETIME = timedelta(days=30)

tmp_dir = tempfile.mkdtemp(prefix='cantina_')

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['DEBUG'] = DEBUG 
app.config["SESSION_TYPE"] = SESSION_TYPE
app.secret_key = SECRET_KEY
Session(app)


from . import db
from . import auth
from . import cantina
from . import api