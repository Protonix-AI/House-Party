import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, Plus, Minus, Calendar, Sparkles, FileSpreadsheet } from 'lucide-react';
import { getAccessToken, appendRsvpToSheet } from '../utils/googleSheets';
import { apiClient } from '../utils/apiClient';

interface RsvpResponseData {
  id: string;
  name: string;
  phone: string;
  status: 'YES' | 'MAYBE' | 'NO';
  additionalGuestsCount: number;
  additionalGuestNames: string[];
  notes?: string;
  submittedAtFormatted: string;
}

export const RSVPForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'YES' | 'MAYBE' | 'NO'>('YES');
  const [additionalGuestsCount, setAdditionalGuestsCount] = useState<number>(0);
  const [additionalGuestNames, setAdditionalGuestNames] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<RsvpResponseData | null>(null);

  const handleGuestCountChange = (newCount: number) => {
    const validCount = Math.max(0, Math.min(newCount, 6));
    setAdditionalGuestsCount(validCount);

    setAdditionalGuestNames((prev) => {
      const updated = [...prev];
      if (validCount > prev.length) {
        while (updated.length < validCount) {
          updated.push('');
        }
      } else {
        return updated.slice(0, validCount);
      }
      return updated;
    });
  };

  const handleGuestNameChange = (index: number, val: string) => {
    setAdditionalGuestNames((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#a855f7', '#06b6d4', '#f59e0b', '#ffffff'],
      });
    } catch {
      // Ignore if canvas not supported
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMsg('Please enter a valid phone number so we can reach you.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.submitRsvp({
        name: name.trim(),
        phone: phone.trim(),
        status,
        additionalGuestsCount,
        additionalGuestNames: additionalGuestNames.map((g) => g.trim()).filter(Boolean),
        notes: notes.trim(),
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to submit RSVP. Please try again.');
      }

      // If Google Sheet is connected and token is active, append directly in real-time
      try {
        const sheetJson = await apiClient.getConnectedSheet();
        if (sheetJson.connectedSheet?.spreadsheetId) {
          const token = await getAccessToken();
          if (token) {
            await appendRsvpToSheet(sheetJson.connectedSheet.spreadsheetId, data.entry, token);
          }
        }
      } catch (sheetSyncErr) {
        console.warn('Real-time sheet append warning (non-fatal):', sheetSyncErr);
      }

      setSubmittedData(data.entry);
      if (status === 'YES') {
        fireConfetti();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error submitting RSVP.');
    } finally {
      setLoading(false);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent('House Party 2026 - Nirav Patel');
    const details = encodeURIComponent(
      'House Party 2026! BYOB (Bring Your Own Booze). No dress code (black is 37% cooler). Hosted by Nirav Patel.'
    );
    const location = encodeURIComponent('5349 Amesbury Dr, Apt 1916, Dallas, TX 75206');
    // October 3, 2026 at 9:30 PM CDT (America/Chicago UTC-5) -> 20261004T023000Z to 20261004T080000Z
    const dates = '20261004T023000Z/20261004T090000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Download .ics Calendar File
  const downloadIcsFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//House Party 2026//Nirav Patel//EN',
      'BEGIN:VEVENT',
      'SUMMARY:House Party 2026 - Nirav Patel',
      'DESCRIPTION:House Party 2026! BYOB. No dress code (black looks 37% cooler). Hosted by Nirav Patel at Apt 1916.',
      'LOCATION:5349 Amesbury Dr\\, Apt 1916\\, Dallas\\, TX 75206',
      'DTSTART:20261004T023000Z',
      'DTEND:20261004T090000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'house-party-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="rsvp" className="relative py-24 px-4 max-w-4xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs sm:text-sm font-bold tracking-widest text-pink-400 uppercase">
          Guest Roster
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mt-1 mb-3">
          ARE YOU COMING OR WHAT?
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base">
          Let Nirav know so we can ensure there&apos;s enough ice and cups for the squad.
        </p>
      </div>

      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-fuchsia-500/30">
        {submittedData ? (
          /* Confirmation Display */
          <div className="text-center py-6">
            {submittedData.status === 'YES' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-black text-white">
                  YOU&apos;RE ON THE LIST. 🎉
                </h3>
                <p className="text-neutral-300 text-base sm:text-lg italic max-w-md mx-auto">
                  &ldquo;Excellent decision. See you Saturday.&rdquo;
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-left text-xs sm:text-sm text-neutral-300 space-y-1.5 my-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Guest:</span>
                    <span className="font-bold text-white">{submittedData.name}</span>
                  </div>
                  {submittedData.additionalGuestsCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">+ Plus Ones:</span>
                      <span className="text-fuchsia-300 font-semibold">
                        +{submittedData.additionalGuestsCount}{' '}
                        {submittedData.additionalGuestNames.length > 0 &&
                          `(${submittedData.additionalGuestNames.join(', ')})`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Recorded:</span>
                    <span>{submittedData.submittedAtFormatted}</span>
                  </div>
                </div>

                {/* Calendar Add CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Add to Google Calendar</span>
                  </a>
                  <button
                    onClick={downloadIcsFile}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Download Apple / Outlook .ics</span>
                  </button>
                </div>
              </div>
            )}

            {submittedData.status === 'MAYBE' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-display text-3xl font-black text-white">
                  WE&apos;RE SAVING YOU A SPOT... 👀
                </h3>
                <p className="text-neutral-300 text-base sm:text-lg italic max-w-md mx-auto">
                  &ldquo;Don&apos;t consult that calendar for too long. Bad decisions are waiting for you.&rdquo;
                </p>
              </div>
            )}

            {submittedData.status === 'NO' && (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-rose-300">
                  We&apos;ll pretend we didn&apos;t see that. 😭
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto">
                  If your schedule clears or you regain your sense of adventure, you know where to find us.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setSubmittedData(null);
                setName('');
                setPhone('');
                setAdditionalGuestsCount(0);
                setAdditionalGuestNames([]);
                setNotes('');
              }}
              className="mt-8 text-xs font-semibold text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Submit another response or change RSVP
            </button>
          </div>
        ) : (
          /* Actual RSVP Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Attendance Choice */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2.5">
                Are you coming? <span className="text-pink-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStatus('YES')}
                  className={`min-h-[48px] py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                    status === 'YES'
                      ? 'bg-fuchsia-600/30 border-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] ring-1 ring-fuchsia-400'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  YES — Obviously 🎉
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('MAYBE')}
                  className={`min-h-[48px] py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                    status === 'MAYBE'
                      ? 'bg-amber-500/30 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  MAYBE — Check calendar 🤔
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('NO')}
                  className={`min-h-[48px] py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                    status === 'NO'
                      ? 'bg-rose-600/30 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-1 ring-rose-400'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  NO — Betrayed party 😭
                </button>
              </div>
            </div>

            {/* Name & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="full-name"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
                >
                  Full Name <span className="text-pink-500">*</span>
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl glass-input text-white text-base placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label
                  htmlFor="phone-number"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
                >
                  Phone Number <span className="text-pink-500">*</span>
                </label>
                <input
                  id="phone-number"
                  type="tel"
                  required
                  placeholder="(214) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl glass-input text-white text-base placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Additional Guests counter (only relevant if YES or MAYBE) */}
            {status !== 'NO' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                      Additional Guests (+Plus Ones)
                    </label>
                    <p className="text-neutral-400 text-xs mt-0.5">
                      Bringing friends? Specify how many are joining you.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange(additionalGuestsCount - 1)}
                      disabled={additionalGuestsCount <= 0}
                      className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer"
                      aria-label="Decrease additional guests count"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xl font-bold text-fuchsia-300 w-7 text-center tabular-nums">
                      {additionalGuestsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange(additionalGuestsCount + 1)}
                      disabled={additionalGuestsCount >= 6}
                      className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer"
                      aria-label="Increase additional guests count"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dynamically shown guest name inputs */}
                {additionalGuestsCount > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
                    {Array.from({ length: additionalGuestsCount }).map((_, i) => (
                      <div key={i}>
                        <label
                          htmlFor={`guest-name-${i}`}
                          className="block text-[11px] font-semibold text-neutral-400 mb-1"
                        >
                          Guest {i + 1} Name
                        </label>
                        <input
                          id={`guest-name-${i}`}
                          type="text"
                          placeholder={`Friend ${i + 1} Full Name`}
                          value={additionalGuestNames[i] || ''}
                          onChange={(e) => handleGuestNameChange(i, e.target.value)}
                          className="w-full px-3.5 py-3 rounded-lg glass-input text-white text-base placeholder:text-neutral-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Optional Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
              >
                Anything we should know? <span className="text-neutral-500">(Optional)</span>
              </label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Song requests, what booze you're bringing, ETA, or excuses..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl glass-input text-white text-base placeholder:text-neutral-500 resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[52px] py-4 px-6 rounded-full font-display text-base font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 shadow-[0_0_25px_rgba(217,70,239,0.35)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Locking you in...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>CONFIRM MY RSVP</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
