from datetime import datetime

from cantina import db
from cantina.utils import verify_password
from flask import url_for
from sqlalchemy import event
from werkzeug.security import generate_password_hash


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    added_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        data.update(
            {
                "added_at": self.added_at.strftime("%d/%m/%Y %H:%M"),
                "updated_at": self.updated_at.strftime("%d/%m/%Y %H:%M"),
            }
        )
        return data


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    matricula = db.Column(db.String(15), nullable=True, info={"label": "Matrícula"})
    name = db.Column(db.Text, nullable=False, info={"label": "Nome"})
    username = db.Column(
        db.Text, unique=True, nullable=False, info={"label": "Usuário"}
    )
    role_id = db.Column(db.Integer, db.ForeignKey("role.id"), nullable=False)
    password = db.Column(db.Text, nullable=False)
    balance = db.Column(
        db.DECIMAL(10, 2), nullable=False, default=0, info={"label": "Saldo"}
    )
    balance_payroll = db.Column(
        db.DECIMAL(10, 2), nullable=False, default=0, info={"label": "Saldo Devedor"}
    )
    serie = db.Column(db.Text, info={"label": "Série"})
    turm = db.Column(db.Text, info={"label": "Turma"})
    telephone = db.Column(db.Text, info={"label": "Telefone"})
    cpf = db.Column(db.Text, info={"label": "CPF"})
    email = db.Column(db.Text, info={"label": "E-mail"})
    added_at = db.Column(
        db.DateTime, default=datetime.now, info={"label": "Data de cadastro"}
    )
    updated_at = db.Column(
        db.DateTime, default=datetime.now, info={"label": "Data de atualização"}
    )

    role = db.relationship("Role", backref="users")

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        data.update(
            {
                "balance": float(self.balance),
                "balance_payroll": float(self.balance_payroll),
                "added_at": self.added_at.strftime("%d/%m/%Y %H:%M"),
                "updated_at": self.updated_at.strftime("%d/%m/%Y %H:%M"),
            }
        )
        data.pop("password", None)
        return data

    def as_friendly_dict(self):
        dict_info = {
            c.info.get("label", c.name): getattr(self, c.name)
            for c in self.__table__.columns
            if c.name not in ("password", "role_id")
        }
        dict_info.update(
            {
                User.added_at.info.get("label", "added_at"): self.added_at.strftime(
                    "%d/%m/%Y às %H:%M"
                ),
                User.updated_at.info.get(
                    "label", "updated_at"
                ): self.updated_at.strftime("%d/%m/%Y às %H:%M"),
                User.balance.info.get("label", "balance"): float(self.balance),
                User.balance_payroll.info.get("label", "balance_payroll"): float(
                    self.balance_payroll
                ),
            }
        )
        return dict_info

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.set_password(self.password)
        self.username = self.username.lower()

    def set_password(self, password: str):
        self.password = generate_password_hash(password)

    def verify_password(self, password: str):
        return verify_password(password, self.password)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, info={"label": "Nome"})
    value = db.Column(db.DECIMAL(10, 2), nullable=False, info={"label": "Valor (R$)"})
    quantity = db.Column(db.Integer, nullable=False, info={"label": "Quantidade"})
    added_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        data.update(
            {
                "value": float(self.value),
                "added_at": self.added_at.strftime("%d/%m/%Y %H:%M"),
                "updated_at": self.updated_at.strftime("%d/%m/%Y %H:%M"),
            }
        )
        return data


