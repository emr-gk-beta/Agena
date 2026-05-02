'use client';

import { useEffect } from 'react';
import { useLocale } from '@/lib/i18n';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>&#x26A0;</div>
      <h2 style={{ color: 'var(--ink-90)', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
        {t('error.title')}
      </h2>
      <p style={{ color: 'var(--ink-45)', fontSize: 15, marginBottom: 28, maxWidth: 400 }}>
        {t('error.body')}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={reset}
          className='button button-primary'
          style={{ padding: '10px 24px', fontSize: 14 }}
        >
          {t('error.retry')}
        </button>
        <a href='/dashboard/office' className='button button-outline' style={{ padding: '10px 24px', fontSize: 14 }}>
          {t('error.backToOffice')}
        </a>
      </div>
    </div>
  );
}
