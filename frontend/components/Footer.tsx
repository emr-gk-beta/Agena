'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/i18n';
import NewsletterForm from '@/components/NewsletterForm';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLocale();

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/signin') || pathname?.startsWith('/signup')) {
    return null;
  }

  return (
    <footer style={{ borderTop: '1px solid var(--panel-border)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <h4 style={{ color: 'var(--ink-65)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{t('footer.solutions')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href='/cross-source-insights' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>🧠 Cross-Source Insights</Link>
              <Link href='/stale-ticket-triage' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>🧹 Stale Ticket Triage</Link>
              <Link href='/review-backlog-killer' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>⏱ Review Backlog Killer</Link>
              <Link href='/ai-code-review' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>🔎 AI Code Review</Link>
              <Link href='/ai-sprint-refinement' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>✨ AI Sprint Refinement</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--ink-65)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{t('footer.integrations')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href='/sentry-ai-auto-fix' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>🚨 Sentry AI Auto-Fix</Link>
              <Link href='/jira-ai-agent' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>🪐 Jira AI Agent</Link>
              <Link href='/azure-devops-ai-bot' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>🟦 Azure DevOps AI Bot</Link>
              <Link href='/newrelic-ai-agent' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>📡 New Relic AI Agent</Link>
              <Link href='/vs/seer' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>vs Sentry Seer</Link>
              <Link href='/vs/coderabbit' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>vs CodeRabbit</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--ink-65)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{t('footer.product')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href='/use-cases' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.useCases')}</Link>
              <Link href='/integrations' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.integrations')}</Link>
              <Link href='/docs' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.docs')}</Link>
              <Link href='/roadmap' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.roadmap')}</Link>
              <Link href='/api-docs' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.apiDocs')}</Link>
              <Link href='/changelog' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.changelog')}</Link>
              <Link href='/blog/github-copilot-alternative' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.compare')}</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--ink-65)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{t('footer.resources')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href='/blog' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.blog')}</Link>
              <Link href='/glossary' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.glossary')}</Link>
              <Link href='/blog/what-is-agentic-ai' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.agenticAI')}</Link>
              <Link href='/blog/pixel-agent-technology' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.pixelAgent')}</Link>
              <Link href='/blog/github-copilot-alternative' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.vsCopilot')}</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--ink-65)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{t('footer.community')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href='https://github.com/aozyildirim/Agena' target='_blank' rel='noopener noreferrer' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>GitHub</a>
              <a href='https://github.com/sponsors/aozyildirim' target='_blank' rel='noreferrer' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.sponsor')}</a>
              <a href='https://github.com/aozyildirim/Agena/issues' target='_blank' rel='noopener noreferrer' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.issues')}</a>
              <Link href='/contact' style={{ color: 'var(--ink-35)', fontSize: 13, textDecoration: 'none' }}>{t('footer.contact')}</Link>
            </div>
          </div>
        </div>
        {/* Newsletter */}
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--panel-border)', textAlign: 'center', marginBottom: 24 }}>
          <h4 style={{ color: 'var(--ink-65)', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{t('footer.stayInLoop')}</h4>
          <p style={{ color: 'var(--ink-35)', fontSize: 13, marginBottom: 16 }}>{t('footer.noSpam')}</p>
          <NewsletterForm />
        </div>

        <div style={{ textAlign: 'center', paddingTop: 24, borderTop: '1px solid var(--panel-border)' }}>
          <p style={{ color: 'var(--ink-25)', fontSize: 11 }}>
            &copy; {new Date().getFullYear()} AGENA. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
