from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from api.dependencies import CurrentTenant, get_current_tenant
from core.database import get_db_session
from services.analytics_service import AnalyticsService

router = APIRouter(prefix='/analytics', tags=['analytics'])


# ── Response schemas ──────────────────────────────────────────────────────────


class DailyStatItem(BaseModel):
    date: str
    count: int
    total_tokens: int
    cost_usd: float
    avg_duration_ms: int


class TaskVelocityItem(BaseModel):
    date: str
    completed: int
    failed: int
    queued: int
    total: int


class DailyResponse(BaseModel):
    daily_usage: list[DailyStatItem]
    task_velocity: list[TaskVelocityItem]


class ModelBreakdownItem(BaseModel):
    model: str
    count: int
    total_tokens: int
    cost_usd: float


class ModelBreakdownResponse(BaseModel):
    models: list[ModelBreakdownItem]


class SummaryResponse(BaseModel):
    period: str
    ai_call_count: int
    total_tokens: int
    cost_usd: float
    avg_duration_ms: int
    task_total: int
    task_completed: int
    task_failed: int
    completion_rate: float


# ── Endpoints ─────────────────────────────────────────────────────────────────


@router.get('/daily', response_model=DailyResponse)
async def get_daily_analytics(
    days: int = Query(default=30, ge=1, le=365),
    tenant: CurrentTenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db_session),
) -> DailyResponse:
    service = AnalyticsService(db)
    daily_usage = await service.daily_stats(tenant.organization_id, days=days)
    task_velocity = await service.task_velocity(tenant.organization_id, days=days)
    return DailyResponse(
        daily_usage=[DailyStatItem(**d) for d in daily_usage],
        task_velocity=[TaskVelocityItem(**t) for t in task_velocity],
    )


@router.get('/summary', response_model=SummaryResponse)
async def get_summary(
    tenant: CurrentTenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db_session),
) -> SummaryResponse:
    service = AnalyticsService(db)
    data = await service.summary(tenant.organization_id)
    return SummaryResponse(**data)


@router.get('/models', response_model=ModelBreakdownResponse)
async def get_model_breakdown(
    days: int = Query(default=30, ge=1, le=365),
    tenant: CurrentTenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db_session),
) -> ModelBreakdownResponse:
    service = AnalyticsService(db)
    items = await service.model_breakdown(tenant.organization_id, days=days)
    return ModelBreakdownResponse(models=[ModelBreakdownItem(**m) for m in items])
