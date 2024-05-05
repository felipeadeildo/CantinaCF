from random import randint

from flask import Flask
from flask_jwt_extended import jwt_required
from flask_socketio import Namespace, emit  # type: ignore

from cantina import socketio
from cantina.models import Payment


class Payments(Namespace):
    def __init__(self, namespace: str, app: Flask):
        super().__init__(namespace)
        self.emit = emit
        self.app = app

    def __load_payments(self):
        with self.app.app_context():
            while True:
                payments = Payment.query.filter_by(status="to allow").all()

                socketio.emit(
                    "payments",
                    {"payments": [p.as_friendly_dict() for p in payments]},
                    namespace=self.namespace,
                )
                socketio.sleep(randint(1, 5))

    @jwt_required(locations=["query_string"])
    def on_connect(self):
        socketio.start_background_task(self.__load_payments)

    @jwt_required(locations=["query_string"])
    def on_disconnect(self):
        pass
