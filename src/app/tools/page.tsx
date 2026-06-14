import type { Metadata } from 'next';
import Link from 'next/link';
import ToolCard from '@/components/conversion/ToolCard';
import { TOOLS, CATEGORIES, getCategoryInfo } from '@/lib/tools-registry';

interface ToolsPageProps {
  searchParams: {
    category?: string;
  };
}

export async function generateMetadata({ searchParams }: ToolsPageProps): Promise<Metadata> {
  const activeCategory = searchParams.category;
  const categoryInfo = activeCategory ? getCategoryInfo(activeCategory) : null;

  const title = categoryInfo
    ? `${categoryInfo.name} Online - Free & Secure Tools | SocioVert`
    : 'All File Conversion Tools - PDF, Video, Image, Audio | SocioVert';

  const description = categoryInfo
    ? `${categoryInfo.description}. Access professional, self-hosted, secure, and fast tools for ${categoryInfo.name.toLowerCase()} with zero logs.`
    : `Access ${TOOLS.length} free, secure, and self-hosted file conversion tools. Compress, convert, merge, split, and edit files with complete privacy.`;

  const canonicalUrl = activeCategory 
    ? `https://sociovert.com/tools?category=${activeCategory}`
    : 'https://sociovert.com/tools';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'SocioVert',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}


/**
 * Optimized Tools Page.
 * Converted to React Server Component (RSC) to parse filters directly from 
 * URL query parameters. This enables instant load times, SEO indexability, 
 * and eliminates the client-side useSearchParams bailout/Suspense warning.
 */
export default function ToolsPage({ searchParams }: ToolsPageProps) {
  const activeCategory = searchParams.category || 'all';

  const filteredTools = activeCategory === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            All Conversion Tools
          </h1>
          <p className="text-text-secondary text-lg">
            {TOOLS.length} tools across {CATEGORIES.length} categories
          </p>
        </div>

        {/* Category Filter Tabs (Server Navigation) */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/tools"
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeCategory === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-secondary hover:text-text-primary border border-surface-border hover:border-text-muted'
              }
            `}
          >
            All ({TOOLS.length})
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools?category=${cat.slug}`}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  activeCategory === cat.slug
                    ? 'bg-accent text-white'
                    : 'bg-surface text-text-secondary hover:text-text-primary border border-surface-border hover:border-text-muted'
                }
              `}
            >
              {cat.name} ({cat.toolCount})
            </Link>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool, i) => (
            <ToolCard key={`${tool.category}-${tool.slug}`} tool={tool} index={i} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted">No tools found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
