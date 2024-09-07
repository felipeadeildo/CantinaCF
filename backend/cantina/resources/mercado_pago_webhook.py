import hashlib
import hmac

from cantina.models import Payment
from cantina.resources.recharge import RechargeResource
from cantina.services import get_payment
from cantina.settings import MERCADO_PAGO_SECRET
from flask import request
from flask_restful import Resource


class MercadoPagoWebhookResource(Resource):
    @property
    def is_signature_valid(self) -> bool:
        x_signature = request.headers.get("x-signature")
        x_request_id = request.headers.get("x-request-id")
        if not x_signature or not x_request_id:
            return False

        # Extract the query parameter `data.id`
        data_id = request.args.get("data.id", "")

        # Split the x-signature header
        parts = x_signature.split(",")
        ts = None
        received_hash = None
        for part in parts:
            key_value = part.split("=", 1)
            if len(key_value) == 2:
                key = key_value[0].strip()
                value = key_value[1].strip()
                if key == "ts":
                    ts = value
                elif key == "v1":
                    received_hash = value

        if not ts or not received_hash:
            return False

        manifest = f"id:{data_id};request-id:{x_request_id};ts:{ts};"

        hmac_obj = hmac.new(
            MERCADO_PAGO_SECRET.encode(),
            msg=manifest.encode(),
            digestmod=hashlib.sha256,
        )
        generated_hash = hmac_obj.hexdigest()

        return hmac.compare_digest(generated_hash, received_hash)

    def post(self):
        if not self.is_signature_valid:
            return {"message": "Assinatura inválida."}, 400

        payment_id = request.args.get("data.id")
        if not payment_id:
            return {"message": "ID de pagamento inválido."}, 403

        payment_infos = get_payment(payment_id)
        db_payment_id = payment_infos["external_reference"]

        if payment_infos["status"] == "approved":
            payment = Payment.query.filter_by(id=db_payment_id).first()
            RechargeResource.update_payment(payment, True)
        return {"message": "OK"}, 200
