import hashlib
import json

from werkzeug.security import check_password_hash

from cantina.settings import ALLOWED_EXTENSIONS


def verify_password(password, hashed_password):
    """Verify password"""
    return check_password_hash(hashed_password, password)


def allowed_file(filename):
    """
    Check if the given filename is allowed based on its extension.

    Parameters:
        filename (str): The name of the file to check.

    Returns:
        bool: True if the file is allowed, False otherwise.
    """
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_query_hash(params: dict):
    """Generate a hash query based on the given parameters.

    Args:
        params (dict): The parameters to be hashed.
    """
    params_string = json.dumps(params, sort_keys=True)
    return hashlib.sha256(params_string.encode("utf-8")).hexdigest()
