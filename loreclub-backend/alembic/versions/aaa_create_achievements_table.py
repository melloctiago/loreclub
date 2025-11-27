"""create_achievements_table

Revision ID: create_achievements_table
Revises: add_owner_id_to_guild_board
Create Date: 2025-11-27 00:00:00.000000

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
    op.create_table(
        'achievement',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('flavor_text', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(length=100), nullable=True),
        sa.Column('objective_type', sa.String(length=100), nullable=True),
        sa.Column('objective_value', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'hero_achievement',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('hero_id', sa.Integer(), nullable=False),
        sa.Column('achievement_id', sa.Integer(), nullable=False),
        sa.Column('unlocked_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['hero_id'], ['hero.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['achievement_id'], ['achievement.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('hero_id', 'achievement_id', name='unique_hero_achievement')
    )


def downgrade() -> None:
    op.drop_table('hero_achievement')
    op.drop_table('achievement')
