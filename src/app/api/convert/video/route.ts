import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/file-utils';
import { convertVideo, compressVideo, extractAudio } from '@/lib/converters/video';
import { stat } from 'fs/promises';
import { MAX_FILE_SIZE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const action = (formData.get('action') as string) || 'convert';
    const outputFormat = (formData.get('outputFormat') as string) || 'mp4';
    const quality = parseInt((formData.get('quality') as string) || '28', 10);
    const url = formData.get('url') as string | null;
    const format = (formData.get('format') as string) || 'mp4';

    if (action === 'download') {
      if (!url) {
        return NextResponse.json(
          { success: false, error: 'No URL provided' },
          { status: 400 }
        );
      }

      const { downloadMedia } = await import('@/lib/converters/downloader');
      const result = await downloadMedia(url, format as 'mp4' | 'mp3');
      const outputStat = await stat(result.filePath);

      return NextResponse.json({
        success: true,
        data: {
          id: result.fileId,
          fileName: `${result.title}.${result.ext}`,
          fileSize: outputStat.size,
          outputFormat: result.ext,
          downloadUrl: `/api/download/${result.fileId}`,
          expiresAt: Date.now() + 30 * 60 * 1000,
        },
      });
    }

    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE.video) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 2GB)' },
        { status: 400 }
      );
    }

    const { filePath: inputPath } = await saveUploadedFile(file);

    let result: { filePath: string; fileId: string };

    switch (action) {
      case 'convert':
        result = await convertVideo(inputPath, outputFormat);
        break;
      case 'compress':
        result = await compressVideo(inputPath, quality);
        break;
      case 'extract':
        result = await extractAudio(inputPath, outputFormat);
        break;
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    const outputStat = await stat(result.filePath);
    const outputExt = result.filePath.split('.').pop() || outputFormat;

    return NextResponse.json({
      success: true,
      data: {
        id: result.fileId,
        fileName: `converted.${outputExt}`,
        fileSize: outputStat.size,
        outputFormat: outputExt,
        downloadUrl: `/api/download/${result.fileId}`,
        expiresAt: Date.now() + 30 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error('Video conversion error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}
