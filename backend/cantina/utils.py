from werkzeug.security import check_password_hash


def verify_password(password, hashed_password):
    """Verify password"""
    return check_password_hash(hashed_password, password)
