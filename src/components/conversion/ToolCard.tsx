'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ConversionTool } from '@/types';
import { ACTION_ICONS } from '@/lib/tools-registry';
import Badge from '@/components/ui/Badge';

interface ToolCardProps {
  tool: ConversionTool;
  index?: number;
}

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const iconPath = ACTION_ICONS[tool.icon] || ACTION_ICONS.convert;

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
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={iconPath}
              />
            </svg>
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
