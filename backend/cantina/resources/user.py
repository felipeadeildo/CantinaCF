from cantina.models import User
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from sqlalchemy import or_

from .. import db


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

    @jwt_required()
    def post(self):
        data = request.json
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        user = User.query.filter_by(username=data.get("username")).first()
        if user:
            return {"message": f"Usuário {user.username} já existe."}, 400

        if data.get("role_id") == "3":
            user = User.query.filter_by(matricula=data.get("matricula")).first()
            if user:
                return {"message": f"Matrícula {user.matricula} já existe."}, 400

        try:
            # TODO: make it more secure
            user = User(**data)
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            print(e)
            return {"message": "Erro ao criar o usuário."}, 500

        return {
            "message": f"Usuário {user.name} criado com sucesso.",
            "user": user.as_dict(),
        }, 201

    def __update_info(self, user: User, data: dict, current_user: User):
        if current_user.id != user.id and not current_user.role_id == 1:
            return {
                "message": "Tentando alterar informação de outro usuário sem permissão. Este incidente será reportado (sudo lol)."
            }, 400

        # TODO: Remove some infos when the user isnt admin, foe example, the role cant be changed to admin from a non admin

        for key, value in data.items():
            # TODO: make it more secure (password can be set directly?!)
            setattr(user, key, value)
        db.session.commit()
        return {"message": "Usuário atualizado com sucesso.", "user": user.as_dict()}

    def __update_password(self, user: User, data: dict, current_user: User):
        if current_user.id != user.id and not current_user.role_id == 1:
            return {
                "message": "Tentando alterar senha de outro usuário sem permissão. Este incidente será reportado (sudo lol)."
            }, 400

        requires_old_password = (
            user.id != current_user.id and not current_user.role_id == 1
        )
        old_password = data.get("oldPassword")
        new_password = data.get("newPassword")

        if requires_old_password and not old_password:
            return {"message": "Senha antiga deve ser especificada."}, 400

        if requires_old_password and not current_user.verify_password(
            str(old_password)
        ):
            return {"message": "Senha antiga não confere."}, 400

        if not new_password:
            return {"message": "Nova senha deve ser especificada."}, 400

        user.set_password(new_password)
        db.session.commit()
        return {"message": "Senha atualizada com sucesso."}

    @jwt_required()
    def put(self):
        data = request.json
        query = request.args

        update_type = query.get("type", "info")
        methods = {
            "info": self.__update_info,
            "password": self.__update_password,
        }
        fn = methods.get(update_type)

        if not fn:
            return {"message": "Tipo de atualização inválido."}, 400

        user_id = get_jwt_identity()
        current_user = User.query.filter_by(id=user_id).first()
        if not current_user:
            return {"message": "Você não foi encontrado. Faça login novamente."}, 404

        if not data:
            return {"message": "Nenhum dado enviado."}, 400
        user = User.query.filter_by(id=data.get("id")).first()
        if user is None:
            return {"message": "Usuário não encontrado."}, 404

        return fn(user, data, current_user)


class UsersResource(Resource):
    @jwt_required()
    def get(self):
        data = request.args or dict()
        query = data.get("query")
        only_balance = data.get("onlyBalance") == "true"
        only_balance_payroll = data.get("onlyBalancePayroll") == "true"
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

        if only_balance:
            user_query = user_query.filter(User.balance > 0)

        if only_balance_payroll:
            user_query = user_query.filter(User.balance_payroll > 0)

        users = user_query.all()

        return {"users": [user.as_dict() for user in users]}
