import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const FILE = join(process.cwd(), 'newsletter-subscribers.json');

async function getSubscribers(): Promise<string[]> {
  try {
    const data = await readFile(FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const subs = await getSubscribers();

    if (subs.includes(normalized)) {
      return NextResponse.json({ ok: true, message: 'Already subscribed' });
    }

    subs.push(normalized);
    await writeFile(FILE, JSON.stringify(subs, null, 2));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
