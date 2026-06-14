import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/file-utils';
import { convertImage, compressImage, resizeImage } from '@/lib/converters/image';
import { purgeExif } from '@/lib/converters/privacy';
import { stat } from 'fs/promises';
import { MAX_FILE_SIZE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const action = (formData.get('action') as string) || 'convert';
    const outputFormat = (formData.get('outputFormat') as string) || 'png';
    const quality = parseInt((formData.get('quality') as string) || '90', 10);
    const width = parseInt((formData.get('width') as string) || '0', 10);
    const height = parseInt((formData.get('height') as string) || '0', 10);

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE.image) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 100MB)' },
        { status: 400 }
      );
    }

    // Save uploaded file
    const { filePath: inputPath } = await saveUploadedFile(file);

    let result: { filePath: string; fileId: string };

    switch (action) {
      case 'convert':
        result = await convertImage(inputPath, outputFormat, { quality });
        break;

      case 'compress':
        const compressResult = await compressImage(inputPath, quality);
        result = { filePath: compressResult.filePath, fileId: compressResult.fileId };
        break;

      case 'exif-purge':
        result = await purgeExif(inputPath);
        break;

      case 'resize':
        if (!width && !height) {
          return NextResponse.json(
            { success: false, error: 'Width or height required for resize' },
            { status: 400 }
          );
        }
        result = await resizeImage(inputPath, width, height, outputFormat);
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
    console.error('Image conversion error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}
