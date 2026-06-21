import { NextRequest, NextResponse } from 'next/server';
import { getUsageStats } from '@/lib/usage-store';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await getUsageStats();
  return NextResponse.json({ success: true, data: stats });
}
