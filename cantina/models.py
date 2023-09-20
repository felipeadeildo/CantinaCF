from . import db
from datetime import datetime
from sqlalchemy import event
from flask import url_for


class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    endpoint = db.Column(db.Text, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now)
    block_recurring_access = db.Column(db.Boolean, default=False)


class CategoryPage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.now)


class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False, default="")
    route_id = db.Column(db.Integer, db.ForeignKey('route.id'), nullable=False)
    category_page_id = db.Column(db.Integer, db.ForeignKey('category_page.id'), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now)
    appear_navbar = db.Column(db.Boolean, default=False)

    route = db.relationship('Route', backref='pages')
    category_page = db.relationship('CategoryPage', backref='pages')


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    allowed_routes = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    added_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    matricula = db.Column(db.String(15), nullable=True, info={"label": "Matrícula"})
    name = db.Column(db.Text, nullable=False, info={"label": "Nome"})
    username = db.Column(db.Text, unique=True, nullable=False, info={"label": "Usuário"})
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    password = db.Column(db.Text, nullable=False)
    balance = db.Column(db.DECIMAL(10, 2), nullable=False, default=0, info={"label": "Saldo"})
    balance_payroll = db.Column(db.DECIMAL(10, 2), nullable=False, default=0, info={"label": "Saldo Devedor"})
    serie = db.Column(db.Text, info={"label": "Série"})
    turm = db.Column(db.Text, info={"label": "Turma"})
    telephone = db.Column(db.Text, info={"label": "Telefone"})
    cpf = db.Column(db.Text, info={"label": "CPF"})
    email = db.Column(db.Text, info={"label": "E-mail"})
    added_at = db.Column(db.DateTime, default=datetime.now, info={"label": "Data de cadastro"})
    updated_at = db.Column(db.DateTime, default=datetime.now, info={"label": "Data de atualização"})

    role = db.relationship('Role', backref='users')

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    def as_friendly_dict(self):
        dict_info = {c.info.get("label", c.name): getattr(self, c.name) for c in self.__table__.columns if c.name not in ('password', 'role_id')}
        dict_info.update({
            User.added_at.info.get("label", "added_at"): self.added_at.strftime("%d/%m/%Y às %H:%M"),
            User.updated_at.info.get("label", "updated_at"): self.updated_at.strftime("%d/%m/%Y às %H:%M"),
            User.balance.info.get("label", "balance"): float(self.balance),
            User.balance_payroll.info.get("label", "balance_payroll"): float(self.balance_payroll),
        })
        return dict_info


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, info={"label": "Nome"})
    description = db.Column(db.Text, nullable=True, info={"label": "Descrição"})
    value = db.Column(db.DECIMAL(10, 2), nullable=False, info={"label": "Valor (R$)"})
    type = db.Column(db.Text, nullable=False, info={"label": "Tipo"})
    quantity = db.Column(db.Integer, nullable=False, info={"label": "Quantidade"})
    added_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class ProductSale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), info={"label": "Produto ID"})
    value = db.Column(db.DECIMAL(10, 2), nullable=False, info={"label": "Valor (R$)"})
    sold_by = db.Column(db.Integer, db.ForeignKey('user.id'), info={"label": "Vendido Por"})
    sold_to = db.Column(db.Integer, db.ForeignKey('user.id'), info={"label": "Vendido Para"})
    added_at = db.Column(db.DateTime, default=datetime.now, info={"label": "Vendido em"})
    dispatched_by = db.Column(db.Integer, db.ForeignKey('user.id'), info={"label": "Despachado Por"})
    dispatched_at = db.Column(db.DateTime, info={"label": "Despachado em"})
    status = db.Column(db.String(20), info={"label": "Status"})

    product = db.relationship('Product', backref='products_sales')

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
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
    

    def as_friendly_dict(self):
        data = {}
        for c in self.__table__.columns:
            key = c.info.get("label", c.name)
            if c.name in ('sold_by', 'sold_to', 'dispatched_by'):
                value = get_user_name_and_id(getattr(self, c.name))
            elif c.name in ('product_id', ):
                value = get_product_name_and_id(getattr(self, c.name))
            elif c.name in ('added_at', 'dispatched_at'):
                value = get_friendly_datetime(getattr(self, c.name))
            elif c.name in ('value', ):
                value = float(getattr(self, c.name))
            else:
                value = getattr(self, c.name)
            data[key] = value
        return data


