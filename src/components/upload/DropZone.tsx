'use client';

import { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
}

export default function DropZone({
  onFilesSelected,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateAndEmit = useCallback(
    (files: File[]) => {
      setError(null);

      if (files.length === 0) return;

      if (maxSize) {
        const oversized = files.find((f) => f.size > maxSize);
        if (oversized) {
          const maxMB = Math.round(maxSize / (1024 * 1024));
          setError(`File "${oversized.name}" exceeds ${maxMB}MB limit`);
          return;
        }
      }

      onFilesSelected(files);
    },
    [onFilesSelected, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      validateAndEmit(multiple ? files : files.slice(0, 1));
    },
    [disabled, multiple, validateAndEmit]
  );

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      validateAndEmit(files);
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [validateAndEmit]
  );

  return (
    <div className="w-full">
      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragOver ? '#e03d2f' : '#2a2a2a',
          backgroundColor: isDragOver
            ? 'rgba(224, 61, 47, 0.05)'
            : 'transparent',
        }}
        className={`
          relative drop-zone rounded-2xl p-12 md:p-16 cursor-pointer
          flex flex-col items-center justify-center gap-4 text-center
          min-h-[220px]
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Upload Icon */}
        <motion.div
          animate={{
            y: isDragOver ? -8 : 0,
            scale: isDragOver ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <svg
            className={`w-12 h-12 ${isDragOver ? 'text-accent' : 'text-text-muted'} transition-colors`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 3 3 0 013.438 3.42A3.75 3.75 0 0118 19.5H6.75z"
            />
          </svg>
        </motion.div>

        <div>
          <p className="text-text-primary font-medium text-base">
            {isDragOver ? 'Drop your file here' : 'Drag & drop your file here'}
          </p>
          <p className="text-text-muted text-sm mt-1">
            or <span className="text-accent hover:underline">browse files</span>
          </p>
        </div>

        {accept && (
          <p className="text-text-muted text-xs">
            Supported: {accept.replace(/\./g, '').toUpperCase().split(',').join(', ')}
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
        />
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-400 text-sm mt-3 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
