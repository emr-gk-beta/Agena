import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 – Page Not Found | AGENA',
  description: 'The page you are looking for does not exist. Explore AGENA — the agentic AI platform for autonomous code generation.',
};

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 120, fontWeight: 800, marginBottom: 0, lineHeight: 1 }}>
          <span className='gradient-text'>404</span>
        </div>
        <div style={{
          fontSize: 13,
          fontFamily: 'monospace',
          color: 'var(--ink-35)',
          marginBottom: 24,
          padding: '8px 16px',
          borderRadius: 8,
          background: 'rgba(13,148,136,0.06)',
          border: '1px solid rgba(13,148,136,0.1)',
          display: 'inline-block',
        }}>
          Error: page_not_found &mdash; The agent could not locate this route
        </div>
        <h2 style={{ color: 'var(--ink-90)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          Lost in the codebase
        </h2>
        <p style={{ color: 'var(--ink-45)', fontSize: 16, marginBottom: 40, maxWidth: 440 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let our agents guide you back.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href='/' className='button button-primary' style={{ padding: '12px 28px', fontSize: 15 }}>
            Go Home
          </Link>
          <Link href='/docs' className='button button-outline' style={{ padding: '12px 28px', fontSize: 15 }}>
            Docs
          </Link>
          <Link href='/blog' className='button button-outline' style={{ padding: '12px 28px', fontSize: 15 }}>
            Blog
          </Link>
          <Link href='/contact' className='button button-outline' style={{ padding: '12px 28px', fontSize: 15 }}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