class PaymentMethod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    need_proof = db.Column(db.Boolean, default=False)
    added_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)
    is_payroll = db.Column(db.Boolean, default=False)


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_method.id'), info={"label": "Método de Pagamento"})
    observations = db.Column(db.Text, info={"label": "Observações"})
    value = db.Column(db.DECIMAL(10, 2), nullable=False, info={"label": "Valor (R$)"})
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), info={"label": "Usuário"})
    allowed_by = db.Column(db.Integer, db.ForeignKey('user.id'), info={"label": "Permitido / Rejeitado por"})
    proof_path = db.Column(db.Text, info={"label": "Comprovante"})
    added_at = db.Column(db.DateTime, default=datetime.now, info={"label": "Data de cadastro"})
    is_payroll = db.Column(db.Boolean, default=False, info={"label": "Recarga via Folha de Pagamento?"})
    is_paypayroll = db.Column(db.Boolean, default=False, info={"label": "Pagamento de Folha de Pagamento?"})
    status = db.Column(db.String(20), info={"label": "Status"})

    payment_method = db.relationship('PaymentMethod', backref='payments')

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    @property
    def formatted_added_at(self):
        return self.added_at.strftime("%d/%m/%Y %H:%M")
    
    @property
    def user(self):
        return User.query.get(self.user_id)
    
    @property
    def proof_url(self):
        if self.proof_path:
            return url_for('static', filename=f"uploads/{self.proof_path}")
    
    @property
    def allowed_by_user(self):
        return User.query.get(self.allowed_by)
    
    def as_friendly_dict(self):
        data = {}
        for c in self.__table__.columns:
            key = c.info.get("label", c.name)
            if c.name in ("user_id", "allowed_by"):
                value = get_user_name_and_id(getattr(self, c.name))
            elif c.name in ("added_at", ):
                value = get_friendly_datetime(getattr(self, c.name))
            elif c.name in ("payment_method_id", ):
                value = get_payment_method_name_and_id(getattr(self, c.name))
            elif c.name in ("value", ):
                value = float(getattr(self, c.name))
            else:
                value = getattr(self, c.name)
            data[key] = value
        return data


class Affiliation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    affiliated_id = db.Column(db.Integer, db.ForeignKey('user.id')) # afiliado
    affiliator_id = db.Column(db.Integer, db.ForeignKey('user.id')) # afiliador
    affiliated = db.relationship('User', foreign_keys=[affiliated_id], backref='affiliations')
    affiliator = db.relationship('User', foreign_keys=[affiliator_id], backref='affiliated_users')

    added_at = db.Column(db.DateTime, default=datetime.now)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Payroll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.DECIMAL(10, 2), nullable=False)
    affiliation_id = db.Column(db.Integer, db.ForeignKey('affiliation.id'))
    added_at = db.Column(db.DateTime, default=datetime.now)
    allowed_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String(20))

    affiliation = db.relationship('Affiliation', backref='payrolls')

    @property
    def allowed_by_user(self):
        return User.query.get(self.allowed_by)


class EditHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    added_at = db.Column(db.DateTime, default=datetime.now, info={"label": "Criado em"})
    edited_by = db.Column(db.Integer, db.ForeignKey('user.id'), info={"label": "Editado por"})
    key = db.Column(db.Text, info={"label": "Chave"})
    old_value = db.Column(db.Text, info={"label": "Valor anterior"})
    new_value = db.Column(db.Text, info={"label": "Novo valor"})
    reason = db.Column(db.Text, nullable=False, info={"label": "Motivo da Mudança"})

    object_type = db.Column(db.String(50), info={"label": "Objeto Atualizado"})    

    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_method.id'))
    route_id = db.Column(db.Integer, db.ForeignKey('route.id'))
    category_page_id = db.Column(db.Integer, db.ForeignKey('category_page.id'))
    page_id = db.Column(db.Integer, db.ForeignKey('page.id'))

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
            if c.name in ('added_at', ):
                value = get_friendly_datetime(getattr(self, c.name))
            elif c.name in ('edited_by', ):
                value = get_user_name_and_id(getattr(self, c.name))
            elif c.name in ('object_type', ):
                if self.object_type == 'product':
                    value = get_product_name_and_id(getattr(self, c.name))
                elif self.object_type == 'user':
                    value = get_user_name_and_id(getattr(self, c.name))
                elif self.object_type == 'role':
                    value = get_role_name_and_id(getattr(self, c.name))
                elif self.object_type == 'payment_method':
                    value = get_payment_method_name_and_id(getattr(self, c.name))
                else:
                    value = getattr(self, c.name)
            else:
                value = getattr(self, c.name)
            data[key] = value
        return data
            
    

class StockHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    added_at = db.Column(db.DateTime, default=datetime.now)
    observations = db.Column(db.Text)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    received_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    purchase_price = db.Column(db.DECIMAL(10, 2))
    sale_value = db.Column(db.DECIMAL(10, 2))
    quantity = db.Column(db.Integer, nullable=False)

    # Relacionamentos com outra tabelassss
    product = db.relationship('Product', backref='stock_historys')
    received_by_user = db.relationship('User', backref='stock_historsys')

    @property
    def formatted_added_at(self):
        return self.added_at.strftime("%d/%m/%Y às %H:%M")
    
    def as_friendly_dict(self):
        data = {}
        for c in self.__table__.columns:
            key = c.info.get("label", c.name)
            if c.name in ('received_by', ):
                value = get_user_name_and_id(getattr(self, c.name))
            elif c.name in ('product_id', ):
                value = get_product_name_and_id(getattr(self, c.name))
            elif c.name in ('added_at', ):
                value = get_friendly_datetime(getattr(self, c.name))
            else:
                value = getattr(self, c.name)
            data[key] = value
        return data

def setup_updated_at_listener(classe):
    @event.listens_for(classe, "before_update")
    def before_update(mapper, connection, classe):
        classe.updated_at = datetime.now()

models_can_be_updated = (PaymentMethod, Page, Product, User, Role, Route, CategoryPage)
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
    return f"{payment_method.name} ({payment_method.id})" if payment_method else payment_method_id


def get_friendly_datetime(dtime):
    """
    Takes a datetime object and returns a formatted string representing the date and time in a friendly format.

    Parameters:
    - dtime (datetime): The datetime object to format.

    Returns:
    - str: The formatted string representing the date and time.
    """
    return dtime.strftime("%d/%m/%Y às %H:%M")