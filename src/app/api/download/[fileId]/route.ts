import { NextRequest, NextResponse } from 'next/server';
import { findFileById } from '@/lib/file-utils';
import { readFile } from 'fs/promises';
import { MIME_MAP } from '@/lib/constants';

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;
    const file = await findFileById(fileId);

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File not found or expired' },
        { status: 404 }
      );
    }

    const buffer = await readFile(file.filePath);
    const mimeType = MIME_MAP[file.ext] || 'application/octet-stream';
    const fileName = `converted.${file.ext}`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: 'Download failed' },
      { status: 500 }
    );
  }
}
