import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getConversionHistory, addConversionHistory, clearConversionHistory } from '@/lib/history-store';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
  }
  const entries = await getConversionHistory(session.user.email);
  return NextResponse.json({ success: true, data: entries });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
  }
  const entry = await req.json();
  if (!entry || !entry.id) {
    return NextResponse.json({ success: false, error: 'Invalid entry' }, { status: 400 });
  }
  await addConversionHistory(session.user.email, entry);
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
  }
  await clearConversionHistory(session.user.email);
  return NextResponse.json({ success: true });
}
