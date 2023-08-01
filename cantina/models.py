from . import db
from datetime import datetime
from sqlalchemy import event
from flask import url_for

def setup_updated_at_listener(classe):
    @event.listens_for(classe, "before_update")
    def before_update(mapper, connection, classe):
        classe.updated_at = datetime.now()


class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    endpoint = db.Column(db.Text, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now)

setup_updated_at_listener(Route)


class CategoryPage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.now)

setup_updated_at_listener(CategoryPage)


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

setup_updated_at_listener(Page)


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    allowed_routes = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    added_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

setup_updated_at_listener(Role)


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
        return {c.info.get("label", c.name): getattr(self, c.name) for c in self.__table__.columns if c.name not in ('password', 'role_id')}

setup_updated_at_listener(User)


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

setup_updated_at_listener(Product)


class ProductSale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    value = db.Column(db.DECIMAL(10, 2), nullable=False)
    sold_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    sold_to = db.Column(db.Integer, db.ForeignKey('user.id'))
    added_at = db.Column(db.DateTime, default=datetime.now)
    dispatched_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    dispatched_at = db.Column(db.DateTime)
    status = db.Column(db.String(20))

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


class PaymentMethod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    need_proof = db.Column(db.Boolean, default=False)
    added_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)
    is_payroll = db.Column(db.Boolean, default=False)

setup_updated_at_listener(PaymentMethod)


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_method.id'))
    observations = db.Column(db.Text)
    paid_at = db.Column(db.DateTime, default=datetime.now)
    value = db.Column(db.DECIMAL(10, 2), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    allowed_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    proof_path = db.Column(db.Text)
    added_at = db.Column(db.DateTime, default=datetime.now)
    is_payroll = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20))

    payment_method = db.relationship('PaymentMethod', backref='payments')

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    @property
    def formatted_paid_at(self):
        return self.paid_at.strftime("%d/%m/%Y às %H:%M")
    
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

class Affiliation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    affiliated_id = db.Column(db.Integer, db.ForeignKey('user.id')) # afiliado
    affiliator_id = db.Column(db.Integer, db.ForeignKey('user.id')) # afiliador
    affiliated = db.relationship('User', foreign_keys=[affiliated_id], backref='affiliations')
    affiliator = db.relationship('User', foreign_keys=[affiliator_id], backref='affiliated_users')

    added_at = db.Column(db.DateTime, default=datetime.now)

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
    added_at = db.Column(db.DateTime, default=datetime.now)
    edited_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    key = db.Column(db.Text)
    old_value = db.Column(db.Text)
    new_value = db.Column(db.Text)
    reason = db.Column(db.Text, nullable=False)

    object_type = db.Column(db.String(50))    

    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_method.id'))

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