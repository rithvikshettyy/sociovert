'use client';

import Select from '@/components/ui/Select';
import { FORMAT_LABELS } from '@/lib/constants';

interface FormatPickerProps {
  inputFormats: string[];
  outputFormats: string[];
  inputFormat: string;
  outputFormat: string;
  onInputChange: (format: string) => void;
  onOutputChange: (format: string) => void;
  inputLabel?: string;
  outputLabel?: string;
}

export default function FormatPicker({
  inputFormats,
  outputFormats,
  inputFormat,
  outputFormat,
  onInputChange,
  onOutputChange,
  inputLabel = 'From',
  outputLabel = 'To',
}: FormatPickerProps) {
  const inputOptions = inputFormats.map((f) => ({
    value: f,
    label: FORMAT_LABELS[f] || f.toUpperCase(),
  }));

  const outputOptions = outputFormats.map((f) => ({
    value: f,
    label: FORMAT_LABELS[f] || f.toUpperCase(),
  }));

  return (
    <div className="flex items-end gap-3 md:gap-4 w-full max-w-lg mx-auto">
      {/* Input Format */}
      <div className="flex-1">
        <Select
          label={inputLabel}
          options={inputOptions}
          value={inputFormat}
          onChange={(e) => onInputChange(e.target.value)}
        />
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center pb-2.5">
        <div className="relative flex items-center">
          <div className="w-8 md:w-12 h-[2px] bg-surface-border" />
          <svg
            className="w-5 h-5 text-accent -ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>

      {/* Output Format */}
      <div className="flex-1">
        <Select
          label={outputLabel}
          options={outputOptions}
          value={outputFormat}
          onChange={(e) => onOutputChange(e.target.value)}
        />
      </div>
    </div>
  );
}
