'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { HistoryEntry } from '@/types';

const STORAGE_KEY = 'convertx-history';

export function useHistory() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const isLoggedIn = !!session?.user?.email;

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/history')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setEntries(data.data || []);
        })
        .catch(() => {});
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setEntries(JSON.parse(stored));
      } catch {}
    }
  }, [isLoggedIn]);

  const addEntry = useCallback((entry: HistoryEntry) => {
    setEntries((prev) => {
      const updated = [entry, ...prev].slice(0, 50);
      if (!isLoggedIn) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

    if (isLoggedIn) {
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {});
    }
  }, [isLoggedIn]);

  const clearHistory = useCallback(() => {
    setEntries([]);
    if (isLoggedIn) {
      fetch('/api/history', { method: 'DELETE' }).catch(() => {});
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [isLoggedIn]);

  return { entries, addEntry, clearHistory };
}
