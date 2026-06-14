'use client';

import { motion } from 'framer-motion';
import { ConversionStatus } from '@/types';

interface ProgressBarProps {
  progress: number;
  status: ConversionStatus;
}

const statusLabels: Record<ConversionStatus, string> = {
  idle: '',
  uploading: 'Uploading...',
  processing: 'Converting...',
  completed: 'Done!',
  error: 'Failed',
};

export default function ProgressBar({ progress, status }: ProgressBarProps) {
  if (status === 'idle') return null;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Status Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">{statusLabels[status]}</span>
        <span className="text-sm font-mono text-text-muted">{Math.round(progress)}%</span>
      </div>

      {/* Track */}
      <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-surface-border">
        <motion.div
          className={`h-full rounded-full ${
            status === 'error'
              ? 'bg-red-500'
              : status === 'completed'
              ? 'bg-emerald-500'
              : 'bg-accent'
          }`}
          initial={{ width: 0 }}
          animate={{
            width: `${progress}%`,
            boxShadow:
              status === 'processing'
                ? [
                    '0 0 10px rgba(224, 61, 47, 0.3)',
                    '0 0 20px rgba(224, 61, 47, 0.5)',
                    '0 0 10px rgba(224, 61, 47, 0.3)',
                  ]
                : 'none',
          }}
          transition={{
            width: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        />
      </div>
    </div>
  );
}
