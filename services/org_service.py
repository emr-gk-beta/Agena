from __future__ import annotations

import secrets

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.invite import Invite
from models.organization_member import OrganizationMember
from models.user import User


class OrgService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def invite_user(self, organization_id: int, email: str) -> Invite:
        invite = Invite(
            organization_id=organization_id,
            email=email,
            token=secrets.token_urlsafe(32),
            status='pending',
        )
        self.db.add(invite)
        await self.db.commit()
        await self.db.refresh(invite)
        return invite

    async def accept_invite(self, token: str, user_id: int) -> None:
        result = await self.db.execute(select(Invite).where(Invite.token == token, Invite.status == 'pending'))
        invite = result.scalar_one_or_none()
        if invite is None:
            raise ValueError('Invalid invite token')

        exists = await self.db.execute(
            select(OrganizationMember).where(
                OrganizationMember.organization_id == invite.organization_id,
                OrganizationMember.user_id == user_id,
            )
        )
        if exists.scalar_one_or_none() is None:
            self.db.add(
                OrganizationMember(
                    organization_id=invite.organization_id,
                    user_id=user_id,
                    role='member',
                )
            )
        invite.status = 'accepted'
        await self.db.commit()

    async def auto_add_team_members(
        self, org_id: int, members: list[dict],
    ) -> dict[str, int]:
        """Sync a list of team members (from Azure/Jira) into organization membership.

        For each member with a valid email (uniqueName):
        - If a User with that email exists and is not already an org member, add them.
        - If no User exists and no pending invite exists, create an invite.
        Returns ``{added: int, invited: int, already_exists: int}``.
        """
        import re

        added = 0
        invited = 0
        already_exists = 0

        email_pattern = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

        for member in members:
            email = (member.get('uniqueName') or '').strip().lower()
            if not email or not email_pattern.match(email):
                continue

            # Check if a registered user exists with this email
            user_result = await self.db.execute(
                select(User).where(User.email == email)
            )
            user = user_result.scalar_one_or_none()

            if user is not None:
                # Check if already an org member
                mem_result = await self.db.execute(
                    select(OrganizationMember).where(
                        OrganizationMember.organization_id == org_id,
                        OrganizationMember.user_id == user.id,
                    )
                )
                if mem_result.scalar_one_or_none() is not None:
                    already_exists += 1
                else:
                    self.db.add(
                        OrganizationMember(
                            organization_id=org_id,
                            user_id=user.id,
                            role='member',
                        )
                    )
                    added += 1
            else:
                # No user — check for existing pending invite
                inv_result = await self.db.execute(
                    select(Invite).where(
                        Invite.organization_id == org_id,
                        Invite.email == email,
                        Invite.status == 'pending',
                    )
                )
                if inv_result.scalar_one_or_none() is not None:
                    already_exists += 1
                else:
                    self.db.add(
                        Invite(
                            organization_id=org_id,
                            email=email,
                            token=secrets.token_urlsafe(32),
                            status='pending',
                        )
                    )
                    invited += 1

        await self.db.flush()
        return {'added': added, 'invited': invited, 'already_exists': already_exists}

    async def get_user(self, user_id: int) -> User | None:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
