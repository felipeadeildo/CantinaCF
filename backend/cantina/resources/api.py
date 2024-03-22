from flask import Blueprint

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.before_request
def check_permission():
    """Check user permission before each request"""


def role_has_permission(role_name: str):
    """Check if user has permission to access current endpoint"""

    # role = Role.query.filter_by(name=role_name).first()
    # if role is None:
    #     raise Exception(f"Role {role_name} not found!")
    # allowed_routes_ids = json.loads(role.allowed_routes)
    # session["allowed_routes"] = Route.query.filter(Route.id.in_(allowed_routes_ids)).all()
    # session["permissions"] = list(map(lambda route: route.endpoint, session["allowed_routes"]))
    # session["navbar_pages"] = Page.query.filter_by(appear_navbar=True).all()
    # session["navbar_pages"] = [
    #     p for p in session["navbar_pages"] if p.route.id in allowed_routes_ids
    # ]
    # return request.endpoint in session["permissions"]
