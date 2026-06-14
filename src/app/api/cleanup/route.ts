import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredFiles } from '@/lib/file-utils';

export async function GET(req: NextRequest) {
  // Simple API key protection for cron jobs
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('key');

  if (process.env.CLEANUP_API_KEY && apiKey !== process.env.CLEANUP_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const deleted = await cleanupExpiredFiles();
    return NextResponse.json({
      success: true,
      data: { deletedFiles: deleted, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  return GET(req);
}
