'use client';

import { motion } from 'framer-motion';
import { ConversionStatus } from '@/types';
import { formatFileSize } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface ProgressBarProps {
  progress: number;
  status: ConversionStatus;
  error?: string | null;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: number;
  outputFormat?: string;
  expiresAt?: number;
  onReset?: () => void;
}

export default function ProgressBar({
  progress,
  status,
  error,
  downloadUrl,
  fileName,
  fileSize,
  outputFormat,
  expiresAt,
  onReset,
}: ProgressBarProps) {
  if (status === 'idle') return null;

  // Determine status label text below the bar
  let statusText = '';
  if (status === 'uploading') {
    statusText = 'Queued';
  } else if (status === 'processing') {
    if (progress >= 85) {
      statusText = 'Almost done';
    } else {
      statusText = 'Processing';
    }
  } else if (status === 'completed') {
    statusText = 'Complete';
  } else if (status === 'error') {
    statusText = 'Failed';
  }

  const minutesLeft = expiresAt
    ? Math.max(0, Math.round((expiresAt - Date.now()) / 60000))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="card-base p-6 space-y-5">
        {/* Header/Info */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">
            {status === 'completed'
              ? 'Conversion Complete'
              : status === 'error'
              ? 'Conversion Failed'
              : 'Converting File'}
          </span>
          <span className="text-sm font-mono text-text-muted">{Math.round(progress)}%</span>
        </div>

        {/* Smooth Track & Bar */}
        <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-surface-border">
          <motion.div
            className={`h-full rounded-full ${
              status === 'error'
                ? 'bg-red-500'
                : status === 'completed'
                ? 'bg-emerald-500'
                : 'bg-accent'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              width: { type: 'spring', stiffness: 80, damping: 15, mass: 0.8 },
            }}
          />
        </div>

        {/* Status text below the bar */}
        <div className="text-center">
          <span
            className={`text-sm font-medium ${
              status === 'error'
                ? 'text-red-400'
                : status === 'completed'
                ? 'text-emerald-400'
                : 'text-text-secondary'
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* File Details (shown on completion if metadata is provided) */}
        {status === 'completed' && fileName && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-background rounded-lg border border-surface-border"
          >
            <div className="flex items-center gap-3 text-left">
              <svg
                className="w-8 h-8 text-text-muted flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <div className="truncate max-w-[220px]">
                <p className="text-sm text-text-primary font-medium truncate">
                  {fileName}
                </p>
                {fileSize && (
                  <p className="text-xs text-text-muted">
                    {formatFileSize(fileSize)}
                  </p>
                )}
              </div>
            </div>
            {outputFormat && (
              <span className="flex-shrink-0">
                <Badge variant="accent" size="md">
                  {outputFormat.toUpperCase()}
                </Badge>
              </span>
            )}
          </motion.div>
        )}

        {/* Actions on completion */}
        {status === 'completed' && downloadUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row gap-3 pt-1"
          >
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                window.open(downloadUrl, '_blank');
              }}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Download
            </Button>
            {onReset && (
              <Button variant="secondary" size="lg" onClick={onReset}>
                Convert another
              </Button>
            )}
          </motion.div>
        )}

        {/* Error message on failure */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg text-center">
              <p className="text-red-400 text-sm">{error || 'An error occurred during conversion'}</p>
            </div>
            {onReset && (
              <Button size="lg" className="w-full" onClick={onReset}>
                Try Again
              </Button>
            )}
          </motion.div>
        )}

        {/* Expiry Warning */}
        {status === 'completed' && expiresAt && (
          <p className="text-xs text-text-muted text-center">
            ⏱ File will be auto-deleted in ~{minutesLeft} minutes
          </p>
        )}
      </div>
    </motion.div>
  );
}
