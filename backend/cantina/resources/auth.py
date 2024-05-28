from flask import request
from flask_jwt_extended import create_access_token
from flask_restful import Resource

from cantina.models import User


class LoginResource(Resource):
    def post(self):
        if not request.json:
            return {"message": "Nenhum dado enviado."}, 400

        username = request.json.get("username", None)
        password = request.json.get("password", None)

        user = User.query.filter(
            (User.username == username) | (User.matricula == username)
        ).first()
        if user is None or not user.verify_password(password):
            return {"message": "Usuário e/ou Senha incorretos."}, 400
        else:
            access_token = create_access_token(
                identity=user.id, additional_claims={"role": user.role.name}
            )
            return {
                "token": access_token,
                "message": "Login efetuado com sucesso.",
            }, 200