class ProductSale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(
        db.Integer, db.ForeignKey("product.id"), info={"label": "Produto"}
    )
    value = db.Column(db.DECIMAL(10, 2), nullable=False, info={"label": "Valor (R$)"})
    sold_by = db.Column(
        db.Integer, db.ForeignKey("user.id"), info={"label": "Vendido Por"}
    )
    sold_to = db.Column(
        db.Integer, db.ForeignKey("user.id"), info={"label": "Vendido Para"}
    )
    added_at = db.Column(
        db.DateTime, default=datetime.now, info={"label": "Vendido em"}
    )
    dispatched_by = db.Column(
        db.Integer, db.ForeignKey("user.id"), info={"label": "Despachado Por"}
    )
    dispatched_at = db.Column(db.DateTime, info={"label": "Despachado em"})
    status = db.Column(db.String(20), info={"label": "Status"})

    product = db.relationship("Product", backref="products_sales")

    @property
    def sold_by_user(self):
        return User.query.get(self.sold_by) if self.sold_by else None

    @property
    def sold_to_user(self):
        return User.query.get(self.sold_to) if self.sold_to else None

    @property
    def dispatched_by_user(self):
        return User.query.get(self.dispatched_by) if self.dispatched_by else None

    @property
    def formatted_added_at(self):
        return self.added_at.strftime("%d/%m/%Y %H:%M")

    def as_dict(self):
        data = {}
        for c in self.__table__.columns:
            key = c.name
            if key in ("sold_by", "sold_to", "dispatched_by"):
                value = (
                    user.as_dict() if (user := getattr(self, f"{key}_user")) else None
                )
            elif key in ("product_id",):
                key = "product"
                value = getattr(self, "product").as_dict()
            elif key in ("added_at", "dispatched_at"):
                value = (
                    get_friendly_datetime(getattr(self, key))
                    if getattr(self, key)
                    else ""
                )
            elif key in ("value",):
                value = float(getattr(self, key))
            else:
                value = getattr(self, key)
            data[key] = value
        return data

    def as_friendly_dict(self):
        status_map = {
            "dispatched": "Despachado",
            "to dispatch": "Para Despachar",
        }
        data = {}
        for c in self.__table__.columns:
            key = c.name
            friendly_key = c.info.get("label", key)
            if key in ("sold_by", "sold_to", "dispatched_by"):
                value = (
                    f"{user.name} ({user.id})"
                    if (user := getattr(self, f"{key}_user"))
                    else None
                )
            elif key in ("product_id",):
                value = (
                    f"{product.name} ({product.id})"
                    if (product := getattr(self, "product"))
                    else None
                )
            elif key in ("added_at", "dispatched_at"):
                value = (
                    get_friendly_datetime(getattr(self, key))
                    if getattr(self, key)
                    else ""
                )
            elif key in ("value",):
                value = float(getattr(self, key))
            elif key == "status":
                value = (
                    status_map.get(status) if (status := getattr(self, key)) else status
                )
            else:
                value = getattr(self, key)
            data[friendly_key] = value
        return data


