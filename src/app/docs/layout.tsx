import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation & API Reference | SocioVert',
  description: 'Explore the user guide, tools reference, developer API routes, and privacy policy for SocioVert. Self-hosted, private-first file conversion.',
  alternates: {
    canonical: 'https://sociovert.com/docs',
  },
  openGraph: {
    title: 'Documentation & API Reference | SocioVert',
    description: 'Explore the user guide, tools reference, developer API routes, and privacy policy for SocioVert. Self-hosted, private-first file conversion.',
    url: 'https://sociovert.com/docs',
    siteName: 'SocioVert',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation & API Reference | SocioVert',
    description: 'Explore the user guide, tools reference, developer API routes, and privacy policy for SocioVert. Self-hosted, private-first file conversion.',
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
