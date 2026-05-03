"""git_pull_requests: add is_draft

Captures the provider's draft flag (Azure isDraft, GitHub draft) so the
review-backlog row can render a DRAFT badge — without it the UI shows
"Active" for PRs that are intentionally not ready for review yet.

Revision ID: 0052_pr_is_draft
Revises: 0051_skills_public_library
Create Date: 2026-05-04
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op


revision = '0052_pr_is_draft'
down_revision = '0051_skills_public_library'
branch_labels = None
depends_on = None


def _column_exists(bind, table: str, column: str) -> bool:
    inspector = sa.inspect(bind)
    if table not in inspector.get_table_names():
        return False
    return any(c['name'] == column for c in inspector.get_columns(table))


def upgrade() -> None:
    bind = op.get_bind()
    if not _column_exists(bind, 'git_pull_requests', 'is_draft'):
        op.add_column(
            'git_pull_requests',
            sa.Column(
                'is_draft',
                sa.Boolean(),
                nullable=False,
                server_default=sa.text('0'),
            ),
        )


def downgrade() -> None:
    bind = op.get_bind()
    if _column_exists(bind, 'git_pull_requests', 'is_draft'):
        op.drop_column('git_pull_requests', 'is_draft')
