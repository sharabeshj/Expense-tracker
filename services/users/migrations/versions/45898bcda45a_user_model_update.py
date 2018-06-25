"""user model update

Revision ID: 45898bcda45a
Revises: ad0f2385821e
Create Date: 2018-06-20 21:13:37.502285

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '45898bcda45a'
down_revision = 'ad0f2385821e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('active', sa.Boolean(), nullable=True))
    op.drop_column('users', 'updated_at')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_column('users', 'active')
    # ### end Alembic commands ###
