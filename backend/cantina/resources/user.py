from cantina.models import User
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from sqlalchemy import or_


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


class UsersResource(Resource):
    @jwt_required()
    def get(self):
        data = request.args or dict()
        query = data.get("query")
        user_query = User.query
        if query:
            user_query = user_query.filter(
                or_(
                    User.name.contains(query),
                    User.username.contains(query),
                    User.matricula.contains(query),
                    User.id == query,
                )
            )

        users = user_query.all()

        return {"users": [user.as_dict() for user in users]}
