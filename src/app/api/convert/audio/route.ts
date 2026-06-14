import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/file-utils';
import { convertAudio } from '@/lib/converters/audio';
import { stat } from 'fs/promises';
import { MAX_FILE_SIZE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const outputFormat = (formData.get('outputFormat') as string) || 'mp3';
    const bitrate = (formData.get('bitrate') as string) || '192k';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE.audio) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 500MB)' },
        { status: 400 }
      );
    }

    const { filePath: inputPath } = await saveUploadedFile(file);
    const result = await convertAudio(inputPath, outputFormat, bitrate);
    const outputStat = await stat(result.filePath);

    return NextResponse.json({
      success: true,
      data: {
        id: result.fileId,
        fileName: `converted.${outputFormat}`,
        fileSize: outputStat.size,
        outputFormat,
        downloadUrl: `/api/download/${result.fileId}`,
        expiresAt: Date.now() + 30 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error('Audio conversion error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}
