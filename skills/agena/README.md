# AGENA Skills

Hand-authored [SKILL.md](https://github.com/anthropics/skills) files distilled
from patterns we've shipped to production in [AGENA](https://agena.dev) — an
open-source agentic AI platform that writes code, reviews quality, and ships
pull requests autonomously.

Each skill is **MIT-licensed**, **hand-picked, not AI-slop generated**, and
designed to drop straight into Claude Code / Cursor / Codex / Gemini CLI /
GitHub Copilot — same SKILL.md format the rest of the agent ecosystem uses.

## Catalog

| Skill | What it does | Tags |
|-------|--------------|------|
| [cross-source-correlation](./cross-source-correlation/SKILL.md) | Correlate PR merges + deploys + Sentry/NewRelic/Datadog/AppDynamics + Jira/Azure events into confidence-scored clusters that answer "which deploy caused this bug" | `observability`, `incident-response`, `correlation` |
| [stale-ticket-triage](./stale-ticket-triage/SKILL.md) | Replace the weekly "look at every ticket older than X days" meeting with a scheduled AI scan that picks close/snooze/keep per ticket | `project-management`, `jira`, `azure-devops`, `backlog-grooming` |
| [review-backlog-killer](./review-backlog-killer/SKILL.md) | Detect PRs aging past warn/critical thresholds, score severity, and nudge reviewers via Slack DM, channel, email, or PR comment | `code-review`, `pull-request`, `slack`, `devex` |
| [owasp-reviewer-prompt](./owasp-reviewer-prompt/SKILL.md) | Paranoid OWASP-Top-10-aware system prompt for AI code review with structured Summary / Findings / Severity / Score output | `code-review`, `security`, `owasp`, `prompt-engineering` |
| [integration-rule-engine](./integration-rule-engine/SKILL.md) | Declarative routing engine — ticket attributes (reporter, label, project, area path, error class, environment) → tag + AI agent + priority | `routing`, `jira`, `sentry`, `azure-devops`, `declarative` |

## Format

Each skill is a folder containing one `SKILL.md`:

```
skill-name/
└── SKILL.md
```

The SKILL.md uses the standard YAML frontmatter format:

```yaml
---
name: skill-name
description: One paragraph describing what the skill does and when to use it.
tags: [tag-1, tag-2, tag-3]
publisher: agena
---

# Skill Name

Markdown body — instructions, examples, and notes the agent reads when this
skill is retrieved into its system prompt.
```

## Compatibility

These skills are agent-agnostic:

- ✅ Claude Code
- ✅ Cursor
- ✅ Codex
- ✅ Gemini CLI
- ✅ GitHub Copilot
- ✅ AGENA's own runtime (auto-imported into the public library — see
      [/dashboard/skills](https://agena.dev/dashboard/skills))

## License

MIT. See [LICENSE](https://github.com/aozyildirim/Agena/blob/main/LICENSE).

## Contributing

If you ship a pattern that's worth distilling, open a PR. Tests + before/after
metrics in the description help, but they're not required — clarity is.

The bar: a SKILL.md should make the next senior engineer faster, not the LLM
verbose.
