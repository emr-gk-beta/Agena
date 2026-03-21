from __future__ import annotations

import asyncio
import os
import re
from pathlib import Path

from schemas.github import GitHubFileChange


class LocalRepoService:
    async def apply_changes_and_push(
        self,
        repo_path: str,
        branch_name: str,
        base_branch: str,
        commit_message: str,
        files: list[GitHubFileChange],
    ) -> tuple[bool, str]:
        root = Path(repo_path).expanduser().resolve()
        if not root.exists() or not root.is_dir():
            raise ValueError(f'Local repo path does not exist: {repo_path}')

        git_dir = root / '.git'
        if not git_dir.exists():
            raise ValueError(f'Not a git repository: {repo_path}')

        await self._run_git(root, ['fetch', 'origin', base_branch])
        await self._run_git(root, ['checkout', base_branch])
        await self._run_git(root, ['pull', '--ff-only', 'origin', base_branch])
        await self._run_git(root, ['checkout', '-B', branch_name])

        for file_change in files:
            target = self._safe_target(root, file_change.path)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(file_change.content, encoding='utf-8')

        await self._run_git(root, ['add', '-A'])
        has_changes = await self._has_staged_changes(root)
        if not has_changes:
            return False, branch_name

        await self._run_git(
            root,
            [
                '-c',
                'user.name=AI Agent',
                '-c',
                'user.email=ai-agent@local',
                'commit',
                '-m',
                commit_message,
            ],
        )
        await self._run_git(root, ['push', '-u', 'origin', branch_name])
        return True, branch_name

    async def _has_staged_changes(self, repo: Path) -> bool:
        proc = await asyncio.create_subprocess_exec(
            'git',
            '-C',
            str(repo),
            'diff',
            '--cached',
            '--quiet',
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        await proc.communicate()
        # --quiet returns 1 when changes exist, 0 when clean
        return proc.returncode == 1

    async def _run_git(self, repo: Path, args: list[str]) -> str:
        proc = await asyncio.create_subprocess_exec(
            'git',
            '-C',
            str(repo),
            *args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env={**os.environ, 'LC_ALL': 'C'},
        )
        out, err = await proc.communicate()
        if proc.returncode != 0:
            msg = (err.decode('utf-8', errors='ignore') or out.decode('utf-8', errors='ignore')).strip()
            raise RuntimeError(f"git {' '.join(args)} failed: {msg}")
        return out.decode('utf-8', errors='ignore').strip()

    def _safe_target(self, root: Path, rel_path: str) -> Path:
        clean = rel_path.strip().replace('\\', '/')
        clean = re.sub(r'^/+', '', clean)
        target = (root / clean).resolve()
        if not str(target).startswith(str(root)):
            raise ValueError(f'Invalid file path outside repository: {rel_path}')
        return target
