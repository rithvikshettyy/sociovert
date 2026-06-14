import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SocioVert — Free Self-Hosted File Converter',
  description:
    'Convert files for free. PDF, images, video, audio, documents, and archives. Self-hosted, no tracking, no limits. Your files never leave your server.',
  keywords: [
    'file converter',
    'pdf converter',
    'image converter',
    'video converter',
    'self-hosted',
    'free',
    'open source',
  ],
  openGraph: {
    title: 'SocioVert — Free Self-Hosted File Converter',
    description: 'Convert any file, free forever. Self-hosted with zero tracking.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-background text-text-primary min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
