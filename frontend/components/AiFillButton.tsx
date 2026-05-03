'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useLocale } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';

type Provider = 'auto' | 'claude_cli' | 'codex_cli' | 'openai' | 'anthropic' | 'gemini';

const PROVIDER_LABELS: Record<Provider, string> = {
  auto: 'auto',
  claude_cli: 'claude cli',
  codex_cli: 'codex cli',
  openai: 'openai',
  anthropic: 'anthropic',
  gemini: 'gemini',
};

const PROVIDER_CYCLE: Provider[] = ['auto', 'claude_cli', 'codex_cli', 'openai', 'anthropic', 'gemini'];

export interface AiFillResult {
  story_context: string;
  acceptance_criteria: string;
  edge_cases: string;
  used_provider: string;
  used_model: string;
}

/** Single-purpose "🪄 AI ile Doldur" button used by every task-creation
 * surface (sprints import, refinement import, /dashboard/tasks form).
 * The page hands over title + description and gets back the three free-
 * text fields the user usually has to type by hand. The provider is
 * resolved on the backend (preferred_provider → CLI bridge or hosted
 * org credentials), but the user can cycle through explicit overrides
 * via the small chip next to the button. */
export default function AiFillButton({
  title,
  description,
  onFilled,
  onError,
  disabled,
  size = 'md',
}: {
  title: string;
  description: string;
  onFilled: (r: AiFillResult) => void;
  onError?: (msg: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}) {
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<Provider>('auto');

  const hasInput = (title || '').trim().length > 0 || (description || '').trim().length > 0;
  const blocked = !!disabled || busy || !hasInput;

  async function run() {
    if (blocked) return;
    setBusy(true);
    try {
      const body: Record<string, string> = { title: title || '', description: description || '' };
      if (provider !== 'auto') body.provider = provider;
      const res = await apiFetch<AiFillResult>('/tasks/ai-fill', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      onFilled(res);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'AI fill failed';
      if (onError) onError(msg);
      else alert(msg);
    } finally {
      setBusy(false);
    }
  }

  function cycleProvider(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setProvider((p) => {
      const idx = PROVIDER_CYCLE.indexOf(p);
      return PROVIDER_CYCLE[(idx + 1) % PROVIDER_CYCLE.length];
    });
  }

  const padY = size === 'sm' ? 5 : 7;
  const padX = size === 'sm' ? 9 : 12;
  const fontSize = size === 'sm' ? 10 : 11;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'stretch', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(168,85,247,0.4)' }}>
      <button
        type='button'
        onClick={run}
        disabled={blocked}
        title={t('tasks.aiFill.button' as TranslationKey) || 'Fill with AI'}
        style={{
          padding: `${padY}px ${padX}px`,
          fontSize, fontWeight: 700,
          border: 'none',
          borderRight: '1px solid rgba(168,85,247,0.4)',
          background: blocked ? 'rgba(168,85,247,0.06)' : 'rgba(168,85,247,0.12)',
          color: blocked ? 'var(--ink-35)' : '#c084fc',
          cursor: blocked ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}
      >
        {busy
          ? `⏳ ${t('tasks.aiFill.running' as TranslationKey) || 'Generating…'}`
          : `🪄 ${t('tasks.aiFill.button' as TranslationKey) || 'AI ile Doldur'}`}
      </button>
      <button
        type='button'
        onClick={cycleProvider}
        title={t('tasks.aiFill.providerHint' as TranslationKey) || 'Click to switch provider'}
        style={{
          padding: `${padY}px 8px`,
          fontSize: fontSize - 1, fontWeight: 700,
          border: 'none',
          background: 'rgba(168,85,247,0.06)',
          color: '#a78bfa',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'monospace',
        }}
      >
        ⏷ {PROVIDER_LABELS[provider]}
      </button>
    </span>
  );
}
