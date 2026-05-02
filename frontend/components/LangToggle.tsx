'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n';

export default function LangToggle({ style }: { style?: React.CSSProperties }) {
  const { lang, setLang, t } = useLocale();
  const router = useRouter();

  function onChangeLang(next: 'tr' | 'en' | 'es' | 'zh' | 'it' | 'de' | 'ja') {
    setLang(next);
    // Server-rendered pages (landings, OG metadata) cache the locale at
    // render time, so picking a new language has to re-fetch the route.
    // router.refresh() tells Next.js to rerun the server component for
    // the current path with the freshly-written cookie.
    router.refresh();
  }

  return (
    <select
      value={lang}
      onChange={(e) => onChangeLang(e.target.value as 'tr' | 'en' | 'es' | 'zh' | 'it' | 'de' | 'ja')}
      title={t('tooltip.action.language')}
      suppressHydrationWarning
      style={{
        padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
        border: '1px solid var(--border)',
        background: 'var(--glass)',
        color: 'var(--muted)', fontSize: 12, fontWeight: 700,
        letterSpacing: 0.2, transition: 'all 0.2s',
        appearance: 'none',
        ...style,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = 'rgba(13,148,136,0.4)'; (e.currentTarget as HTMLSelectElement).style.color = '#0d9488'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLSelectElement).style.color = 'var(--muted)'; }}
    >
      <option value='tr'>🇹🇷 TR</option>
      <option value='en'>🇬🇧 EN</option>
      <option value='es'>🇪🇸 ES</option>
      <option value='zh'>🇨🇳 中文</option>
      <option value='it'>🇮🇹 IT</option>
      <option value='de'>🇩🇪 DE</option>
      <option value='ja'>🇯🇵 日本語</option>
    </select>
  );
}
