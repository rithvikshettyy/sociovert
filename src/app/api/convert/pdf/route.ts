import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/file-utils';
import {
  mergePdfs,
  splitPdf,
  compressPdf,
  pdfToImage,
  imageToPdf,
  rotatePdf,
  watermarkPdf,
  ocrPdf,
  pdfToWord,
} from '@/lib/converters/pdf';
import { stat } from 'fs/promises';
import { MAX_FILE_SIZE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const action = (formData.get('action') as string) || 'convert';
    const outputFormat = (formData.get('outputFormat') as string) || 'pdf';

    // Handle multi-file uploads (for merge, image-to-pdf)
    const files = formData.getAll('file') as File[];
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No file(s) provided' },
        { status: 400 }
      );
    }

    // Check file sizes
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE.pdf) {
        return NextResponse.json(
          { success: false, error: 'File too large (max 200MB)' },
          { status: 400 }
        );
      }
    }

    // Save all uploaded files
    const savedFiles = await Promise.all(files.map((f) => saveUploadedFile(f)));
    const inputPaths = savedFiles.map((f) => f.filePath);

    let result: { filePath: string; fileId: string };

    switch (action) {
      case 'merge':
        result = await mergePdfs(inputPaths);
        break;

      case 'split': {
        const pages = (formData.get('pages') as string) || '1';
        result = await splitPdf(inputPaths[0], pages);
        break;
      }

      case 'compress': {
        const quality = (formData.get('quality') as string) || 'ebook';
        result = await compressPdf(inputPaths[0], quality);
        break;
      }

      case 'pdf-to-image':
        result = await pdfToImage(inputPaths[0], outputFormat);
        break;

      case 'image-to-pdf':
        result = await imageToPdf(inputPaths);
        break;

      case 'pdf-to-word':
        result = await pdfToWord(inputPaths[0]);
        break;

      case 'rotate': {
        const degrees = parseInt((formData.get('degrees') as string) || '90', 10);
        result = await rotatePdf(inputPaths[0], degrees);
        break;
      }

      case 'watermark': {
        const text = (formData.get('text') as string) || 'CONFIDENTIAL';
        result = await watermarkPdf(inputPaths[0], text);
        break;
      }

      case 'ocr':
        result = await ocrPdf(inputPaths[0], outputFormat);
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    const outputStat = await stat(result.filePath);
    const outputExt = result.filePath.split('.').pop() || 'pdf';

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
    console.error('PDF conversion error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}
