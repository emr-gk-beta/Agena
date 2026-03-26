from __future__ import annotations

from datetime import datetime, timedelta

from sqlalchemy import case, cast, Date, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.ai_usage_event import AIUsageEvent
from models.task_record import TaskRecord


class AnalyticsService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # ── Daily usage + cost stats ──────────────────────────────────────────────

    async def daily_stats(
        self, organization_id: int, days: int = 30,
    ) -> list[dict]:
        since = datetime.utcnow() - timedelta(days=days)
        day_col = cast(AIUsageEvent.created_at, Date).label('day')

        result = await self.db.execute(
            select(
                day_col,
                func.count(AIUsageEvent.id).label('count'),
                func.coalesce(func.sum(AIUsageEvent.total_tokens), 0).label('total_tokens'),
                func.coalesce(func.sum(AIUsageEvent.cost_usd), 0).label('cost_usd'),
                func.coalesce(func.avg(AIUsageEvent.duration_ms), 0).label('avg_duration_ms'),
            )
            .where(
                AIUsageEvent.organization_id == organization_id,
                AIUsageEvent.created_at >= since,
            )
            .group_by(day_col)
            .order_by(day_col)
        )
        return [
            {
                'date': str(row.day),
                'count': int(row.count),
                'total_tokens': int(row.total_tokens),
                'cost_usd': round(float(row.cost_usd), 6),
                'avg_duration_ms': int(row.avg_duration_ms),
            }
            for row in result.all()
        ]

    # ── Task velocity (completed / failed / queued per day) ───────────────────

    async def task_velocity(
        self, organization_id: int, days: int = 30,
    ) -> list[dict]:
        since = datetime.utcnow() - timedelta(days=days)
        day_col = cast(TaskRecord.updated_at, Date).label('day')

        result = await self.db.execute(
            select(
                day_col,
                func.sum(case((TaskRecord.status == 'completed', 1), else_=0)).label('completed'),
                func.sum(case((TaskRecord.status == 'failed', 1), else_=0)).label('failed'),
                func.sum(case((TaskRecord.status == 'queued', 1), else_=0)).label('queued'),
                func.count(TaskRecord.id).label('total'),
            )
            .where(
                TaskRecord.organization_id == organization_id,
                TaskRecord.updated_at >= since,
            )
            .group_by(day_col)
            .order_by(day_col)
        )
        return [
            {
                'date': str(row.day),
                'completed': int(row.completed),
                'failed': int(row.failed),
                'queued': int(row.queued),
                'total': int(row.total),
            }
            for row in result.all()
        ]

    # ── Model breakdown ───────────────────────────────────────────────────────

    async def model_breakdown(
        self, organization_id: int, days: int = 30,
    ) -> list[dict]:
        since = datetime.utcnow() - timedelta(days=days)

        result = await self.db.execute(
            select(
                func.coalesce(AIUsageEvent.model, 'unknown').label('model'),
                func.count(AIUsageEvent.id).label('count'),
                func.coalesce(func.sum(AIUsageEvent.total_tokens), 0).label('total_tokens'),
                func.coalesce(func.sum(AIUsageEvent.cost_usd), 0).label('cost_usd'),
            )
            .where(
                AIUsageEvent.organization_id == organization_id,
                AIUsageEvent.created_at >= since,
            )
            .group_by(func.coalesce(AIUsageEvent.model, 'unknown'))
            .order_by(func.sum(AIUsageEvent.cost_usd).desc())
        )
        return [
            {
                'model': str(row.model),
                'count': int(row.count),
                'total_tokens': int(row.total_tokens),
                'cost_usd': round(float(row.cost_usd), 6),
            }
            for row in result.all()
        ]

    # ── Summary for current month ─────────────────────────────────────────────

    async def summary(self, organization_id: int) -> dict:
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # AI usage summary this month
        usage_result = await self.db.execute(
            select(
                func.count(AIUsageEvent.id).label('count'),
                func.coalesce(func.sum(AIUsageEvent.total_tokens), 0).label('total_tokens'),
                func.coalesce(func.sum(AIUsageEvent.cost_usd), 0).label('cost_usd'),
                func.coalesce(func.avg(AIUsageEvent.duration_ms), 0).label('avg_duration_ms'),
            )
            .where(
                AIUsageEvent.organization_id == organization_id,
                AIUsageEvent.created_at >= month_start,
            )
        )
        usage = usage_result.one()

        # Task completion rate this month
        task_result = await self.db.execute(
            select(
                func.count(TaskRecord.id).label('total'),
                func.sum(case((TaskRecord.status == 'completed', 1), else_=0)).label('completed'),
                func.sum(case((TaskRecord.status == 'failed', 1), else_=0)).label('failed'),
            )
            .where(
                TaskRecord.organization_id == organization_id,
                TaskRecord.created_at >= month_start,
            )
        )
        tasks = task_result.one()
        settled = int(tasks.completed or 0) + int(tasks.failed or 0)
        completion_rate = round(int(tasks.completed or 0) / settled * 100, 1) if settled > 0 else 0.0

        return {
            'period': f'{now.year}-{now.month:02d}',
            'ai_call_count': int(usage.count or 0),
            'total_tokens': int(usage.total_tokens or 0),
            'cost_usd': round(float(usage.cost_usd or 0), 6),
            'avg_duration_ms': int(usage.avg_duration_ms or 0),
            'task_total': int(tasks.total or 0),
            'task_completed': int(tasks.completed or 0),
            'task_failed': int(tasks.failed or 0),
            'completion_rate': completion_rate,
        }
