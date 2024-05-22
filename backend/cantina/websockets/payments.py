from flask import Flask

from cantina import socketio
from cantina.models import Payment

from .base import WSocket


class Payments(WSocket):
    def __init__(self, namespace: str, app: Flask):
        super().__init__(namespace, app)
        self.app = app

    def emitter(self):
        payments = Payment.query.filter_by(status="to allow").all()

        socketio.emit(
            "payments",
            {"payments": [p.as_dict() for p in payments]},
            namespace=self.namespace,
        )
