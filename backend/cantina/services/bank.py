from datetime import datetime, timedelta
from uuid import uuid4

import mercadopago
from cantina.models import Payment, User
from cantina.settings import MERCADO_PAGO_ACCESS_TOKEN
from mercadopago.config import RequestOptions

sdk = mercadopago.SDK(MERCADO_PAGO_ACCESS_TOKEN)


def generate_pix_payment(payment: Payment, user: User) -> dict:
    options = RequestOptions(custom_headers={"x-idempotency-key": str(uuid4())})
    expiration_date = (datetime.now() + timedelta(minutes=10)).isoformat() + "-03:00"

    payment_data = {
        "transaction_amount": float(payment.value),
        "payment_method_id": "pix",
        "payer": {
            "email": user.email or "contato@colegiofantastico.com",
            "first_name": user.name.split()[0],
            "last_name": user.name.split()[1],
        },
        "description": f"CantinaCF Recarga para {user.id} ({user.username})",
        "metadata": {
            "payment_id": payment.id,
            "user_id": user.id,
        },
        "external_reference": payment.id,
        "date_of_expiration": expiration_date,
    }

    result = sdk.payment().create(payment_data, options)
    result["response"]["point_of_interaction"]["transation_data"]["expiration_date"] = (
        expiration_date
    )

    return result["response"]["point_of_interaction"]


def get_payment(payment_id: str) -> dict:
    return sdk.payment().get(payment_id)["response"]
