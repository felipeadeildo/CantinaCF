from cantina.models import User
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource


class UserResource(Resource):
    @jwt_required()
    def get(self):
        data = request.args
        if not data:
            current_user_id = get_jwt_identity()
            data = {"id": current_user_id}
        user = User.query.filter_by(id=data.get("id")).first()
        if not user:
            return {"message": "Usuário não encontrado."}, 404

        return {"user": user.as_dict()}

    # TODO: CRUD
