import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center">
            <span className="text-sm font-semibold text-text-secondary">
              Socio<span className="text-accent">Vert</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-text-muted text-center">
            Self-hosted · No tracking · Your files, your server · Zero monthly cost
          </p>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/tools" className="hover:text-text-secondary transition-colors">
              All Tools
            </Link>
            <span className="text-surface-border">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
