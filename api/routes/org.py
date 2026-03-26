from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.dependencies import CurrentTenant, get_current_tenant, require_permission
from core.database import get_db_session
from core.rbac import ROLES
from models.organization_member import OrganizationMember
from models.user import User
from schemas.org import InviteRequest, InviteResponse
from services.notification_service import NotificationService
from services.org_service import OrgService

router = APIRouter(prefix='/org', tags=['organization'])


class AcceptInviteRequest(BaseModel):
    token: str


class ChangeRoleRequest(BaseModel):
    role: str


class MemberResponse(BaseModel):
    id: int
    user_id: int
    email: str
    full_name: str
    role: str


@router.post('/invite', response_model=InviteResponse)
async def invite_member(
    request: InviteRequest,
    tenant: CurrentTenant = Depends(require_permission('team:manage')),
    db: AsyncSession = Depends(get_db_session),
) -> InviteResponse:
    service = OrgService(db)
    invite = await service.invite_user(tenant.organization_id, request.email)
    return InviteResponse(invite_token=invite.token, status=invite.status)


@router.post('/invite/accept')
async def accept_invite(
    request: AcceptInviteRequest,
    tenant: CurrentTenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db_session),
) -> dict[str, str]:
    service = OrgService(db)
    try:
        await service.accept_invite(request.token, tenant.user_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {'status': 'accepted'}


@router.get('/members', response_model=list[MemberResponse])
async def list_members(
    tenant: CurrentTenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db_session),
) -> list[MemberResponse]:
    result = await db.execute(
        select(OrganizationMember, User)
        .join(User, OrganizationMember.user_id == User.id)
        .where(OrganizationMember.organization_id == tenant.organization_id)
    )
    rows = result.all()
    return [
        MemberResponse(
            id=member.id,
            user_id=member.user_id,
            email=user.email,
            full_name=user.full_name,
            role=member.role or 'member',
        )
        for member, user in rows
    ]


@router.put('/members/{member_id}/role', response_model=MemberResponse)
async def change_member_role(
    member_id: int,
    payload: ChangeRoleRequest,
    tenant: CurrentTenant = Depends(require_permission('roles:manage')),
    db: AsyncSession = Depends(get_db_session),
) -> MemberResponse:
    if payload.role not in ROLES:
        raise HTTPException(status_code=400, detail=f'Invalid role. Must be one of: {", ".join(ROLES)}')

    # Only an owner can promote someone to owner
    if payload.role == 'owner' and tenant.role != 'owner':
        raise HTTPException(status_code=403, detail='Only an owner can assign the owner role')

    result = await db.execute(
        select(OrganizationMember, User)
        .join(User, OrganizationMember.user_id == User.id)
        .where(
            OrganizationMember.id == member_id,
            OrganizationMember.organization_id == tenant.organization_id,
        )
    )
    row = result.one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail='Member not found')

    member, user = row

    # Prevent demoting yourself as the only owner
    if member.user_id == tenant.user_id and member.role == 'owner' and payload.role != 'owner':
        owner_count_result = await db.execute(
            select(OrganizationMember).where(
                OrganizationMember.organization_id == tenant.organization_id,
                OrganizationMember.role == 'owner',
            )
        )
        if len(owner_count_result.all()) <= 1:
            raise HTTPException(status_code=400, detail='Cannot demote the only owner')

    member.role = payload.role
    await db.commit()
    await db.refresh(member)

    # Notify the affected user about their role change
    notifier = NotificationService(db)
    admin_result = await db.execute(select(User).where(User.id == tenant.user_id))
    admin_user = admin_result.scalar_one_or_none()
    admin_name = admin_user.full_name if admin_user else 'An admin'

    # Notification to the member whose role changed
    await notifier.notify_event(
        organization_id=tenant.organization_id,
        user_id=member.user_id,
        event_type='role_changed',
        title='Role changed',
        message=f'Your role has been changed to {payload.role} by {admin_name}',
        severity='info',
        payload={'new_role': payload.role, 'changed_by': tenant.user_id},
    )

    # Notification to the admin who made the change (skip if same user)
    if tenant.user_id != member.user_id:
        await notifier.notify_event(
            organization_id=tenant.organization_id,
            user_id=tenant.user_id,
            event_type='role_changed',
            title='Role changed',
            message=f"{user.full_name}'s role changed to {payload.role}",
            severity='info',
            payload={'new_role': payload.role, 'target_user_id': member.user_id},
        )

    return MemberResponse(
        id=member.id,
        user_id=member.user_id,
        email=user.email,
        full_name=user.full_name,
        role=member.role,
    )


class AutoSyncTeamRequest(BaseModel):
    members: list[dict[str, Any]]


class AutoSyncTeamResponse(BaseModel):
    added: int
    invited: int
    already_exists: int


@router.post('/auto-sync-team', response_model=AutoSyncTeamResponse)
async def auto_sync_team(
    payload: AutoSyncTeamRequest,
    tenant: CurrentTenant = Depends(require_permission('team:manage')),
    db: AsyncSession = Depends(get_db_session),
) -> AutoSyncTeamResponse:
    """Manually sync the current my_team list into organization members/invites."""
    org_svc = OrgService(db)
    summary = await org_svc.auto_add_team_members(tenant.organization_id, payload.members)
    await db.commit()

    # Notify about newly invited members
    invited_count = summary.get('invited', 0)
    if invited_count > 0:
        notif_svc = NotificationService(db)
        await notif_svc.notify_event(
            organization_id=tenant.organization_id,
            user_id=tenant.user_id,
            event_type='team_sync',
            title='Team members synced',
            message=f'{invited_count} new team member{"s" if invited_count != 1 else ""} invited to your organization.',
            severity='info',
            payload={'sync_summary': summary},
        )

    return AutoSyncTeamResponse(**summary)
