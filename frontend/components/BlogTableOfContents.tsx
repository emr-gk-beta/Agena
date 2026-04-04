'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function BlogTableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const el = document.querySelector('.blog-content');
    if (!el) return;

    const nodes = el.querySelectorAll('h2, h3');
    const items: TocItem[] = [];
    nodes.forEach((node, i) => {
      const id = `heading-${i}`;
      node.id = id;
      items.push({
        id,
        text: node.textContent || '',
        level: node.tagName === 'H2' ? 2 : 3,
      });
    });
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 3) return null;

  return (
    <nav className='blog-toc' style={{
      position: 'sticky',
      top: 88,
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto',
      padding: '16px 0',
      fontSize: 13,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        On this page
      </div>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          style={{
            color: activeId === h.id ? 'var(--accent)' : 'var(--ink-35)',
            textDecoration: 'none',
            paddingLeft: h.level === 3 ? 16 : 0,
            lineHeight: 1.6,
            fontWeight: activeId === h.id ? 600 : 400,
            transition: 'color 0.2s',
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
