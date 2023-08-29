import random
import os
import json

config = json.load(open("config.json", encoding="utf-8"))

debug = os.getenv("DEBUG")
debug = debug or "false"
DEBUG = debug.lower() == "true"
"""Debug mode"""

SECRET_KEY = "".join([chr(random.randint(97, 122)) for i in range(32)])
"""Flask APP Secret Key"""

CSRF_HEADER_NAME = "".join([chr(random.randint(97, 122)) for i in range(32)])
"""Random CSRF Header Name"""

DB_PATH = 'sqlite:///database.sqlite3'
"""Database URI"""


# static/uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), "cantina", "static", "uploads")
"""Upload folder to save uploaded files with proof of recharge"""

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


ALLOWED_EXTENSIONS = set(config["allowed_extensions"])
"""Allowed extensions for uploaded files"""

SERIES = config["series"]
"""Series of School"""