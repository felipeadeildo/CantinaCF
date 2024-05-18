from datetime import datetime

from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from werkzeug.datastructures import MultiDict

from cantina.models import Affiliation, Payment, User

from .. import db


class AffiliatesResource(Resource):
    def __filter_interval(
        self, query_string: MultiDict[str, str], query: ..., model: ...
    ):
        if unparsed_from := query_string.get("from"):
            parsed_from = datetime.strptime(
                unparsed_from, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")
            query = query.filter(model.added_at >= parsed_from)

        if unparsed_to := query_string.get("to"):
            parsed_to = datetime.strptime(
                unparsed_to, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")
            query = query.filter(model.added_at <= parsed_to)

        return query

    @jwt_required()
    def get(self):
        query_string = request.args

        user_id = query_string.get("userId")
        if not user_id:
            return {"message": "userId is required"}, 400

        if query_string.get("current", "").lower() == "true":
            query = (
                db.session.query(User)
                .join(Affiliation, Affiliation.affiliated_id == User.id)
                .filter(Affiliation.affiliator_id == user_id)
            )
        else:
            query = (
                db.session.query(User)
                .join(Payment, Payment.user_id == User.id)
                .distinct(Payment.user_id)
                .filter(Payment.payroll_receiver_id == user_id)
            )
            query = self.__filter_interval(query_string, query, Payment)

        results = query.all()

        return [user.as_dict() for user in results]

    @jwt_required()
    def post(self):
        data = request.json

        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        user_id = data.get("userId")
        if not user_id or user_id is None:
            return {"message": "ID do usuário deve ser especificado."}, 400

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return {"message": "Usuário não encontrado."}, 404

        for_user_id = data.get("forUserId")
        if not for_user_id or for_user_id is None:
            return {"message": "ID do usuário deve ser especificado."}, 400

        for_user = User.query.filter_by(id=for_user_id).first()
        if not for_user:
            return {"message": "Usuário não encontrado."}, 404

        affiliation = Affiliation.query.filter_by(affiliated_id=user.id).first()
        if affiliation:
            return {
                "message": f"Usuário já é afiliado ao usuário {affiliation.affiliator.name}"
            }, 400

        affiliation = Affiliation(affiliated_id=user.id, affiliator_id=for_user.id)
        db.session.add(affiliation)
        db.session.commit()

        return {
            "message": f"Usuário {user.name} adicionado como seu affiliado com sucesso!"
        }, 200

    @jwt_required()
    def delete(self):
        data = request.json
        if not data:
            return {"message": "Nenhum dado enviado."}, 400

        requester = User.query.filter_by(id=get_jwt_identity()).first()

        user_id = data.get("userId")
        if not user_id or user_id is None:
            return {"message": "ID do usuário deve ser especificado."}, 400

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return {"message": "Usuário não encontrado."}, 404

        from_user_id = data.get("fromUserId")
        if not from_user_id or from_user_id is None:
            return {"message": "ID do usuário deve ser especificado."}, 400

        from_user = User.query.filter_by(id=from_user_id).first()
        if not from_user:
            return {"message": "Usuário não encontrado."}, 404

        affiliation = Affiliation.query.filter_by(affiliated_id=user.id).first()
        if not affiliation:
            return {
                "message": "Este usuário não é afiliado à ninguém para que possa ser removido..."
            }, 404

        if affiliation.affiliator_id != from_user.id:
            return {
                "message": f"O atual afiliador do usuário {affiliation.affiliated.name} é {affiliation.affiliator.name}, portanto não pode ser removido!"
            }, 403

        if from_user.id != requester.id and requester.role_id != 1:
            return {
                "message": "Somente administradores podem remover afiliados de outros usuários."
            }, 403

        db.session.delete(affiliation)
        db.session.commit()

        return {"message": f"Usuário {user.name} removido com sucesso!"}, 200
