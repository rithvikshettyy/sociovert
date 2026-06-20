import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - AnyFormat',
  description: 'Get in touch with AnyFormat for enterprise inquiries, bug reports, feature requests, or general questions.',
  openGraph: {
    title: 'Contact Us - AnyFormat',
    description: 'Get in touch with AnyFormat for enterprise inquiries, bug reports, feature requests, or general questions.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
