import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/file-utils';
import { convertDocument } from '@/lib/converters/document';
import { convertToLatex } from '@/lib/converters/latex';
import { convertOcrToMarkdown } from '@/lib/converters/ocr';
import { stat } from 'fs/promises';
import { MAX_FILE_SIZE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const action = (formData.get('action') as string) || 'convert';
    const outputFormat = (formData.get('outputFormat') as string) || 'pdf';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE.document) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 200MB)' },
        { status: 400 }
      );
    }

    const { filePath: inputPath } = await saveUploadedFile(file);
    
    let result: { filePath: string; fileId: string };

    if (action === 'to-latex') {
      result = await convertToLatex(inputPath);
    } else if (action === 'ocr-to-md') {
      result = await convertOcrToMarkdown(inputPath);
    } else {
      result = await convertDocument(inputPath, outputFormat);
    }

    const outputStat = await stat(result.filePath);
    const finalFormat = result.filePath.split('.').pop() || outputFormat;

    return NextResponse.json({
      success: true,
      data: {
        id: result.fileId,
        fileName: `converted.${finalFormat}`,
        fileSize: outputStat.size,
        outputFormat: finalFormat,
        downloadUrl: `/api/download/${result.fileId}`,
        expiresAt: Date.now() + 30 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error('Document conversion/processing error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
