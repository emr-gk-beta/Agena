import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact – AGENA Agentic AI Platform',
  description:
    'Get in touch with the AGENA team. Questions about agentic AI, pricing, integrations, or enterprise plans? We\'d love to hear from you.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact – AGENA',
    description: 'Get in touch with the AGENA team for questions about agentic AI and autonomous code generation.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact AGENA' }],
  },
};

export default function ContactPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://agena.dev' },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://agena.dev/contact' },
    ],
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className='container page-container-narrow' style={{ maxWidth: 860, padding: '80px 24px' }}>
        <div style={{ marginBottom: 48 }}>
          <div className='section-label'>Contact</div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: 'var(--ink-90)', margin: '8px 0 16px' }}>
            Get in Touch
          </h1>
          <p style={{ color: 'var(--ink-45)', fontSize: 16, lineHeight: 1.7, maxWidth: 600 }}>
            Have a question about AGENA, need help with setup, or interested in enterprise plans? Drop us a message.
          </p>
        </div>

        <div className='contact-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}>
          {/* Form */}
          <div
            className='contact-form-wrapper'
            style={{
              padding: '32px',
              borderRadius: 16,
              background: 'rgba(13,148,136,0.04)',
              border: '1px solid rgba(13,148,136,0.1)',
            }}
          >
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                padding: '24px',
                borderRadius: 14,
                background: 'rgba(13,148,136,0.04)',
                border: '1px solid rgba(13,148,136,0.1)',
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-90)', marginBottom: 12 }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href='/docs' style={{ color: 'var(--accent)', fontSize: 14, textDecoration: 'none' }}>
                  Documentation
                </Link>
                <Link href='/changelog' style={{ color: 'var(--accent)', fontSize: 14, textDecoration: 'none' }}>
                  Changelog
                </Link>
                <Link href='/blog' style={{ color: 'var(--accent)', fontSize: 14, textDecoration: 'none' }}>
                  Blog
                </Link>
                <Link href='/use-cases' style={{ color: 'var(--accent)', fontSize: 14, textDecoration: 'none' }}>
                  Use Cases
                </Link>
              </div>
            </div>

            <div
              style={{
                padding: '24px',
                borderRadius: 14,
                background: 'rgba(13,148,136,0.04)',
                border: '1px solid rgba(13,148,136,0.1)',
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-90)', marginBottom: 12 }}>Open Source</h3>
              <p style={{ color: 'var(--ink-45)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
                AGENA is fully open source. Report bugs, request features, or contribute on GitHub.
              </p>
              <a
                href='https://github.com/aozyildirim/Agena'
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: 'var(--accent)', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}
              >
                github.com/aozyildirim/Agena
              </a>
            </div>

            <div
              style={{
                padding: '24px',
                borderRadius: 14,
                background: 'rgba(13,148,136,0.04)',
                border: '1px solid rgba(13,148,136,0.1)',
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-90)', marginBottom: 12 }}>Enterprise</h3>
              <p style={{ color: 'var(--ink-45)', fontSize: 13, lineHeight: 1.6 }}>
                Need custom models, SSO, or dedicated support? Reach out for enterprise pricing.
              </p>
            </div>
          </div>
        </div>
        {/* FAQ Section */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink-90)', marginBottom: 24 }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: 'How do I get started with AGENA?', a: 'Sign up for a free account, connect your GitHub or Azure DevOps repository, and create your first task. AGENA\'s AI agents will analyze, generate code, and open a pull request automatically.' },
              { q: 'Is AGENA open source?', a: 'Yes! AGENA is fully open source under the MIT license. You can self-host it or use the managed platform. The source code is available on GitHub.' },
              { q: 'Which integrations does AGENA support?', a: 'AGENA integrates with GitHub, Azure DevOps, Jira, Slack, and Microsoft Teams. We support OpenAI and Google Gemini as LLM providers.' },
              { q: 'Can I use my own LLM API keys?', a: 'Absolutely. AGENA supports bring-your-own-key for OpenAI and Google Gemini. Configure your API keys in the dashboard settings.' },
              { q: 'How does the free tier work?', a: 'The free tier includes 5 AI tasks per month with full feature access. No credit card required. Upgrade to Pro for unlimited tasks and priority processing.' },
              { q: 'Is my code secure?', a: 'AGENA never stores your source code. All repository access is scoped via OAuth tokens and code is processed in isolated sessions. Self-hosting gives you full control.' },
            ].map((faq) => (
              <details
                key={faq.q}
                style={{
                  padding: '18px 24px',
                  borderRadius: 14,
                  border: '1px solid var(--panel-border-2)',
                  background: 'var(--panel)',
                  cursor: 'pointer',
                }}
              >
                <summary style={{ color: 'var(--ink-90)', fontWeight: 600, fontSize: 15, lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.q}
                  <span style={{ color: 'var(--ink-35)', fontSize: 18, marginLeft: 12, flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ color: 'var(--ink-50)', fontSize: 14, lineHeight: 1.75, marginTop: 12 }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
