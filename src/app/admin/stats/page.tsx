'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface StatsData {
  total: Record<string, number>;
  today: Record<string, number>;
  last7days: Record<string, Record<string, number>>;
}

export default function AdminStatsPage() {
  const [secret, setSecret] = useState('');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stats', {
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setStats(data.data);
      setAuthed(true);
    } catch {
      setError('Failed to fetch stats');
    }
    setLoading(false);
  };

  const formatToolName = (key: string) => {
    if (key === '_all') return 'Total';
    const [category, action] = key.split(':');
    return `${category} → ${action}`;
  };

  const sortedEntries = (obj: Record<string, number>) =>
    Object.entries(obj)
      .filter(([k]) => k !== '_all')
      .sort((a, b) => b[1] - a[1]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-base p-8 w-full max-w-sm space-y-4">
          <h1 className="text-xl font-bold text-text-primary">Admin Stats</h1>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchStats()}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-surface-border text-text-primary text-sm focus:border-accent focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={fetchStats} disabled={loading || !secret} className="w-full">
            {loading ? 'Loading...' : 'View Stats'}
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const totalAll = stats.total['_all'] || 0;
  const todayAll = stats.today['_all'] || 0;
  const days = Object.keys(stats.last7days).sort().reverse();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Usage Stats</h1>
        <Button variant="ghost" size="sm" onClick={() => { setAuthed(false); setStats(null); }}>
          Lock
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-base p-6">
          <p className="text-text-muted text-sm">All Time</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{totalAll.toLocaleString()}</p>
          <p className="text-text-secondary text-xs mt-1">total conversions</p>
        </div>
        <div className="card-base p-6">
          <p className="text-text-muted text-sm">Today</p>
          <p className="text-3xl font-bold text-accent mt-1">{todayAll.toLocaleString()}</p>
          <p className="text-text-secondary text-xs mt-1">conversions today</p>
        </div>
        <div className="card-base p-6">
          <p className="text-text-muted text-sm">Tools Used</p>
          <p className="text-3xl font-bold text-text-primary mt-1">
            {Object.keys(stats.total).filter((k) => k !== '_all').length}
          </p>
          <p className="text-text-secondary text-xs mt-1">unique tools</p>
        </div>
      </div>

      {/* All-Time Breakdown */}
      <div className="card-base p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">All-Time by Tool</h2>
        {sortedEntries(stats.total).length === 0 ? (
          <p className="text-text-muted text-sm">No usage yet</p>
        ) : (
          <div className="space-y-3">
            {sortedEntries(stats.total).map(([key, count]) => {
              const pct = totalAll > 0 ? (count / totalAll) * 100 : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">{formatToolName(key)}</span>
                    <span className="text-text-primary font-medium">{count.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Last 7 Days */}
      <div className="card-base p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Last 7 Days</h2>
        {days.length === 0 ? (
          <p className="text-text-muted text-sm">No daily data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 text-text-muted font-medium">Date</th>
                  <th className="text-right py-2 text-text-muted font-medium">Total</th>
                  <th className="text-left py-2 pl-6 text-text-muted font-medium">Top Tool</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const dayData = stats.last7days[day];
                  const dayTotal = dayData['_all'] || 0;
                  const topTool = sortedEntries(dayData)[0];
                  return (
                    <tr key={day} className="border-b border-surface-border/50">
                      <td className="py-2.5 text-text-secondary">{day}</td>
                      <td className="py-2.5 text-right text-text-primary font-medium">{dayTotal.toLocaleString()}</td>
                      <td className="py-2.5 pl-6 text-text-muted">
                        {topTool ? `${formatToolName(topTool[0])} (${topTool[1]})` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refresh */}
      <div className="flex justify-center">
        <Button variant="secondary" size="sm" onClick={fetchStats}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
