'use client';

import { useState, FormEvent } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'ok' : 'err');
      if (res.ok) setEmail('');
    } catch {
      setStatus('err');
    }
  }

  if (status === 'ok') {
    return (
      <p style={{ color: '#5EEAD4', fontSize: 15, fontWeight: 600 }}>
        Thanks! You&apos;re subscribed.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='you@company.com'
        required
        style={{
          padding: '12px 18px',
          borderRadius: 10,
          border: '1px solid rgba(13,148,136,0.25)',
          background: 'rgba(7,15,26,0.5)',
          color: 'var(--ink-90)',
          fontSize: 14,
          width: 260,
          outline: 'none',
        }}
      />
      <button type='submit' className='button button-primary' style={{ padding: '12px 24px', fontSize: 14 }}>
        Subscribe
      </button>
      {status === 'err' && <p style={{ color: '#f87171', fontSize: 13, width: '100%' }}>Something went wrong. Try again.</p>}
    </form>
  );
}