class PaymentMethod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    need_proof = db.Column(db.Boolean, default=False)
    added_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)
    is_payroll = db.Column(db.Boolean, default=False)
    is_protected = db.Column(db.Boolean, default=False)

    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        data.update(
            {
                "added_at": self.added_at.strftime("%d/%m/%Y %H:%M"),
                "updated_at": self.updated_at.strftime("%d/%m/%Y %H:%M"),
            }
        )
        return data


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment_method_id = db.Column(
        db.Integer,
        db.ForeignKey("payment_method.id"),
        info={"label": "Método de Pagamento"},
    )
    observations = db.Column(db.Text, info={"label": "Observações"})
    value = db.Column(db.DECIMAL(10, 2), nullable=False, info={"label": "Valor (R$)"})
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), info={"label": "Usuário"})
    allowed_by = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        info={"label": "Permitido / Rejeitado por"},
    )
    proof_path = db.Column(db.Text, info={"label": "Comprovante"})
    added_at = db.Column(
        db.DateTime, default=datetime.now, info={"label": "Data de Pagamento"}
    )
    payroll_receiver_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=True,
        info={"label": "Recebedor da Cobrança"},
    )
    is_paypayroll = db.Column(
        db.Boolean, default=False, info={"label": "Pagamento da Folha de Pagamento?"}
    )
    status = db.Column(db.String(20), info={"label": "Status"})

    payment_method = db.relationship("PaymentMethod", backref="payments")
    payroll_receiver = db.relationship(
        "User", foreign_keys=[payroll_receiver_id], backref="payroll_receivers"
    )

    @property
    def formatted_added_at(self):
        return self.added_at.strftime("%d/%m/%Y %H:%M")

    @property
    def user(self):
        return User.query.get(self.user_id)

    @property
    def proof_url(self):
        if self.proof_path:
            return url_for("static", filename=f"uploads/{self.proof_path}")

    @property
    def allowed_by_user(self):
        return User.query.get(self.allowed_by)

    def as_dict(self):
        data = {}
        for c in self.__table__.columns:
            key = c.name
            if key in ("user_id",):
                key = "user"
                value = self.user.as_dict()
            elif key in ("allowed_by",):
                key = "allowed_by_user"
                value = self.allowed_by_user.as_dict() if self.allowed_by else None
            elif key in ("added_at",):
                value = get_friendly_datetime(getattr(self, key))
            elif key in ("payment_method_id",):
                key = "payment_method"
                value = self.payment_method.name
            elif key in ("value",):
                value = float(getattr(self, key))
            elif key in ("payroll_receiver_id",):
                key = "payroll_receiver"
                value = (
                    self.payroll_receiver.as_dict() if self.payroll_receiver else None
                )
            else:
                value = getattr(self, key)
            data[key] = value
        return data

    def as_friendly_dict(self):
        status_map = {
            "to allow": "Pendente",
            "accepted": "Permitido",
            "rejected": "Rejeitado",
        }
        data = {}
        for c in self.__table__.columns:
            key = c.name
            friendly_key = c.info.get("label", key)
            if key in ("user_id",):
                value = f"{self.user.name} ({self.user.id})"
            elif key in ("allowed_by",):
                value = (
                    f"{self.allowed_by_user.name} ({self.allowed_by_user.id})"
                    if self.allowed_by
                    else None
                )
            elif key in ("added_at",):
                value = get_friendly_datetime(getattr(self, key))
            elif key in ("payment_method_id",):
                value = self.payment_method.name
            elif key in ("value",):
                value = float(getattr(self, key))
            elif key in ("payroll_receiver_id",):
                value = (
                    f"{self.payroll_receiver.name} ({self.payroll_receiver.id})"
                    if self.payroll_receiver
                    else None
                )
            elif key in ("status",):
                value = (
                    status_map.get(status, status)
                    if (status := getattr(self, key))
                    else None
                )
            else:
                value = getattr(self, key)
            data[friendly_key] = value
        return data


