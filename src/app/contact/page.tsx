'use client';

import Link from 'next/link';
import { Building2, Bug, Lightbulb, MessageCircle, Mail, ArrowLeft } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

const EMAIL = 'rithvikshetty2004@gmail.com';

const reasons: { label: string; subject: string; icon: LucideIcon; desc: string }[] = [
  { label: 'Enterprise Inquiry', subject: 'Enterprise Inquiry - AnyFormat', icon: Building2, desc: 'Plans, volume pricing, or custom needs' },
  { label: 'Bug Report', subject: 'Bug Report - AnyFormat', icon: Bug, desc: 'Something broken? Let us know' },
  { label: 'Feature Request', subject: 'Feature Request - AnyFormat', icon: Lightbulb, desc: 'Suggest a new tool or feature' },
  { label: 'General Question', subject: 'General Question - AnyFormat', icon: MessageCircle, desc: 'Anything else on your mind' },
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
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <a
                key={reason.label}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(reason.subject)}`}
                className="card-base p-6 hover:border-accent/50 hover:bg-accent-glow transition-all group"
              >
                <Icon className="w-7 h-7 mb-3 text-text-muted group-hover:text-accent transition-colors" />
                <h3 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
                  {reason.label}
                </h3>
                <p className="text-text-muted text-sm">
                  {reason.desc}
                </p>
              </a>
            );
          })}
        </div>

        <div className="card-base p-8 text-center">
          <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
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
          <Link href="/" className="text-text-muted text-sm hover:text-text-secondary transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
