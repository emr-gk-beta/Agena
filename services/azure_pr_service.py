from __future__ import annotations

import base64
from urllib.parse import urlparse

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from services.integration_config_service import IntegrationConfigService


class AzurePRService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_pr(
        self,
        organization_id: int,
        *,
        project: str,
        repo_url: str,
        source_branch: str,
        target_branch: str,
        title: str,
        description: str,
    ) -> str:
        config = await IntegrationConfigService(self.db).get_config(organization_id, 'azure')
        if config is None or not config.secret:
            raise ValueError('Azure integration not configured')

        org_url = config.base_url.rstrip('/')
        repo_name = self._extract_repo_name(repo_url)
        if not repo_name:
            raise ValueError('Azure repo URL could not be parsed from mapping')

        pr_api = f'{org_url}/{project}/_apis/git/repositories/{repo_name}/pullrequests?api-version=7.1-preview.1'
        payload = {
            'sourceRefName': f'refs/heads/{source_branch}',
            'targetRefName': f'refs/heads/{target_branch}',
            'title': title,
            'description': description,
        }

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(pr_api, headers=self._headers(config.secret), json=payload)
            resp.raise_for_status()
            data = resp.json()

        links = data.get('_links', {}) if isinstance(data, dict) else {}
        web = (links.get('web') or {}).get('href') if isinstance(links, dict) else None
        return web or data.get('url') or ''

    def _headers(self, pat: str) -> dict[str, str]:
        token = base64.b64encode(f':{pat}'.encode()).decode()
        return {'Authorization': f'Basic {token}', 'Content-Type': 'application/json'}

    def _extract_repo_name(self, repo_url: str) -> str:
        parsed = urlparse(repo_url)
        path = (parsed.path or '').rstrip('/')
        if '/_git/' in path:
            return path.split('/_git/')[-1].strip()
        return path.rsplit('/', 1)[-1].strip()
