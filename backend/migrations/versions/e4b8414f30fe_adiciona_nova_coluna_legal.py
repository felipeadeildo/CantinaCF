"""Adiciona nova coluna legal

Revision ID: e4b8414f30fe
Revises: 3ab3a08ab96e
Create Date: 2023-08-24 21:09:12.262240

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column

# revision identifiers, used by Alembic.
revision = "e4b8414f30fe"
down_revision = "3ab3a08ab96e"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("route", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("block_recurring_access", sa.Boolean(), nullable=True)
        )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("route", schema=None) as batch_op:
        batch_op.drop_column("block_recurring_access")

    # ### end Alembic commands ###
    route_table = table("route", column("block_recurring_access", sa.Boolean()))
    op.execute(route_table.update().values(block_recurring_access=False))