class Affiliation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    affiliated_id = db.Column(db.Integer, db.ForeignKey("user.id"))  # afiliado
    affiliator_id = db.Column(db.Integer, db.ForeignKey("user.id"))  # afiliador
    affiliated = db.relationship(
        "User", foreign_keys=[affiliated_id], backref="affiliations"
    )
    affiliator = db.relationship(
        "User", foreign_keys=[affiliator_id], backref="affiliated_users"
    )

    added_at = db.Column(db.DateTime, default=datetime.now)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class EditHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    added_at = db.Column(db.DateTime, default=datetime.now, info={"label": "Criado em"})
    edited_by = db.Column(
        db.Integer, db.ForeignKey("user.id"), info={"label": "Editado por"}
    )
    key = db.Column(db.Text, info={"label": "Chave"})
    old_value = db.Column(db.Text, info={"label": "Valor anterior"})
    new_value = db.Column(db.Text, info={"label": "Novo valor"})
    reason = db.Column(db.Text, nullable=False, info={"label": "Motivo da Mudança"})

    object_type = db.Column(db.String(50), info={"label": "Objeto Atualizado"})

    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    role_id = db.Column(db.Integer, db.ForeignKey("role.id"))
    payment_method_id = db.Column(db.Integer, db.ForeignKey("payment_method.id"))

    def __repr__(self):
        return f"<EditHistory {self.object_type} ({self.key}) [{self.old_value} -> {self.new_value}]>"

    @property
    def edited_by_user(self):
        return User.query.get(self.edited_by)

    @property
    def formatted_added_at(self):
        return self.added_at.strftime("%d/%m/%Y às %H:%M")

    @property
    def product(self):
        return Product.query.get(self.product_id) if self.product_id else None

    @property
    def user(self):
        return User.query.get(self.user_id) if self.user_id else None

    def as_friendly_dict(self):
        data = {}
        for c in self.__sable__.columns:
            key = c.info.get("label", c.name)
            if c.name in ("added_at",):
                value = get_friendly_datetime(getattr(self, c.name))
            elif c.name in ("edited_by",):
                value = get_user_name_and_id(getattr(self, c.name))
            elif c.name in ("object_type",):
                if self.object_type == "product":
                    value = get_product_name_and_id(getattr(self, c.name))
                elif self.object_type == "user":
                    value = get_user_name_and_id(getattr(self, c.name))
                elif self.object_type == "role":
                    value = get_role_name_and_id(getattr(self, c.name))
                elif self.object_type == "payment_method":
                    value = get_payment_method_name_and_id(getattr(self, c.name))
                else:
                    value = getattr(self, c.name)
            else:
                value = getattr(self, c.name)
            data[key] = value
        return data


class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    quantity = db.Column(db.Integer, default=1)
    added_at = db.Column(db.DateTime, default=datetime.now)

    @property
    def product(self):
        return Product.query.get(self.product_id)

    @property
    def user(self):
        return User.query.get(self.user_id)

    def as_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product": self.product.as_dict(),
            "quantity": self.quantity,
            "added_at": self.added_at.strftime("%d/%m/%Y %H:%M"),
        }


def setup_updated_at_listener(classe):
    @event.listens_for(classe, "before_update")
    def before_update(mapper, connection, classe):
        classe.updated_at = datetime.now()


models_can_be_updated = (PaymentMethod, Product, User, Role)
for model in models_can_be_updated:
    setup_updated_at_listener(model)


def get_user_name_and_id(user_id):
    """
    Get the name and ID of a user based on their user ID.

    Parameters:
        user_id (int): The ID of the user.

    Returns:
        str: The name and ID of the user in the format "{name} ({id})".
    """
    user = User.query.filter_by(id=user_id).first()
    return f"{user.name} ({user.id})" if user else user_id


def get_product_name_and_id(product_id):
    """
    Get the name and ID of a product.

    Parameters:
        product_id (int): The ID of the product.

    Returns:
        str: The name and ID of the product in the format "{name} ({id})".
    """
    product = Product.query.filter_by(id=product_id).first()
    return f"{product.name} ({product.id})" if product else product_id


def get_role_name_and_id(role_id):
    """
    Get the name and ID of a role.

    Parameters:
        role_id (int): The ID of the role.

    Returns:
        str: The name and ID of the role in the format "{name} ({id})".
    """
    role = Role.query.filter_by(id=role_id).first()
    return f"{role.name} ({role.id})" if role else role_id


def get_payment_method_name_and_id(payment_method_id):
    """
    Get the name and ID of a payment_method.

    Parameters:
        payment_method_id (int): The ID of the payment_method.

    Returns:
        str: The name and ID of the payment_method in the format "{name} ({id})".
    """
    payment_method = PaymentMethod.query.filter_by(id=payment_method_id).first()
    return (
        f"{payment_method.name} ({payment_method.id})"
        if payment_method
        else payment_method_id
    )


def get_friendly_datetime(dtime):
    """
    Takes a datetime object and returns a formatted string representing the date and time in a friendly format.

    Parameters:
    - dtime (datetime): The datetime object to format.

    Returns:
    - str: The formatted string representing the date and time.
    """
    return dtime.strftime("%d/%m/%Y às %H:%M")
