from datetime import datetime

from cantina.models import Payment, User
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from werkzeug.datastructures import MultiDict

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

    # @jwt_required()
    def get(self):
        query_string = request.args

        user_id = query_string.get("userId")
        if not user_id:
            return {"message": "userId is required"}, 400

        query = (
            db.session.query(User)
            .join(Payment, Payment.user_id == User.id)
            .distinct(Payment.user_id)
            .where(Payment.payroll_receiver_id == user_id)
        )
        query = self.__filter_interval(query_string, query, Payment)
        
        print(query.statement)

        results = query.all()

        return [user.as_dict() for user in results]
