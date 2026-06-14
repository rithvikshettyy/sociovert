import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTool, getCategoryInfo } from '@/lib/tools-registry';
import ToolClientPage from '@/components/conversion/ToolClientPage';

interface RouteProps {
  params: {
    category: string;
    tool: string;
  };
}

// ─── Dynamic SEO Metadata Generation ───
export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const tool = getTool(params.category, params.tool);
  const categoryInfo = getCategoryInfo(params.category);

  if (!tool || !categoryInfo) {
    return {
      title: 'Tool Not Found — SocioVert',
    };
  }

  const title = `${tool.name} Online - Free & Secure ${categoryInfo.name} | SocioVert`;
  const description = `${tool.description}. Convert files safely with SocioVert, the ultimate self-hosted file conversion suite. No limits, zero data tracking.`;
  const canonicalUrl = `https://sociovert.com/tools/${params.category}/${params.tool}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      tool.slug,
      tool.name.toLowerCase(),
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      params.category,
      categoryInfo.name.toLowerCase(),
      'file converter',
      'self-hosted conversion',
      'exif tool',
      'privacy tools',
    ],
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

export default function ConversionPage({ params }: RouteProps) {
  const tool = getTool(params.category, params.tool);
  const categoryInfo = getCategoryInfo(params.category);

  if (!tool || !categoryInfo) {
    notFound();
  }

  return <ToolClientPage />;
}
