from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession
from tenacity import retry, stop_after_attempt, wait_exponential

from agents.orchestrator import AgentOrchestrator
from core.settings import get_settings
from models.run_record import RunRecord
from models.task_record import TaskRecord
from schemas.agent import AgentRunResult, UsageStats
from schemas.github import CreatePRRequest, GitHubFileChange
from services.azure_pr_service import AzurePRService
from services.github_service import GitHubService
from services.llm.cost_tracker import CostTracker
from services.local_repo_service import LocalRepoService
from services.task_service import TaskService
from services.usage_service import UsageService


@dataclass
class TaskRouting:
    effective_source: str
    external_source: str | None
    azure_project: str | None
    azure_repo_url: str | None
    local_repo_mapping: str | None
    local_repo_path: str | None


class OrchestrationService:
    def __init__(self, db_session: AsyncSession) -> None:
        self.settings = get_settings()
        self.db_session = db_session
        self.orchestrator = AgentOrchestrator()
        self.github_service = GitHubService()
        self.azure_pr_service = AzurePRService(db_session)
        self.local_repo_service = LocalRepoService()
        self.cost_tracker = CostTracker()

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=8), reraise=True)
    async def run_task_record(self, organization_id: int, task_id: int, create_pr: bool = True) -> AgentRunResult:
        task = await self.db_session.get(TaskRecord, task_id)
        if task is None or task.organization_id != organization_id:
            raise ValueError('Task not found for organization')

        task_service = TaskService(self.db_session)
        usage_service = UsageService(self.db_session)

        task.status = 'running'
        await self.db_session.commit()
        await task_service.add_log(task.id, organization_id, 'running', 'Agent pipeline started')

        routing = self._extract_task_routing(task)
        payload = {
            'id': str(task.id),
            'title': task.title,
            'description': task.description,
            'source': routing.effective_source,
        }

        try:
            state = await self.orchestrator.run(payload)
            final_code = state.get('final_code', '')
            pr_url = None
            branch_name = None
            pr_payload = self._build_pr_payload(task=payload, reviewed_code=final_code)

            if routing.local_repo_path:
                await task_service.add_log(
                    task.id,
                    organization_id,
                    'local_exec',
                    f'Applying changes in mapped local repo: {routing.local_repo_mapping or routing.local_repo_path}',
                )
                has_changes, branch_name = await self.local_repo_service.apply_changes_and_push(
                    repo_path=routing.local_repo_path,
                    branch_name=pr_payload.branch_name,
                    base_branch=pr_payload.base_branch,
                    commit_message=pr_payload.commit_message,
                    files=pr_payload.files,
                )
                if not has_changes:
                    await task_service.add_log(task.id, organization_id, 'local_exec', 'No file changes detected, skipping PR')

                if create_pr and has_changes:
                    if routing.effective_source == 'azure' and routing.azure_project and routing.azure_repo_url:
                        pr_url = await self.azure_pr_service.create_pr(
                            organization_id,
                            project=routing.azure_project,
                            repo_url=routing.azure_repo_url,
                            source_branch=branch_name,
                            target_branch=pr_payload.base_branch,
                            title=pr_payload.title,
                            description=pr_payload.body,
                        )
                        await task_service.add_log(task.id, organization_id, 'pr', f'Azure PR created: {pr_url}')
                    else:
                        await task_service.add_log(
                            task.id,
                            organization_id,
                            'pr',
                            'Local push completed but PR target was not resolved from task mapping',
                        )
            elif create_pr and self._can_create_github_pr():
                branch_name = pr_payload.branch_name
                pr_url = await self.github_service.create_pr(pr_payload)
                await task_service.add_log(task.id, organization_id, 'pr', f'GitHub PR created: {pr_url}')
            elif create_pr:
                await task_service.add_log(task.id, organization_id, 'pr', 'PR skipped because provider configuration is missing')

            usage = state.get('usage', {'prompt_tokens': 0, 'completion_tokens': 0, 'total_tokens': 0})
            model_for_cost = (state.get('model_usage') or ['gpt-4o-mini'])[-1]
            estimated_cost = self.cost_tracker.estimate_cost_usd(
                prompt_tokens=int(usage.get('prompt_tokens', 0)),
                completion_tokens=int(usage.get('completion_tokens', 0)),
                model=model_for_cost,
            )

            run = RunRecord(
                task_id=task.id,
                organization_id=organization_id,
                source=payload['source'],
                spec=state.get('spec', {}),
                generated_code=state.get('generated_code', ''),
                reviewed_code=final_code,
                usage_prompt_tokens=usage.get('prompt_tokens', 0),
                usage_completion_tokens=usage.get('completion_tokens', 0),
                usage_total_tokens=usage.get('total_tokens', 0),
                estimated_cost_usd=estimated_cost,
                pr_url=pr_url,
            )
            self.db_session.add(run)

            task.status = 'completed'
            task.pr_url = pr_url
            task.branch_name = branch_name
            await self.db_session.commit()

            await usage_service.increment_tokens(organization_id, int(usage.get('total_tokens', 0)))
            await task_service.add_log(task.id, organization_id, 'completed', 'Task completed successfully')

            return AgentRunResult(
                task_id=str(task.id),
                spec=state.get('spec', {}),
                generated_code=state.get('generated_code', ''),
                reviewed_code=final_code,
                usage=UsageStats(**usage),
                pr_url=pr_url,
            )
        except Exception as exc:
            task.status = 'failed'
            task.failure_reason = str(exc)
            await self.db_session.commit()
            await task_service.add_log(task.id, organization_id, 'failed', str(exc))
            raise

    def _build_pr_payload(self, task: dict[str, Any], reviewed_code: str) -> CreatePRRequest:
        branch_suffix = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        safe_id = re.sub(r'[^a-zA-Z0-9_-]', '-', task.get('id', 'task'))
        branch_name = f'ai-task/{safe_id}-{branch_suffix}'

        parsed_files = self._parse_reviewed_output_to_files(reviewed_code)
        if not parsed_files:
            parsed_files = [
                GitHubFileChange(
                    path=f'generated/task_{safe_id}.md',
                    content=reviewed_code,
                )
            ]

        return CreatePRRequest(
            branch_name=branch_name,
            title=f"[AI] {task.get('title', 'Generated Task')}",
            body=(
                'Automated PR generated by AI orchestration pipeline.\n\n'
                f"Source: {task.get('source', 'unknown')}\n"
                f"Task ID: {task.get('id', '')}"
            ),
            base_branch=self.settings.github_default_base_branch,
            commit_message=f"feat(ai): implement task {task.get('id', '')}",
            files=parsed_files,
        )

    def _parse_reviewed_output_to_files(self, reviewed_code: str) -> list[GitHubFileChange]:
        file_pattern = re.compile(r'\*\*File:\s*(.*?)\*\*\n```[\w\n]*\n(.*?)```', re.DOTALL)
        matches = file_pattern.findall(reviewed_code)
        files: list[GitHubFileChange] = []
        for path, content in matches:
            files.append(GitHubFileChange(path=path.strip(), content=content.rstrip() + '\n'))
        return files

    def _extract_task_routing(self, task: TaskRecord) -> TaskRouting:
        meta: dict[str, str] = {}
        for raw in (task.description or '').splitlines():
            if ':' not in raw:
                continue
            key, value = raw.split(':', 1)
            meta[key.strip().lower()] = value.strip()

        external_source = meta.get('external source')
        effective_source = task.source
        if external_source and external_source.lower().startswith('azure'):
            effective_source = 'azure'
        elif external_source and external_source.lower().startswith('jira'):
            effective_source = 'jira'

        return TaskRouting(
            effective_source=effective_source,
            external_source=external_source,
            azure_project=meta.get('project') or None,
            azure_repo_url=meta.get('azure repo') or None,
            local_repo_mapping=meta.get('local repo mapping') or None,
            local_repo_path=meta.get('local repo path') or None,
        )

    def _can_create_github_pr(self) -> bool:
        token = (self.settings.github_token or '').strip()
        owner = (self.settings.github_owner or '').strip()
        repo = (self.settings.github_repo or '').strip()
        if not token or not owner or not repo:
            return False
        if token.startswith('your_') or owner.startswith('your_') or repo.startswith('your_'):
            return False
        return True
