from datetime import datetime, timedelta, timezone
from uuid import uuid4

import mercadopago
from cantina.models import Payment, User
from cantina.settings import MERCADO_PAGO_ACCESS_TOKEN
from mercadopago.config import RequestOptions

PIX_EXPIRATION_TIME_MINUTES = 10

sdk = mercadopago.SDK(MERCADO_PAGO_ACCESS_TOKEN)


def format_expiration_date(minutes: int) -> str:
    """
    Retorna uma string formatada com a data de expiração no formato:
    "yyyy-MM-dd HH:mm:ss.SSSz", adicionando o tempo em minutos à hora atual.
    """
    expiration_date = datetime.now(timezone(timedelta(hours=-3))) + timedelta(
        minutes=minutes
    )
    expiration_date_str = expiration_date.strftime("%Y-%m-%dT%H:%M:%S.%f")[
        :-3
    ] + expiration_date.strftime("%z")
    # Ajustar o formato do offset para ter o ':' (de "-0300" para "-03:00")
    return expiration_date_str[:-2] + ":" + expiration_date_str[-2:]


def generate_pix_payment(payment: Payment, user: User) -> dict:
    options = RequestOptions(custom_headers={"x-idempotency-key": str(uuid4())})

    expiration_date_str = format_expiration_date(PIX_EXPIRATION_TIME_MINUTES)
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
        "date_of_expiration": expiration_date_str,
    }

    result = sdk.payment().create(payment_data, options)
    result["response"]["point_of_interaction"]["transaction_data"][
        "expiration_date"
    ] = expiration_date_str

    return result["response"]["point_of_interaction"]


def get_payment(payment_id: str) -> dict:
    return sdk.payment().get(payment_id)["response"]
