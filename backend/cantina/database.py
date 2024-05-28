import random
import string

from werkzeug.security import generate_password_hash

from .models import PaymentMethod, Role, User


def init_db(db):
    """
    Initializes the database.
    """
    print("Initializing database...")
    db.drop_all()
    db.create_all()
    print("Database initialized.")

    # Adiciona métodos de pagameto padrão
    print("Adding default payment methods...")
    payments_method = [
        PaymentMethod(name="PIX", need_proof=True, is_payroll=False),
        PaymentMethod(name="Cartão de Crédito", need_proof=False, is_payroll=False),
        PaymentMethod(name="Cartão de Debito", need_proof=False, is_payroll=False),
        PaymentMethod(name="Espécie", need_proof=False, is_payroll=False),
        PaymentMethod(name="Folha de Pagamento", need_proof=False, is_payroll=True),
        PaymentMethod(
            name="System", need_proof=False, is_payroll=False, is_protected=True
        ),
    ]
    db.session.add_all(payments_method)
    db.session.commit()

    # Adiciona os Cargos Padrões
    print("Adding default roles...")

    roles = [
        Role(name="Admin", description="Administrador do Site :P (#GOD)"),
        Role(
            name="Funcionário",
            description="Funcionários em Geral no Site (Professores, Coordenadores, etc.)",
        ),
        Role(name="Aluno", description="Alunos da Escola"),
        Role(name="Caixa", description="Caixas da Cantina"),
        Role(name="Guest", description="Visitante (ignore)"),
    ]
    db.session.add_all(roles)
    db.session.commit()
    print("Already created.")


def create_superuser(db):
    """
    Creates a superuser.
    """
    print("Creating superuser...")
    role = Role.query.get(1)  # admin :D // Role.query.filter_by(name="Admin").first()
    username = "admin"
    password = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))

    superuser = User(
        name=username.capitalize(),
        username=username,
        password=generate_password_hash(password),
        role=role,
    )
    db.session.add(superuser)
    db.session.commit()
    print("Superuser created.")
    print("Username: " + username)
    print("Password: " + password)
