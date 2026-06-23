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

import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://anyformat.in'),
  title: {
    default: 'AnyFormat — Free Online File Converter | PDF, Image, Video, Audio Tools',
    template: '%s | AnyFormat',
  },
  description:
    'Convert files for free — PDF, images, video, audio, documents, and archives. No signup, no watermarks, no file size limits. Privacy-first alternative to ILovePDF, SmallPDF, CloudConvert, and Convertio.',
  keywords: [
    // Core tool keywords
    'file converter',
    'pdf converter',
    'image converter',
    'video converter',
    'audio converter',
    'document converter',
    'archive creator',
    'online ocr',
    'exif purger',
    'social video downloader',
    'latex converter',
    'free converter',
    'privacy first file tool',
    // Conversion pair keywords
    'jpg to png converter',
    'png to jpg converter',
    'pdf to word converter',
    'word to pdf converter',
    'mp4 to mp3 converter',
    'pdf to jpg converter',
    'image to pdf converter',
    'webp to png converter',
    'mp4 to gif converter',
    'convert docx to pdf',
    'heic to jpg converter',
    'svg to png converter',
    'avif to jpg converter',
    'flac to mp3 converter',
    'wav to mp3 converter',
    'mov to mp4 converter',
    'mkv to mp4 converter',
    'pptx to pdf converter',
    'xlsx to pdf converter',
    // Action keywords
    'compress pdf online',
    'compress image online',
    'merge pdf online',
    'split pdf online',
    'ocr pdf to text',
    'remove background online',
    'resize image online',
    'extract audio from video',
    'zip file extractor',
    'compress video online',
    'rotate pdf online',
    'crop image online',
    'upscale image online',
    'trim video online',
    // USP keywords
    'free online file converter',
    'no watermark converter',
    'no signup file converter',
    'private file converter',
    'secure pdf converter',
    'unlimited file converter',
    'batch file converter',
    'self-hosted file converter',
    // Competitor alternative keywords
    'ilovepdf alternative',
    'smallpdf alternative',
    'cloudconvert alternative',
    'convertio alternative',
    'zamzar alternative',
    'pdf2go alternative',
    'sejda alternative',
    'pdf24 alternative',
    'hipdf alternative',
    'sodapdf alternative',
    'freeconvert alternative',
    'online-convert alternative',
    'tinypng alternative',
    'remove.bg alternative',
    'handbrake alternative',
    'adobe acrobat online alternative',
    'canva pdf alternative',
    'pdfcandy alternative',
  ],
  authors: [{ name: 'AnyFormat' }],
  creator: 'AnyFormat',
  publisher: 'AnyFormat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AnyFormat — Free Online File Converter | PDF, Image, Video, Audio Tools',
    description:
      'Convert files for free — PDF, images, video, audio, documents, and archives. No signup, no watermarks, no limits. Privacy-first alternative to ILovePDF, SmallPDF, and CloudConvert.',
    url: '/',
    siteName: 'AnyFormat',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnyFormat — Free Online File Converter',
    description:
      'Convert files for free — PDF, images, video, audio, documents, and archives. No signup, no watermarks, no limits. Privacy-first file converter.',
    creator: '@anyformat',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'jHG7Fl5URrypSSrxEe-PirtreNUxDNNSVvSafgwSVVo',
  },
  other: {
    'application-name': 'AnyFormat',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'AnyFormat',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://anyformat.in',
              description:
                'Free online file converter — PDF, images, video, audio, documents, and archives. No signup, no watermarks, no limits.',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1200',
                bestRating: '5',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AnyFormat',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://anyformat.in',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://anyformat.in'}/icon.png`,
              sameAs: [],
            }),
          }}
        />
      </head>
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
