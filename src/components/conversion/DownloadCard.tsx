'use client';

import { motion } from 'framer-motion';
import { ConversionResult } from '@/types';
import { formatFileSize } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface DownloadCardProps {
  result: ConversionResult;
  onReset: () => void;
}

export default function DownloadCard({ result, onReset }: DownloadCardProps) {
  const minutesLeft = Math.max(
    0,
    Math.round((result.expiresAt - Date.now()) / 60000)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="card-base p-6 space-y-4">
        {/* Success Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-800/50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-text-primary font-medium">Conversion complete</p>
            <p className="text-text-muted text-sm">
              Your file is ready for download
            </p>
          </div>
        </div>

        {/* File Info */}
        <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-surface-border">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-text-muted"
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
            <div>
              <p className="text-sm text-text-primary font-medium">
                {result.fileName}
              </p>
              <p className="text-xs text-text-muted">
                {formatFileSize(result.fileSize)}
              </p>
            </div>
          </div>
          <Badge variant="accent" size="md">
            {result.outputFormat.toUpperCase()}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              window.open(result.downloadUrl, '_blank');
            }}
          >
            <svg
              className="w-4 h-4"
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
          <Button variant="secondary" size="lg" onClick={onReset}>
            Convert another
          </Button>
        </div>

        {/* Expiry Warning */}
        <p className="text-xs text-text-muted text-center">
          ⏱ File will be auto-deleted in ~{minutesLeft} minutes
        </p>
      </div>
    </motion.div>
  );
}
