import { execSync } from 'child_process';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Commit {
  hash: string;
  short: string;
  message: string;
  date: string;
  author: string;
  type: 'feat' | 'fix' | 'docs' | 'other';
}

function categorize(msg: string): Commit['type'] {
  if (msg.startsWith('feat')) return 'feat';
  if (msg.startsWith('fix')) return 'fix';
  if (msg.startsWith('docs')) return 'docs';
  return 'other';
}

export async function GET() {
  try {
    const raw = execSync(
      'git log --oneline -100 --format="%h|%s|%ai|%an"',
      { cwd: '/var/www/tiqr', encoding: 'utf-8', timeout: 5000 }
    );

    const commits: Commit[] = raw
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [short, message, date, author] = line.split('|');
        return {
          hash: short,
          short,
          message: message.replace(/^(feat|fix|docs|chore|refactor|style|test|perf|ci|build)(\(.+?\))?:\s*/, ''),
          date: date.slice(0, 10),
          author,
          type: categorize(message),
        };
      });

    return NextResponse.json(commits, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
