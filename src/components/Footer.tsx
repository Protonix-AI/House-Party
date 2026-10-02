import React from 'react';
import { ArrowUp, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenHost: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHost }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#050508] pt-16 pb-28 md:pb-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Brand Headline */}
        <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2">
          HOUSE PARTY 2026
        </h2>

        {/* Host & Location */}
        <p className="text-sm font-semibold text-fuchsia-400 mb-6">
          Hosted by Nirav Patel • Dallas, Texas
        </p>

        {/* Humorous line */}
        <p className="max-w-md text-xs sm:text-sm text-neutral-400 italic mb-10 px-4">
          &ldquo;Thanks for RSVP&apos;ing. Now don&apos;t be the person who says they&apos;re &lsquo;five minutes away&rsquo; while still at home.&rdquo;
        </p>

        {/* Navigation & Utilities */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-neutral-400 mb-10">
          <button
            onClick={() => {
              const el = document.getElementById('details');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Event Details
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('rsvp');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            RSVP Form
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('location');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Location & Directions
          </button>
          <button
            onClick={onOpenHost}
            className="hover:text-fuchsia-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Host Portal (Nirav)</span>
          </button>
          <button
            onClick={scrollToTop}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to top</span>
          </button>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 border-t border-white/5 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-3">
          <span>5349 Amesbury Dr, Apt 1916 • Dallas, TX 75206</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for the legendary night
          </span>
        </div>
      </div>
    </footer>
  );
};
