'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import DropZone from '@/components/upload/DropZone';
import FormatPicker from '@/components/upload/FormatPicker';
import ProgressBar from '@/components/conversion/ProgressBar';
import DownloadCard from '@/components/conversion/DownloadCard';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useConversion } from '@/hooks/useConversion';
import { getTool, getCategoryInfo, ACTION_ICONS } from '@/lib/tools-registry';
import { ConversionCategory } from '@/types';
import { MAX_FILE_SIZE } from '@/lib/constants';
import Link from 'next/link';

export default function ConversionPage() {
  const params = useParams();
  const category = params.category as string;
  const toolSlug = params.tool as string;

  const tool = getTool(category, toolSlug);
  const categoryInfo = getCategoryInfo(category);

  if (!tool || !categoryInfo) {
    notFound();
  }

  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState('');
  const [inputFormat, setInputFormat] = useState(tool.inputFormats[0] || '');
  const [outputFormat, setOutputFormat] = useState(tool.outputFormats[0] || '');
  const [options, setOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    tool.options?.forEach((opt) => {
      defaults[opt.name] = String(opt.defaultValue);
    });
    return defaults;
  });

  const { status, progress, result, error, startConversion, reset } =
    useConversion(category as ConversionCategory);

  const acceptFormats = useMemo(() => {
    if (tool.inputFormats.includes('*')) return undefined;
    return tool.inputFormats.map((f) => `.${f}`).join(',');
  }, [tool.inputFormats]);

  const handleConvert = () => {
    const isUrlInput = tool.inputFormats.includes('url');
    if (!isUrlInput && files.length === 0) return;
    if (isUrlInput && !url) return;

    const convertOptions: Record<string, string> = {
      action: tool.action,
      outputFormat,
      toolName: tool.name,
      ...options,
    };

    if (isUrlInput) {
      convertOptions.url = url;
    }

    // Map specific tool slugs to API action names
    if (tool.category === 'pdf') {
      switch (tool.slug) {
        case 'merge': convertOptions.action = 'merge'; break;
        case 'split': convertOptions.action = 'split'; break;
        case 'compress': convertOptions.action = 'compress'; break;
        case 'pdf-to-word': convertOptions.action = 'pdf-to-word'; break;
        case 'pdf-to-image': convertOptions.action = 'pdf-to-image'; break;
        case 'image-to-pdf': convertOptions.action = 'image-to-pdf'; break;
        case 'ocr': convertOptions.action = 'ocr'; break;
        case 'rotate': convertOptions.action = 'rotate'; break;
        case 'watermark': convertOptions.action = 'watermark'; break;
      }
    } else if (tool.category === 'image') {
      if (tool.slug === 'exif-purge') {
        convertOptions.action = 'exif-purge';
      }
    } else if (tool.category === 'document') {
      if (tool.slug === 'to-latex') {
        convertOptions.action = 'to-latex';
      } else if (tool.slug === 'ocr-to-md') {
        convertOptions.action = 'ocr-to-md';
      }
    }

    startConversion(isUrlInput ? [] : files, convertOptions);
  };

  const handleReset = () => {
    reset();
    setFiles([]);
    setUrl('');
  };

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected);
    const ext = selected[0]?.name.split('.').pop()?.toLowerCase() || '';
    if (tool.inputFormats.includes(ext)) {
      setInputFormat(ext);
    }
  };

  const iconPath = ACTION_ICONS[tool.icon] || ACTION_ICONS.convert;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-text-muted mb-6"
        >
          <Link href="/tools" className="hover:text-text-secondary transition-colors">
            Tools
          </Link>
          <span>/</span>
          <Link
            href={`/tools?category=${category}`}
            className="hover:text-text-secondary transition-colors"
          >
            {categoryInfo.name}
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{tool.name}</span>
        </motion.div>

        {/* Tool Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${categoryInfo.color}15` }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: categoryInfo.color }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{tool.name}</h1>
              <p className="text-text-secondary">{tool.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Conversion UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {status === 'completed' && result ? (
            <DownloadCard result={result} onReset={handleReset} />
          ) : (
            <>
              {tool.inputFormats.includes('url') ? (
                <div className="card-base p-6 space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                      Media URL
                    </label>
                    <input
                      type="url"
                      placeholder="Paste YouTube, Reels, TikTok, or Shorts link here..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={status === 'uploading' || status === 'processing'}
                      className="w-full bg-background border border-surface-border rounded-xl px-4 py-3.5 text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-muted transition-all"
                    />
                  </div>

                  {/* Tool-specific Options */}
                  {tool.options && tool.options.length > 0 && (
                    <div className="space-y-4 pt-2">
                      {tool.options.map((opt) => (
                        <div key={opt.name}>
                          {opt.type === 'select' && opt.choices && (
                            <Select
                              label={opt.label}
                              options={opt.choices}
                              value={options[opt.name] || String(opt.defaultValue)}
                              onChange={(e) =>
                                setOptions((prev) => ({
                                  ...prev,
                                  [opt.name]: e.target.value,
                                }))
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center pt-2">
                    <Button
                      size="lg"
                      onClick={handleConvert}
                      loading={status === 'uploading' || status === 'processing'}
                      disabled={!url}
                    >
                      Download & Convert
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Upload */}
                  <DropZone
                    onFilesSelected={handleFilesSelected}
                    accept={acceptFormats}
                    multiple={tool.multiFile}
                    maxSize={MAX_FILE_SIZE[tool.category as ConversionCategory]}
                    disabled={status === 'uploading' || status === 'processing'}
                  />

                  {files.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      {/* File List */}
                      <div className="card-base p-4">
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                          Selected {files.length === 1 ? 'file' : 'files'}
                        </p>
                        {files.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-text-secondary py-1"
                          >
                            <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="truncate">{f.name}</span>
                            <span className="text-text-muted text-xs ml-auto">
                              {(f.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Format Picker (if tool has output formats to choose) */}
                      {tool.outputFormats.length > 1 && (
                        <FormatPicker
                          inputFormats={tool.inputFormats.filter(f => f !== '*')}
                          outputFormats={tool.outputFormats}
                          inputFormat={inputFormat}
                          outputFormat={outputFormat}
                          onInputChange={setInputFormat}
                          onOutputChange={setOutputFormat}
                        />
                      )}

                      {/* Tool-specific Options */}
                      {tool.options && tool.options.length > 0 && (
                        <div className="card-base p-4 space-y-4">
                          <p className="text-xs text-text-muted uppercase tracking-wider">
                            Options
                          </p>
                          {tool.options.map((opt) => (
                            <div key={opt.name}>
                              {opt.type === 'select' && opt.choices && (
                                <Select
                                  label={opt.label}
                                  options={opt.choices}
                                  value={options[opt.name] || String(opt.defaultValue)}
                                  onChange={(e) =>
                                    setOptions((prev) => ({
                                      ...prev,
                                      [opt.name]: e.target.value,
                                    }))
                                  }
                                />
                              )}
                              {opt.type === 'range' && (
                                <div>
                                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {opt.label}: {options[opt.name] || opt.defaultValue}
                                  </label>
                                  <input
                                    type="range"
                                    min={opt.min}
                                    max={opt.max}
                                    step={opt.step}
                                    value={options[opt.name] || opt.defaultValue}
                                    onChange={(e) =>
                                      setOptions((prev) => ({
                                        ...prev,
                                        [opt.name]: e.target.value,
                                      }))
                                    }
                                    className="w-full mt-2 accent-accent"
                                  />
                                </div>
                              )}
                              {opt.type === 'text' && (
                                <div>
                                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider block mb-1.5">
                                    {opt.label}
                                  </label>
                                  <input
                                    type="text"
                                    value={options[opt.name] || String(opt.defaultValue)}
                                    onChange={(e) =>
                                      setOptions((prev) => ({
                                        ...prev,
                                        [opt.name]: e.target.value,
                                      }))
                                    }
                                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                  />
                                </div>
                              )}
                              {opt.type === 'number' && (
                                <div>
                                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider block mb-1.5">
                                    {opt.label}
                                  </label>
                                  <input
                                    type="number"
                                    min={opt.min}
                                    max={opt.max}
                                    value={options[opt.name] || opt.defaultValue}
                                    onChange={(e) =>
                                      setOptions((prev) => ({
                                        ...prev,
                                        [opt.name]: e.target.value,
                                      }))
                                    }
                                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Convert Button */}
                      <div className="flex justify-center">
                        <Button
                          size="lg"
                          onClick={handleConvert}
                          loading={status === 'uploading' || status === 'processing'}
                        >
                          {tool.action === 'merge'
                            ? `Merge ${files.length} files`
                            : tool.action === 'compress'
                            ? 'Compress'
                            : tool.action === 'extract'
                            ? 'Extract'
                            : `Convert to ${outputFormat.toUpperCase()}`}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* Progress */}
              {(status === 'uploading' || status === 'processing') && (
                <ProgressBar progress={progress} status={status} />
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card-base border-red-900/50 p-4 text-center"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="mt-2">
                    Try again
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
