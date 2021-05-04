"""adding database changes

Revision ID: e8ed8228f959
Revises: fb5b7d0ee8b5
Create Date: 2021-05-03 19:40:44.807610

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e8ed8228f959'
down_revision = 'fb5b7d0ee8b5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('name', sa.String(length=64), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'name')
    # ### end Alembic commands ###