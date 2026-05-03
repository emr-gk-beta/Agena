'use client';

import { useEffect, useMemo, useRef } from 'react';
import { apiDownloadBlob } from '@/lib/api';
import { renderMarkdown } from '@/lib/markdown';

const AUTH_IMAGE_HOST_RE = /(dev\.azure\.com\/|\/_apis\/wit\/attachments\/|atlassian\.net\/)/i;

/**
 * Renders a task description (Markdown / sanitized HTML from
 * `lib/markdown.renderMarkdown`) and, after mount, re-routes any
 * authenticated remote images (Azure DevOps / Jira attachments) through
 * the backend's image proxy so they actually load — `<img src>` can't
 * carry Authorization headers, but our `apiDownloadBlob` can. Object
 * URLs are revoked on unmount.
 */
export default function RichDescription({
  html,
  className,
  style,
}: {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const renderedHtml = useMemo(() => renderMarkdown(html || ''), [html]);

  useEffect(() => {
    if (!ref.current) return;
    const created: string[] = [];
    let cancelled = false;
    const imgs = Array.from(ref.current.querySelectorAll('img'));
    imgs.forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (!AUTH_IMAGE_HOST_RE.test(src)) return;
      apiDownloadBlob(`/tasks/proxy-image?url=${encodeURIComponent(src)}`)
        .then((blob) => {
          if (cancelled) return;
          const url = URL.createObjectURL(blob);
          created.push(url);
          img.setAttribute('src', url);
        })
        .catch((err) => {
          // Surface the failure on the broken <img> so the user can
          // hover the placeholder and see why — most common cause is
          // being logged into a different org than the one that owns
          // the integration credentials. Console-log too so devtools
          // network tab shows the proxy 4xx alongside the message.
          const msg = err instanceof Error ? err.message : String(err);
          img.setAttribute('alt', `Image (proxy failed: ${msg})`);
          img.setAttribute('title', `Image proxy failed: ${msg}. Make sure you're signed into the org that owns the Azure / Jira integration.`);
          // eslint-disable-next-line no-console
          console.warn('[RichDescription] image proxy failed for', src, msg);
        });
    });
    return () => {
      cancelled = true;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [renderedHtml]);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
