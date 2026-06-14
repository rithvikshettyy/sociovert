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

        setProgress(30);
        setStatus('processing');

        const response = await fetch(`/api/convert/${category}`, {
          method: 'POST',
          body: formData,
        });

        setProgress(80);

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Conversion failed');
        }

        setProgress(100);
        setStatus('completed');
        setResult(data.data);

        // Save to history in localStorage
        try {
          const history = JSON.parse(localStorage.getItem('convertx-history') || '[]');
          history.unshift({
            id: data.data.id,
            toolSlug: options.action || 'convert',
            toolName: options.toolName || `${category.toUpperCase()} Tool`,
            inputFile: files[0]?.name || options.url || 'URL Download',
            outputFile: data.data.fileName,
            inputSize: files[0]?.size || 0,
            outputSize: data.data.fileSize,
            status: 'completed',
            timestamp: Date.now(),
          });
          // Keep last 50 entries
          localStorage.setItem(
            'convertx-history',
            JSON.stringify(history.slice(0, 50))
          );
        } catch {
          // localStorage might be unavailable
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
