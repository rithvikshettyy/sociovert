'use client';

import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useHistory } from '@/hooks/useHistory';
import { formatFileSize } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const { entries, clearHistory } = useHistory();

  // Auth loading state
  if (authStatus === 'loading') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="relative">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base p-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-hover border border-surface-border flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Sign in required</h1>
            <p className="text-text-secondary mb-6">
              Sign in with your Google account to view your conversion history
            </p>
            <Button size="lg" onClick={() => signIn('google')}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated — show dashboard
  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-text-secondary">
              Your recent conversion history
            </p>
          </div>
          {entries.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              Clear history
            </Button>
          )}
        </motion.div>

        {/* History Table */}
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-base p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-hover border border-surface-border flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1">No conversions yet</h3>
            <p className="text-text-muted text-sm mb-4">
              Your conversion history will appear here after you convert a file
            </p>
            <Button variant="secondary" size="sm" onClick={() => window.location.href = '/tools'}>
              Browse tools
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="card-base overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                      Tool
                    </th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                      Input
                    </th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                      Output
                    </th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                      Size
                    </th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-surface-border last:border-b-0 hover:bg-surface-hover/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-text-muted whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-primary font-medium">
                        {entry.toolName}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-secondary max-w-[200px] truncate">
                        {entry.inputFile}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-secondary">
                        {entry.outputFile}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-muted whitespace-nowrap">
                        {formatFileSize(entry.outputSize)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={
                            entry.status === 'completed'
                              ? 'success'
                              : entry.status === 'error'
                              ? 'error'
                              : 'warning'
                          }
                        >
                          {entry.status}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
