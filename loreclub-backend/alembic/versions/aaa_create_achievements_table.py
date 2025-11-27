"""create_achievements_table (placeholder migration)

Revision ID: create_achievements_table
Revises: add_owner_id_to_guild_board
Create Date: 2025-11-27 00:00:00.000000

This is a placeholder migration to fix alembic revision chain.
The achievements feature was removed/not implemented yet.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'create_achievements_table'
down_revision: Union[str, None] = 'add_owner_id_to_guild_board'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # No-op: achievements tables not implemented in current codebase
    pass


def downgrade() -> None:
    # No-op
    pass
