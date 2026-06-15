'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ConversionTool } from '@/types';
import Badge from '@/components/ui/Badge';
import {
  GitMerge,
  Scissors,
  Archive,
  FileText,
  FileImage,
  FileUp,
  ScanText,
  RotateCw,
  Stamp,
  ImageIcon,
  ImageDown,
  Scaling,
  EyeOff,
  Eraser,
  Palette,
  QrCode,
  FileSymlink,
  FileOutput,
  Binary,
  FileCode,
  Hash,
  Video,
  VideoOff,
  AudioLines,
  DownloadCloud,
  Music,
  FolderArchive,
  FolderOpen,
  Globe,
  Link as LinkIcon,
  HelpCircle,
  FileSpreadsheet,
  Presentation,
  Lock
} from 'lucide-react';

interface ToolCardProps {
  tool: ConversionTool;
  index?: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'pdf/merge': GitMerge,
  'pdf/split': Scissors,
  'pdf/compress': Archive,
  'pdf/pdf-to-word': FileText,
  'pdf/pdf-to-image': FileImage,
  'pdf/image-to-pdf': FileUp,
  'pdf/ocr': ScanText,
  'pdf/rotate': RotateCw,
  'pdf/watermark': Stamp,
  'pdf/pdf-to-excel': FileSpreadsheet,
  'pdf/ppt-to-pdf': Presentation,
  'pdf/protect': Lock,
  'image/convert': ImageIcon,
  'image/compress': ImageDown,
  'image/resize': Scaling,
  'image/exif-purge': EyeOff,
  'image/bg-removal': Eraser,
  'image/color-palette': Palette,
  'image/qr-generator': QrCode,
  'document/to-pdf': FileSymlink,
  'document/from-pdf': FileOutput,
  'document/to-latex': Binary,
  'document/ocr-to-md': FileCode,
  'document/word-counter': Hash,
  'video/convert': Video,
  'video/compress': VideoOff,
  'video/extract-audio': AudioLines,
  'video/social-download': DownloadCloud,
  'audio/convert': Music,
  'archive/create': FolderArchive,
  'archive/extract': FolderOpen,
  'utility/seo-generator': Globe,
  'utility/link-shortener': LinkIcon,
};

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const ToolIcon = ICON_MAP[`${tool.category}/${tool.slug}`] || HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link href={`/tools/${tool.category}/${tool.slug}`}>
        <motion.div
          whileHover={{ y: -4, borderColor: 'rgba(224, 61, 47, 0.3)' }}
          transition={{ duration: 0.2 }}
          className="card-base p-5 h-full group cursor-pointer"
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
            <ToolIcon className="w-5 h-5 text-accent" />
          </div>

          {/* Content */}
          <h3 className="text-text-primary font-semibold text-sm mb-1 group-hover:text-accent transition-colors">
            {tool.name}
          </h3>
          <p className="text-text-muted text-xs leading-relaxed mb-3">
            {tool.description}
          </p>

          {/* Format Badges */}
          <div className="flex flex-wrap gap-1">
            {tool.outputFormats.slice(0, 4).map((fmt) => (
              <Badge key={fmt} size="sm">
                {fmt.toUpperCase()}
              </Badge>
            ))}
            {tool.outputFormats.length > 4 && (
              <Badge size="sm">+{tool.outputFormats.length - 4}</Badge>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
