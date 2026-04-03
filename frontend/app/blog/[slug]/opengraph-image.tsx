import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AGENA Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const posts: Record<string, { title: string; tag: string }> = {
  'what-is-agentic-ai': { title: 'What is Agentic AI?', tag: 'Agentic AI' },
  'pixel-agent-technology': { title: 'Pixel Agent Technology', tag: 'Pixel Agent' },
  'ai-code-generation-best-practices': { title: 'AI Code Generation Best Practices', tag: 'Code Generation' },
  'crewai-langgraph-orchestration': { title: 'CrewAI + LangGraph Orchestration', tag: 'Multi-Agent' },
  'multi-tenant-ai-saas-architecture': { title: 'Multi-Tenant AI SaaS Architecture', tag: 'Architecture' },
  'yapay-zeka-ile-kod-yazma': { title: 'Yapay Zeka ile Kod Yazma', tag: 'Yapay Zeka' },
  'ai-agent-nedir': { title: 'AI Agent Nedir?', tag: 'AI Agent' },
  'github-copilot-alternative': { title: 'AGENA vs GitHub Copilot', tag: 'Comparison' },
  'agentic-ai-nedir': { title: 'Agentic AI Nedir?', tag: 'Agentic AI' },
  'otonom-kodlama-rehberi': { title: 'Otonom Kodlama Rehberi', tag: 'Otonom Kodlama' },
  'ai-ile-pr-otomasyonu': { title: 'AI ile PR Otomasyonu', tag: 'PR Otomasyon' },
};

export default async function Image({ params }: { params: { slug: string } }) {
  const post = posts[params.slug] || { title: 'AGENA Blog', tag: 'Blog' };

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #070F1A 0%, #0A1625 50%, #0d2137 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%)',
            top: -150,
            right: -100,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            bottom: -80,
            left: -60,
          }}
        />

        {/* Top: Tag + AGENA branding */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          <div
            style={{
              padding: '8px 24px',
              borderRadius: 20,
              border: '1px solid rgba(20,184,166,0.4)',
              background: 'rgba(13,148,136,0.15)',
              color: '#5EEAD4',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {post.tag}
          </div>
          <div style={{ fontSize: 24, color: '#64748b', fontWeight: 600 }}>agena.dev/blog</div>
        </div>

        {/* Center: Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, zIndex: 1 }}>
          <div
            style={{
              fontSize: post.title.length > 40 ? 44 : 52,
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            {post.title}
          </div>
        </div>

        {/* Bottom: AGENA logo text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #22D3EE, #14B8A6, #22c55e)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            AGENA
          </div>
          <div style={{ width: 2, height: 28, background: '#334155' }} />
          <div style={{ fontSize: 18, color: '#94a3b8' }}>Agentic AI Platform</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
