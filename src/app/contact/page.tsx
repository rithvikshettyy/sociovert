'use client';

import Link from 'next/link';

const EMAIL = 'rithvikshetty2004@gmail.com';

const reasons = [
  { label: 'Enterprise Inquiry', subject: 'Enterprise Inquiry - AnyFormat', icon: '🏢' },
  { label: 'Bug Report', subject: 'Bug Report - AnyFormat', icon: '🐛' },
  { label: 'Feature Request', subject: 'Feature Request - AnyFormat', icon: '💡' },
  { label: 'General Question', subject: 'General Question - AnyFormat', icon: '💬' },
];

export default function ContactPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get in <span className="text-accent">touch</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Have a question, want to discuss enterprise needs, or just want to say hi? Reach out anytime.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {reasons.map((reason) => (
            <a
              key={reason.label}
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(reason.subject)}`}
              className="card-base p-6 hover:border-accent/50 hover:bg-accent-glow transition-all group"
            >
              <span className="text-2xl mb-3 block">{reason.icon}</span>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
                {reason.label}
              </h3>
              <p className="text-text-muted text-sm">
                Click to send an email
              </p>
            </a>
          ))}
        </div>

        <div className="card-base p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Or email directly</h3>
          <a
            href={`mailto:${EMAIL}`}
            className="text-accent hover:underline text-lg font-mono"
          >
            {EMAIL}
          </a>
          <p className="text-text-muted text-sm mt-3">
            Typically respond within 24 hours.
          </p>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-text-muted text-sm hover:text-text-secondary transition-colors">
            &larr; Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
