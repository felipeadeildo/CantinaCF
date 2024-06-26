"""add payroll_receiver_id and remove is_payroll

Revision ID: a26313c1c0f6
Revises: 8990a899a697
Create Date: 2024-05-04 21:49:58.857471

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "a26313c1c0f6"
down_revision = "8990a899a697"
branch_labels = None
depends_on = None


def upgrade():
    # Passo 1: Adicionar a nova coluna `payroll_receiver_id`
    with op.batch_alter_table("payment", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("payroll_receiver_id", sa.Integer(), nullable=True)
        )
        batch_op.create_foreign_key(
            "fk_payroll_receiver_id", "user", ["payroll_receiver_id"], ["id"]
        )

    # Passo 2: Preencher a coluna `payroll_receiver_id`
    connection = op.get_bind()
    payment_table = sa.Table("payment", sa.MetaData(), autoload_with=connection)
    affiliation_table = sa.Table("affiliation", sa.MetaData(), autoload_with=connection)

    errors = []

    payments = connection.execute(
        sa.select(payment_table.c.id, payment_table.c.user_id).where(
            payment_table.c.is_payroll
        )
    )

    for payment in payments:
        affiliation = connection.execute(
            sa.select(affiliation_table.c.affiliator_id).where(
                affiliation_table.c.affiliated_id == payment.user_id
            )
        ).fetchone()

        if not affiliation:
            errors.append(
                f"Missing affiliation for user {payment.user_id} on payment {payment.id}"
            )
        else:
            connection.execute(
                payment_table.update()
                .where(payment_table.c.id == payment.id)
                .values(payroll_receiver_id=affiliation.affiliator_id)
            )

    # Se houver erros, salve-os em um arquivo
    if errors:
        with open(f"{revision}_errors.txt", "a+") as f:
            f.write("\n".join(errors) + "\n")

    # Passo 3: Remover a coluna `is_payroll`
    with op.batch_alter_table("payment", schema=None) as batch_op:
        batch_op.drop_column("is_payroll")


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("payment", schema=None) as batch_op:
        batch_op.add_column(sa.Column("is_payroll", sa.BOOLEAN(), nullable=True))
        batch_op.drop_constraint("fk_payroll_receiver_id", type_="foreignkey")
        batch_op.drop_column("payroll_receiver_id")

    # ### end Alembic commands ###
