"""added access_token fieldd

Revision ID: e2ffb6b8809f
Revises: 160de66dbc2a
Create Date: 2018-05-24 15:26:37.636064

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e2ffb6b8809f'
down_revision = '160de66dbc2a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('fyle_tokens', sa.Column('access_token', sa.String(length=100), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('fyle_tokens', 'access_token')
    # ### end Alembic commands ###