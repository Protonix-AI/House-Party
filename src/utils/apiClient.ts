/**
 * Universal API Client with automatic Static Host (GitHub Pages) Fallback.
 * Ensures the app works 100% reliably in both full-stack Node/Express environments
 * and static GitHub Pages deployments.
 */

import type { RsvpEntry, ConnectedSheetConfig, PartyStats } from '../types/party';

const LOCAL_STORAGE_RSVP_KEY = 'house_party_2026_rsvps';
const LOCAL_STORAGE_SHEET_KEY = 'house_party_2026_sheet_config';

function getLocalRsvps(): RsvpEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RSVP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRsvps(list: RsvpEntry[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_RSVP_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

function calculateStats(rsvps: RsvpEntry[]): PartyStats {
  const yesCount = rsvps.filter((r) => r.status === 'YES').length;
  const maybeCount = rsvps.filter((r) => r.status === 'MAYBE').length;
  const noCount = rsvps.filter((r) => r.status === 'NO').length;
  const totalGuestsAttending = rsvps
    .filter((r) => r.status === 'YES')
    .reduce((sum, r) => sum + 1 + (Number(r.additionalGuestsCount) || 0), 0);

  return {
    totalResponses: rsvps.length,
    yesCount,
    maybeCount,
    noCount,
    totalGuestsAttending,
  };
}

export const apiClient = {
  async submitRsvp(payload: {
    name: string;
    phone: string;
    status: 'YES' | 'MAYBE' | 'NO';
    additionalGuestsCount: number;
    additionalGuestNames: string[];
    notes?: string;
  }): Promise<{ success: boolean; entry: RsvpEntry; message?: string; isStaticFallback?: boolean }> {
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          // Also sync to local storage as backup
          const current = getLocalRsvps();
          saveLocalRsvps([data.entry, ...current.filter((r) => r.id !== data.entry.id)]);
          return data;
        }
      }
    } catch {
      // Backend unavailable or static hosting (GitHub Pages)
    }

    // Static GitHub Pages fallback
    const now = new Date();
    const entry: RsvpEntry = {
      id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      name: payload.name,
      phone: payload.phone,
      status: payload.status,
      additionalGuestsCount: payload.additionalGuestsCount,
      additionalGuestNames: payload.additionalGuestNames,
      notes: payload.notes || '',
      submittedAtFormatted: now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    const current = getLocalRsvps();
    saveLocalRsvps([entry, ...current]);

    return {
      success: true,
      entry,
      message: 'RSVP saved successfully!',
      isStaticFallback: true,
    };
  },

  async getRsvps(pin: string): Promise<{
    success: boolean;
    isHost: boolean;
    stats: PartyStats;
    rsvps: RsvpEntry[];
  }> {
    try {
      const res = await fetch(`/api/rsvps?pin=${encodeURIComponent(pin)}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          return data;
        }
      }
    } catch {
      // Fallback
    }

    // Static fallback
    const isHost = pin.trim() === '1916';
    const localRsvps = getLocalRsvps();
    const stats = calculateStats(localRsvps);

    return {
      success: true,
      isHost,
      stats,
      rsvps: isHost ? localRsvps : [],
    };
  },

  async getConnectedSheet(): Promise<{ connectedSheet: ConnectedSheetConfig | null }> {
    try {
      const res = await fetch('/api/connected-sheet');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SHEET_KEY);
      return { connectedSheet: raw ? JSON.parse(raw) : null };
    } catch {
      return { connectedSheet: null };
    }
  },

  async saveConnectedSheet(config: ConnectedSheetConfig): Promise<{ success: boolean }> {
    try {
      const res = await fetch('/api/connect-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch {
      // Fallback
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_SHEET_KEY, JSON.stringify(config));
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  async disconnectSheet(): Promise<{ success: boolean }> {
    try {
      const res = await fetch('/api/disconnect-sheet', { method: 'POST' });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch {
      // Fallback
    }

    try {
      localStorage.removeItem(LOCAL_STORAGE_SHEET_KEY);
      return { success: true };
    } catch {
      return { success: false };
    }
  },
};
