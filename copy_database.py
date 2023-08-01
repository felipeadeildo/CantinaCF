from datetime import datetime
from cantina.models import *
from cantina import app, db
import sqlite3
from werkzeug.security import generate_password_hash

PAYMENT_TYPES = {
    'cash': 'Espécie',
    'debit_card': 'Cartão de Débito',
    'credit_card': 'Cartão de Crédito',
    'pix': 'PIX',
    'payroll': 'Folha de Pagamento',
}

db_path = "database.sqlite"

with app.test_request_context():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row


    # Copy Users
    print("Copying Users...")
    users = conn.execute("select * from user").fetchall()
    for i, user in enumerate(users, 1):
        print(f"\r\tCopying {i}/{len(users)}", end="")
        role = Role.query.filter(Role.name.ilike(f"%{user['role'].lower()}%")).first()
        user = User(
            matricula = user["matricula"],
            name = user["name"],
            username = user["username"],
            role_id = role.id,
            password = user["password"] or generate_password_hash('umasenhalegal'),
            balance = user["saldo"],
            balance_payroll = user["saldo_payroll"],
            serie = user["serie"],
            turm = user["turma"],
            telephone = user["telefone"],
            cpf = user["cpf"],
            email = user["email"]
        )
        db.session.add(user)
    db.session.commit()
    print("\nUsers Copied.")

    # Copy Produtos
    print("Copying Products...")
    products = conn.execute("select * from produto").fetchall()
    for i, product in enumerate(products, 1):
        print(f"\r\tCopying {i}/{len(products)}", end="")
        product = Product(
            name = product["nome"],
            description = product["descricao"],
            value = product["valor"],
            type = product["tipo"],
            quantity = product["quantidade"]
        )
        db.session.add(product)
    db.session.commit()
    print("\nProducts Copied.")

    # Copy Venda Produto
    print("Copying Sales...")
    sales = conn.execute("select * from venda_produto").fetchall()
    for i, sale in enumerate(sales, 1):
        print(f"\r\tCopying {i}/{len(sales)}", end="")
        added_at = datetime.strptime(sale["data_hora"], "%Y-%m-%d %H:%M:%S")
        product_sale = ProductSale(
            product_id = sale["produto_id"],
            sold_by = sale["vendido_por"],
            sold_to = sale["vendido_para"],
            added_at = added_at,
            value = sale["valor"],
            dispatched_by = sale["deferido_por"],
            dispatched_at = added_at,
            status = "to dispatch" if sale["deferido_por"] is None else "dispatched",

            product = Product.query.filter_by(id=sale["produto_id"]).first()
        )
        db.session.add(product_sale)
    db.session.commit()
    print("\nSales Copied.")

    # Copy histórico abastecimento estoque
    print("Copying Stock...")
    stocks = conn.execute("select * from historico_abastecimento_estoque").fetchall()
    for i, stock in enumerate(stocks, 1):
        print(f"\r\tCopying {i}/{len(stocks)}", end="")
        stock_h = StockHistory(
            added_at = datetime.strptime(stock["data_hora"], "%Y-%m-%d %H:%M:%S"),
            observations = stock["descricao"],
            product_id = stock["produto_id"],
            received_by = stock["recebido_por"],
            quantity = stock["quantidade"],
            purchase_price = stock["valor_compra"],
            sale_value = stock["valor_venda"],

            product = Product.query.filter_by(id=stock["produto_id"]).first(),
            received_by_user = User.query.filter_by(id=stock["recebido_por"]).first(), 
        )
        db.session.add(stock_h)
    db.session.commit()
    print("\nStock Copied.")

    # Copy Payments
    print("Copying Payments...")
    payments = conn.execute("select * from controle_pagamento").fetchall()
    for i, payment in enumerate(payments, 1):
        print(f"\r\tCopying {i}/{len(payments)}", end="")
        pay_method_name = PAYMENT_TYPES[payment["tipo_pagamento"].lower()]
        payment_method = PaymentMethod.query.filter(PaymentMethod.name.ilike(f'%{pay_method_name}%')).first()

        status = None
        if payment["liberado_por"] is None:
            status = "to allow"
        else:
            status = "accepted"
        # infelizmente não tem rejected's uma vez que na versão anterior era simplesmente deletado

        payment = Payment(
            payment_method_id = payment_method.id,
            observations = payment["descricao"],
            paid_at = datetime.strptime(payment["data_hora"], "%Y-%m-%d %H:%M:%S"),
            value = payment["valor"],
            allowed_by = payment["liberado_por"],
            user_id = payment["aluno_id"],
            proof_path = payment["comprovante"],
            is_payroll = payment["is_payroll"],
            status = status,

            payment_method = payment_method
        )

        db.session.add(payment)
    db.session.commit()
    print("\nPayments Copied.")

    # Copy Affiliations
    print("Copy Affiliations...")
    affiliations = conn.execute("select * from affiliation").fetchall()
    for i, aff in enumerate(affiliations, 1):
        print(f"\r\tCopying {i}/{len(affiliations)}", end="")
        affiliation = Affiliation(
            affiliated_id = aff["user_id"],
            affiliator_id = aff["entidade_id"],
        )
        db.session.add(affiliation)
    db.session.commit()
    print("\nAffiliations Copied.")

    # Copy Folha de Pagamentos
    print("Copying payroll...")
    payrolls = conn.execute("select * from folha_de_pagamento").fetchall()
    for i, pay in enumerate(payrolls, 1):
        print(f"\r\tCopying {i}/{len(payrolls)}", end="")
        payroll = Payroll(
            affiliation_id = pay["affiliation_id"],
            added_at = datetime.strptime(pay["data_hora"], "%Y-%m-%d %H:%M:%S"),
            allowed_by = pay["liberado_por"],
            status = "to allow" if pay["liberado_por"] is None else "accepted",
            value = pay["valor"],

            affiliation = Affiliation.query.filter_by(id=pay["affiliation_id"]).first()
        )
        db.session.add(payroll)
    db.session.commit()
    print("\nPayroll Copied.")


    # Copy Histórico de Edição de Produtos
    print("Copying Product History Edits...")
    phes =  conn.execute("select * from historico_edicao_produto").fetchall()
    for i, phe in enumerate(phes, 1):
        print(f"\r\tCopying {i}/{len(phes)}", end="")
        eh = EditHistory(
            added_at = datetime.strptime(phe["data_hora"], "%Y-%m-%d %H:%M:%S"),
            edited_by = phe["editado_por"],
            key = phe["chave"],
            old_value = phe["valor_antigo"],
            new_value = phe["valor_novo"],
            reason = phe["motivo"],

            object_type = "product",

            product_id = phe["produto_id"]
        )
        db.session.add(eh)
    db.session.commit()
    print("\nProduct History Edits Copied.")


    # Copy Histórico de Edição de Usuários
    print("Copying History User Edits...")
    phus =  conn.execute("select * from historico_edicao_usuario").fetchall()
    for i, phe in enumerate(phus, 1):
        print(f"\r\tCopying {i}/{len(phus)}", end="")
        eh = EditHistory(
            added_at = datetime.strptime(phe["data_hora"], "%Y-%m-%d %H:%M:%S"),
            edited_by = phe["editado_por"],
            key = phe["chave"],
            old_value = phe["valor_antigo"],
            new_value = phe["valor_novo"],
            reason = phe["motivo"],

            object_type = "user",

            user_id = phe["user_id"]
        )
        db.session.add(eh)
    db.session.commit()
    print("\nProduct History User Copied.")