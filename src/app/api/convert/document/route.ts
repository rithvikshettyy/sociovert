import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/file-utils';
import { MAX_FILE_SIZE } from '@/lib/constants';
import { validateTurnstileToken } from '@/lib/turnstile';

const isServerless = process.env.VERCEL === '1';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const turnstileToken = formData.get('turnstileToken') as string;
    const isBotValid = await validateTurnstileToken(turnstileToken);
    if (!isBotValid) {
      return NextResponse.json(
        { success: false, error: 'Bot verification failed' },
        { status: 403 }
      );
    }

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
        { success: false, error: 'File too large (max 50MB)' },
        { status: 400 }
      );
    }

    const { filePath: inputPath } = await saveUploadedFile(file, ['docx', 'xlsx', 'pptx', 'doc', 'xls', 'ppt', 'odt', 'ods', 'odp', 'pdf', 'txt', 'csv', 'tex', 'latex', 'md', 'png', 'jpg', 'jpeg']);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';

    const jobData = {
      category: 'document',
      action,
      filePath: inputPath,
      outputFormat,
      options: { ext },
    };

    if (isServerless) {
      const { processConversion } = await import('@/lib/process-direct');
      const result = await processConversion(jobData);
      return NextResponse.json({ success: true, data: result });
    }

    const { conversionQueue } = await import('@/lib/queue');
    const job = await conversionQueue.add(jobData);
    return NextResponse.json({ success: true, data: { jobId: job.id } });
  } catch (error) {
    console.error('Document conversion error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
