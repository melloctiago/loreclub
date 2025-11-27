"""add_default_to_updated_at

Revision ID: 1356a348952f
Revises: create_achievements_table
Create Date: 2025-11-27 13:22:47.410851

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '1356a348952f'
down_revision: Union[str, None] = 'create_achievements_table'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "ALTER TABLE achievement "
        "MODIFY COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP, "
        "MODIFY COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    )
    op.execute("ALTER TABLE achievement DROP COLUMN description")


def downgrade() -> None:
    op.execute(
        "ALTER TABLE achievement "
        "MODIFY COLUMN created_at DATETIME NULL, "
        "MODIFY COLUMN updated_at DATETIME NULL"
    )
    op.execute("ALTER TABLE achievement ADD COLUMN description TEXT NULL")