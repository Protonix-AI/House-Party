import React, { useState } from 'react';
import { MapPin, Navigation, Car, Copy, Check, ExternalLink } from 'lucide-react';

export const Location: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const addressText = '5349 Amesbury Dr, Apt 1916, Dallas, TX 75206';
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=5349+Amesbury+Dr+Apt+1916+Dallas+TX+75206';
  const appleMapsUrl = 'https://maps.apple.com/?q=5349+Amesbury+Dr+Apt+1916+Dallas+TX+75206';

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(addressText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="location" className="relative py-24 px-4 max-w-6xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-400 uppercase">
          Coordinates
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mt-1 mb-3">
          WHERE THE CHAOS IS HAPPENING
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base">
          Save the address or open straight in your maps app before you leave.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Address Details & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between glass-panel rounded-3xl p-8 border border-white/10">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-cyan-400" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Apartment 1916
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white mt-1 mb-2">
              5349 Amesbury Dr, Apt 1916
            </h3>
            <p className="text-lg text-neutral-300 font-medium mb-6">
              Dallas, TX 75206
            </p>

            {/* Address Copy Pill */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6">
              <span className="text-xs text-neutral-300 font-mono truncate mr-2 select-all">
                {addressText}
              </span>
              <button
                onClick={copyAddress}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Arrival & Parking Tips */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm text-neutral-300">
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Rideshare strongly advised:</strong> Uber / Lyft drop-off right at the building front. Zero parking hassle, 100% safe drinking.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Upon Arrival:</strong> Head to Apartment 1916. If the door code is active, text Nirav on WhatsApp/phone or buzz unit 1916.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Map Actions */}
          <div className="pt-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>OPEN IN GOOGLE MAPS</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apple Maps</span>
            </a>
          </div>
        </div>

        {/* Right Side: Stylized Interactive Dark Mode Map Card */}
        <div className="lg:col-span-6 glass-panel rounded-3xl overflow-hidden border border-white/10 relative min-h-[380px] flex flex-col">
          {/* Neon Styled Map Visualization Graphic */}
          <div className="relative flex-1 bg-[#0b0c16] flex items-center justify-center p-8 overflow-hidden">
            {/* Grid street matrix background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #38bdf8 1px, transparent 1px),
                  linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Dallas highway stylized lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M -50 180 Q 200 120 600 240"
                fill="none"
                stroke="#a855f7"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              <path
                d="M 120 -50 Q 220 220 380 500"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="4"
              />
              <path
                d="M 30 350 Q 260 260 550 80"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
              />
            </svg>

            {/* Glowing Map Pin in Center */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 animate-ping absolute" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.8)] border-2 border-white">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 px-4 py-2 rounded-xl bg-neutral-900/90 border border-white/20 text-center backdrop-blur-md shadow-2xl">
                <p className="font-display font-black text-sm text-white">5349 Amesbury Dr #1916</p>
                <p className="text-[11px] font-mono text-cyan-300">Dallas, TX 75206 (Upper Greenville)</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-neutral-900/90 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>Neighborhood: Upper Greenville / Dallas</span>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Satellite / Live Navigation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
