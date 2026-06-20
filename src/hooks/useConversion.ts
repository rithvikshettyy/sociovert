'use client';

import { useState, useCallback } from 'react';
import { ConversionCategory, ConversionResult, ConversionStatus } from '@/types';

interface UseConversionReturn {
  status: ConversionStatus;
  progress: number;
  result: ConversionResult | null;
  error: string | null;
  startConversion: (
    files: File[],
    options: Record<string, string>
  ) => Promise<void>;
  reset: () => void;
}

export function useConversion(category: ConversionCategory): UseConversionReturn {
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startConversion = useCallback(
    async (files: File[], options: Record<string, string>) => {
      setStatus('uploading');
      setProgress(10);
      setError(null);
      setResult(null);

      try {
        const formData = new FormData();

        // Add files
        files.forEach((file) => {
          formData.append('file', file);
        });

        // Add all options
        Object.entries(options).forEach(([key, value]) => {
          formData.append(key, value);
        });

        setProgress(20);

        // Upload and get Job ID immediately
        const response = await fetch(`/api/convert/${category}`, {
          method: 'POST',
          body: formData,
        });

        const uploadData = await response.json();

        if (!uploadData.success) {
          throw new Error(uploadData.error || 'Upload failed');
        }

        // Direct result (serverless) or job-based (VPS)
        let jobResult: ConversionResult | null = null;

        if (uploadData.data.jobId) {
          // Queue mode: poll for result
          const jobId = uploadData.data.jobId;
          setStatus('processing');
          setProgress(30);

          let isFinished = false;
          while (!isFinished) {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const jobResponse = await fetch(`/api/job/${jobId}`);
            const jobData = await jobResponse.json();

            if (!jobData.success) {
              throw new Error(jobData.error || 'Failed to fetch job status');
            }

            const { status: jobStatus, progress: jobProgress, result: returnedResult, error: jobError } = jobData.data;

            if (jobStatus === 'completed') {
              isFinished = true;
              jobResult = returnedResult;
              setProgress(100);
              setStatus('completed');
              setResult(returnedResult);
            } else if (jobStatus === 'failed') {
              isFinished = true;
              throw new Error(jobError || 'Job execution failed in worker');
            } else if (jobStatus === 'active') {
              const scaledProgress = 30 + Math.floor((jobProgress || 0) * 0.65);
              setProgress(Math.min(scaledProgress, 95));
            } else if (jobStatus === 'waiting') {
              setProgress(25);
            }
          }
        } else {
          // Direct mode: result returned immediately
          jobResult = uploadData.data as ConversionResult;
          setProgress(100);
          setStatus('completed');
          setResult(jobResult);
        }

        if (jobResult) {
          const entry = {
            id: jobResult.id || 'unknown',
            toolSlug: options.action || 'convert',
            toolName: options.toolName || `${category.toUpperCase()} Tool`,
            inputFile: files[0]?.name || options.url || 'URL Download',
            outputFile: jobResult.fileName || 'converted',
            inputSize: files[0]?.size || 0,
            outputSize: jobResult.fileSize || 0,
            status: 'completed' as const,
            timestamp: Date.now(),
          };
          fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
          }).catch(() => {});
          try {
            const history = JSON.parse(localStorage.getItem('convertx-history') || '[]');
            history.unshift(entry);
            localStorage.setItem('convertx-history', JSON.stringify(history.slice(0, 50)));
          } catch {}
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProgress(0);
      }
    },
    [category]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return { status, progress, result, error, startConversion, reset };
}
