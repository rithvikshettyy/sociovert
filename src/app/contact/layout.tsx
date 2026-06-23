import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site-config';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Contact Us - AnyFormat',
  description:
    'Get in touch with AnyFormat for enterprise inquiries, bug reports, feature requests, or general questions. Fast support for the best free file converter.',
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us - AnyFormat',
    description:
      'Get in touch with AnyFormat for enterprise inquiries, bug reports, feature requests, or general questions.',
    url: `${siteUrl}/contact`,
    siteName: 'AnyFormat',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us - AnyFormat',
    description:
      'Get in touch with AnyFormat for enterprise inquiries, bug reports, feature requests, or general questions.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
