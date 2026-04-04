'use client';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label='Back to top'
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9998,
        width: 44,
        height: 44,
        borderRadius: 12,
        border: '1px solid rgba(13,148,136,0.3)',
        background: 'rgba(3,7,18,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'var(--accent)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease',
        transition: 'background 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(13,148,136,0.15)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13,148,136,0.5)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(3,7,18,0.85)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(13,148,136,0.3)';
      }}
    >
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='18 15 12 9 6 15' />
      </svg>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </button>
  );
}
