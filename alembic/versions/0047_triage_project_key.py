"""triage_decisions: add project_key for board / project grouping

Lets the UI surface a "filter by project" dropdown — Jira project
keys (SCRUM, SEC) or Azure project names (Boards Management,
EcomBackend) live here. Populated by the scan path; older rows stay
NULL until the next refresh re-evaluates them.

Revision ID: 0047_triage_project_key
Revises: 0046_triage_source_updated_at
Create Date: 2026-05-03
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op


revision = '0047_triage_project_key'
down_revision = '0046_triage_source_updated_at'
branch_labels = None
depends_on = None


def _column_exists(bind, table: str, column: str) -> bool:
    inspector = sa.inspect(bind)
    if table not in inspector.get_table_names():
        return False
    return any(c['name'] == column for c in inspector.get_columns(table))


def upgrade() -> None:
    bind = op.get_bind()
    if not _column_exists(bind, 'triage_decisions', 'project_key'):
        op.add_column(
            'triage_decisions',
            sa.Column('project_key', sa.String(length=128), nullable=True, index=True),
        )


def downgrade() -> None:
    bind = op.get_bind()
    if _column_exists(bind, 'triage_decisions', 'project_key'):
        op.drop_column('triage_decisions', 'project_key')
