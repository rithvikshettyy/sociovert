import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/file-utils';
import { createArchive, extractArchive } from '@/lib/converters/archive';
import { stat } from 'fs/promises';
import { MAX_FILE_SIZE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const action = (formData.get('action') as string) || 'create';
    const outputFormat = (formData.get('outputFormat') as string) || 'zip';
    const files = formData.getAll('file') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No file(s) provided' },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE.archive) {
        return NextResponse.json(
          { success: false, error: 'File too large (max 1GB)' },
          { status: 400 }
        );
      }
    }

    const savedFiles = await Promise.all(files.map((f) => saveUploadedFile(f)));
    const inputPaths = savedFiles.map((f) => f.filePath);

    let result: { filePath: string; fileId: string };

    switch (action) {
      case 'create':
        result = await createArchive(inputPaths, outputFormat);
        break;
      case 'extract':
        result = await extractArchive(inputPaths[0]);
        break;
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    const outputStat = await stat(result.filePath);
    const outputExt = result.filePath.split('.').pop() || 'zip';

    return NextResponse.json({
      success: true,
      data: {
        id: result.fileId,
        fileName: `archive.${outputExt}`,
        fileSize: outputStat.size,
        outputFormat: outputExt,
        downloadUrl: `/api/download/${result.fileId}`,
        expiresAt: Date.now() + 30 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error('Archive error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Operation failed' },
      { status: 500 }
    );
  }
}
