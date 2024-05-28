from cantina.models import Role
from flask_jwt_extended import jwt_required
from flask_restful import Resource


class RoleResource(Resource):
    @jwt_required()
    def get(self):
        roles = Role.query.all()
        return [role.as_dict() for role in roles]
