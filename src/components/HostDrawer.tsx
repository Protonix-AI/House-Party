import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  Key,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  LogOut,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  googleSignIn,
  logout,
  initAuth,
  getAccessToken,
  createPartySpreadsheet,
  syncAllRsvpsToSheet,
} from '../utils/googleSheets';
import { User } from 'firebase/auth';

interface RsvpItem {
  id: string;
  timestamp: string;
  name: string;
  phone?: string;
  status: 'YES' | 'MAYBE' | 'NO';
  additionalGuestsCount: number;
  additionalGuestNames?: string[];
  notes?: string;
  submittedAtFormatted: string;
}

interface HostStats {
  totalResponses: number;
  yesCount: number;
  maybeCount: number;
  noCount: number;
  totalGuestsAttending: number;
}

interface HostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostDrawer: React.FC<HostDrawerProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [stats, setStats] = useState<HostStats | null>(null);
  const [rsvps, setRsvps] = useState<RsvpItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'sheets'>('sheets');

  // Google OAuth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Connected Sheet state
  const [connectedSheet, setConnectedSheet] = useState<{
    spreadsheetId: string;
    spreadsheetUrl: string;
    accountEmail?: string;
    connectedAt: string;
  } | null>(null);

  // Sync state & Confirmation Dialog
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'sync' | 'disconnect' | null>(null);

  // Apps Script fallback helper
  const [sheetsConfig, setSheetsConfig] = useState<{
    configured: boolean;
    sampleScript: string;
    webhookUrlMasked: string | null;
  } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Initialize Auth state
  useEffect(() => {
    initAuth(
      (user) => {
        setGoogleUser(user);
      },
      () => {
        setGoogleUser(null);
      }
    );
  }, []);

  const fetchRsvps = async (currentPin: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rsvps?pin=${encodeURIComponent(currentPin)}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRsvps(data.rsvps);
        if (data.isHost) {
          setIsUnlocked(true);
          setPinError(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSheetsStatus = async () => {
    try {
      const [configRes, sheetRes] = await Promise.all([
        fetch('/api/google-sheets-config'),
        fetch('/api/connected-sheet'),
      ]);
      const configData = await configRes.json();
      const sheetData = await sheetRes.json();
      setSheetsConfig(configData);
      if (sheetData.connectedSheet) {
        setConnectedSheet(sheetData.connectedSheet);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRsvps(pin);
      fetchSheetsStatus();
    }
  }, [isOpen]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '1916') {
      setIsUnlocked(true);
      setPinError(false);
      fetchRsvps(pin.trim());
    } else {
      setPinError(true);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setGoogleError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
      }
    } catch (err: any) {
      setGoogleError(err.message || 'Failed to authenticate with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setGoogleUser(null);
  };

  // 1-Click Create & Connect Party Spreadsheet
  const handleCreateAndConnectSheet = async () => {
    setGoogleLoading(true);
    setGoogleError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Please sign in with Google first.');
      }

      // Create spreadsheet via Google Sheets API
      const newSheet = await createPartySpreadsheet(token);

      // Save connection on backend
      const res = await fetch('/api/connected-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: newSheet.spreadsheetId,
          spreadsheetUrl: newSheet.spreadsheetUrl,
          accountEmail: googleUser?.email || '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConnectedSheet(data.connectedSheet);
        // Automatically sync initial RSVPs
        if (rsvps.length > 0) {
          await syncAllRsvpsToSheet(newSheet.spreadsheetId, rsvps, token);
          setSyncSuccessMsg(`Connected! Synced ${rsvps.length} current RSVPs to your new Google Sheet.`);
        } else {
          setSyncSuccessMsg('Connected! Your party spreadsheet is ready in Google Drive.');
        }
      }
    } catch (err: any) {
      setGoogleError(err.message || 'Failed to create Google Sheet.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // User Confirmation Dialog execution for mutating Google Sheets (Mandatory Workspace requirement)
  const confirmAction = async () => {
    setShowConfirmModal(false);
    if (pendingAction === 'sync') {
      await executeSync();
    } else if (pendingAction === 'disconnect') {
      await executeDisconnect();
    }
    setPendingAction(null);
  };

  const executeSync = async () => {
    if (!connectedSheet) return;
    setSyncLoading(true);
    setGoogleError(null);
    setSyncSuccessMsg(null);
    try {
      let token = await getAccessToken();
      if (!token) {
        const signin = await googleSignIn();
        token = signin?.accessToken || null;
      }
      if (!token) throw new Error('Google authorization token expired. Please sign in again.');

      await syncAllRsvpsToSheet(connectedSheet.spreadsheetId, rsvps, token);
      setSyncSuccessMsg(`Successfully synced ${rsvps.length} RSVPs to your Google Sheet!`);
    } catch (err: any) {
      setGoogleError(err.message || 'Failed to sync to Google Sheet.');
    } finally {
      setSyncLoading(false);
    }
  };

  const executeDisconnect = async () => {
    try {
      await fetch('/api/connected-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disconnect: true }),
      });
      setConnectedSheet(null);
      setSyncSuccessMsg('Google Sheet disconnected.');
    } catch (err: any) {
      setGoogleError(err.message);
    }
  };

  const copyScriptToClipboard = async () => {
    if (!sheetsConfig?.sampleScript) return;
    try {
      await navigator.clipboard.writeText(sheetsConfig.sampleScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[#0c0d18] border-l border-white/10 h-full flex flex-col shadow-2xl z-10 text-white overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Host Command Center</h2>
              <p className="text-xs text-neutral-400">Nirav Patel • House Party 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 px-6 bg-black/20">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3.5 px-4 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sheets'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Google Sheets Sync</span>
            {connectedSheet && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`py-3.5 px-4 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'roster'
                ? 'border-fuchsia-500 text-fuchsia-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Guest Roster ({rsvps.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              {/* Primary Google Sheets Connection Card */}
              <div className="p-6 rounded-3xl bg-neutral-900/90 border border-emerald-500/30 shadow-xl space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">
                        Google Sheets Live Sync
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Automatically record RSVPs in your personal Google Drive spreadsheet
                      </p>
                    </div>
                  </div>

                  {connectedSheet && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>

                {googleError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs">
                    {googleError}
                  </div>
                )}

                {syncSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{syncSuccessMsg}</span>
                  </div>
                )}

                {/* Authentication Zone */}
                {!googleUser ? (
                  <div className="pt-2">
                    <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
                      Connect your Google Account to automatically generate and link the party spreadsheet with Google Sheets API:
                    </p>

                    {/* Official Sign in with Google Button */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={googleLoading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>{googleLoading ? 'Connecting...' : 'Sign in with Google'}</span>
                    </button>
                  </div>
                ) : (
                  /* Signed In State */
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs uppercase">
                          {googleUser.email?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-white">{googleUser.displayName || 'Google User'}</p>
                          <p className="text-neutral-400 text-[11px]">{googleUser.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleGoogleLogout}
                        className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>

                    {/* Connected Sheet Information */}
                    {connectedSheet ? (
                      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-300">
                            Linked Spreadsheet:
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            ID: {connectedSheet.spreadsheetId.slice(0, 12)}...
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                          <a
                            href={connectedSheet.spreadsheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Google Sheet</span>
                          </a>

                          <button
                            onClick={() => {
                              setPendingAction('sync');
                              setShowConfirmModal(true);
                            }}
                            disabled={syncLoading}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                            <span>Sync All RSVPs Now</span>
                          </button>

                          <button
                            onClick={() => {
                              setPendingAction('disconnect');
                              setShowConfirmModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                          >
                            <span>Disconnect</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Prompt to create party sheet */
                      <div className="pt-2">
                        <button
                          onClick={handleCreateAndConnectSheet}
                          disabled={googleLoading}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-200" />
                          <span>
                            {googleLoading
                              ? 'Creating Spreadsheet...'
                              : 'Create & Connect &ldquo;House Party 2026&rdquo; Sheet'}
                          </span>
                        </button>
                        <p className="text-[11px] text-neutral-400 mt-2">
                          Creates a pre-formatted spreadsheet in your Google Drive and syncs all current RSVPs automatically.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Alternative: Apps Script Webhook Guide */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Alternative: Google Apps Script Webhook
                  </span>
                  <button
                    onClick={copyScriptToClipboard}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition-colors cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-cyan-400" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  If you prefer a headless webhook rather than OAuth sign-in, you can paste this script into any Google Sheet (Extensions &gt; Apps Script) and deploy as a Web App:
                </p>
                <pre className="p-3 rounded-lg bg-black/60 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-36 border border-white/5">
                  {sheetsConfig?.sampleScript}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'roster' && (
            <>
              {/* Quick Stat Tiles */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase">Headcount</p>
                    <p className="font-display text-2xl font-black text-amber-300 mt-0.5">
                      {stats.totalGuestsAttending}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase">YES</p>
                    <p className="font-display text-2xl font-black text-emerald-300 mt-0.5">
                      {stats.yesCount}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-[11px] font-bold text-amber-400 uppercase">MAYBE</p>
                    <p className="font-display text-2xl font-black text-amber-300 mt-0.5">
                      {stats.maybeCount}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
                    <p className="text-[11px] font-bold text-rose-400 uppercase">NO</p>
                    <p className="font-display text-2xl font-black text-rose-300 mt-0.5">
                      {stats.noCount}
                    </p>
                  </div>
                </div>
              )}

              {/* Host PIN Gate for Phone Numbers */}
              {!isUnlocked && (
                <form
                  onSubmit={handlePinSubmit}
                  className="p-4 rounded-2xl bg-neutral-900 border border-neutral-700 flex flex-col sm:flex-row items-center gap-3"
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-300 flex-1">
                    <Key className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>
                      Enter Host PIN (Apt Number: <strong>1916</strong>) to reveal contact details & CSV export:
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-20 px-3 py-1.5 rounded-lg bg-black/50 border border-white/20 text-center font-mono text-sm"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-xs font-bold cursor-pointer"
                    >
                      Unlock
                    </button>
                  </div>
                </form>
              )}

              {pinError && (
                <p className="text-xs text-rose-400">Incorrect PIN. Try 1916 (Apt 1916).</p>
              )}

              {/* Actions row */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => fetchRsvps(pin)}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh list</span>
                </button>

                <a
                  href="/api/export-csv"
                  download="house-party-2026-rsvps.csv"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download CSV</span>
                </a>
              </div>

              {/* RSVPs Table / Cards */}
              <div className="space-y-3">
                {rsvps.length === 0 ? (
                  <p className="text-xs text-neutral-500 text-center py-8">
                    No RSVPs submitted yet. Share the party link to start rolling in!
                  </p>
                ) : (
                  rsvps.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{entry.name}</span>
                          {entry.additionalGuestsCount > 0 && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold">
                              +{entry.additionalGuestsCount} guest{entry.additionalGuestsCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            entry.status === 'YES'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : entry.status === 'MAYBE'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {entry.status}
                        </span>
                      </div>

                      {/* Contact & Extra Details */}
                      <div className="text-xs text-neutral-400 flex flex-wrap gap-x-4 gap-y-1">
                        {isUnlocked && entry.phone && (
                          <span>
                            Phone: <strong className="text-neutral-200">{entry.phone}</strong>
                          </span>
                        )}
                        <span>Time: {entry.submittedAtFormatted}</span>
                      </div>

                      {entry.additionalGuestNames && entry.additionalGuestNames.length > 0 && (
                        <p className="text-xs text-neutral-300">
                          Plus ones: <span className="text-neutral-400">{entry.additionalGuestNames.join(', ')}</span>
                        </p>
                      )}

                      {entry.notes && (
                        <p className="text-xs text-amber-300/80 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 italic">
                          &ldquo;{entry.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Workspace API operations (Mandatory Workspace Requirement) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-white/20 space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display text-lg font-bold text-white">Confirm Google Sheets Action</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300">
              {pendingAction === 'sync'
                ? `Update your Google Sheet by appending the latest ${rsvps.length} RSVP submissions?`
                : 'Disconnect the current Google Sheet from automatic party sync?'}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
