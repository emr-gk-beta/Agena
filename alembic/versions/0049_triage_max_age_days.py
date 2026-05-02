"""org_workflow_settings: add triage_max_age_days

Caps how far back the triage scan reaches. Default 365 days — tickets
older than that are treated as ancient history and skipped, so the
queue surfaces "stale enough to need attention but recent enough to
still matter" rather than every 2019 ghost ticket sitting in Jira.

Setting 0 / None disables the cap entirely (old behaviour).

Revision ID: 0049_triage_max_age_days
Revises: 0048_triage_ticket_state
Create Date: 2026-05-03
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op


revision = '0049_triage_max_age_days'
down_revision = '0048_triage_ticket_state'
branch_labels = None
depends_on = None


def _column_exists(bind, table: str, column: str) -> bool:
    inspector = sa.inspect(bind)
    if table not in inspector.get_table_names():
        return False
    return any(c['name'] == column for c in inspector.get_columns(table))


def upgrade() -> None:
    bind = op.get_bind()
    if not _column_exists(bind, 'org_workflow_settings', 'triage_max_age_days'):
        op.add_column(
            'org_workflow_settings',
            sa.Column(
                'triage_max_age_days',
                sa.Integer(),
                nullable=False,
                server_default='365',
            ),
        )


def downgrade() -> None:
    bind = op.get_bind()
    if _column_exists(bind, 'org_workflow_settings', 'triage_max_age_days'):
        op.drop_column('org_workflow_settings', 'triage_max_age_days')
