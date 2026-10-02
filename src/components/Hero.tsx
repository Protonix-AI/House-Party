import React from 'react';
import { ArrowRight, MapPin, Calendar, Sparkles } from 'lucide-react';
import { ThreeDPartyScene } from './ThreeDPartyScene';

export const Hero: React.FC = () => {
  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openGoogleMaps = () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=5349+Amesbury+Dr+Apt+1916+Dallas+TX+75206',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* 3D Interactive Disco Ball Canvas Background */}
      <ThreeDPartyScene />

      {/* Optimized ambient radial glows (no expensive full-screen blur re-rasterization) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] ambient-glow rounded-full pointer-events-none -z-10" />

      {/* Floating interactive emojis */}
      <div
        className="hidden md:flex absolute top-32 left-[12%] animate-bounce text-3xl select-none filter drop-shadow-[0_0_12px_rgba(236,72,153,0.5)] duration-1000"
        aria-hidden="true"
      >
        🪩
      </div>
      <div
        className="hidden md:flex absolute top-40 right-[14%] animate-pulse text-3xl select-none filter drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]"
        aria-hidden="true"
      >
        🍻
      </div>
      <div
        className="hidden lg:flex absolute bottom-36 left-[8%] animate-bounce text-2xl select-none filter drop-shadow-[0_0_12px_rgba(168,85,247,0.5)] delay-300"
        aria-hidden="true"
      >
        🎉
      </div>
      <div
        className="hidden lg:flex absolute bottom-32 right-[10%] animate-pulse text-3xl select-none filter drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] delay-500"
        aria-hidden="true"
      >
        🕺
      </div>
      <div
        className="hidden md:flex absolute top-1/2 right-[5%] animate-bounce text-2xl select-none filter drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]"
        aria-hidden="true"
      >
        🔥
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Host announcement kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-fuchsia-300 mb-6 backdrop-blur-md shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Hosted by Nirav Patel</span>
          <span className="text-white/40">·</span>
          <span className="text-neutral-300">Dallas, TX</span>
        </div>

        {/* Massive Headline */}
        <h1 className="font-display text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[1.08] sm:leading-[1] mb-5 sm:mb-6 px-1">
          <span className="block drop-shadow-lg">HOUSE PARTY.</span>
          <span className="block bg-gradient-to-r from-fuchsia-500 via-pink-400 to-amber-300 bg-clip-text text-transparent neon-glow-pink">
            BAD DECISIONS.
          </span>
          <span className="block text-white/95 drop-shadow-md">
            GREAT MEMORIES.
          </span>
        </h1>

        {/* Date and Time Line */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-base md:text-lg font-bold text-neutral-200 mb-4 sm:mb-5">
          <span className="flex items-center gap-1.5 text-white">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            Saturday
          </span>
          <span className="text-white/30" aria-hidden="true">•</span>
          <span className="text-fuchsia-300">October 3, 2026</span>
          <span className="text-white/30" aria-hidden="true">•</span>
          <span className="text-amber-300 font-mono">9:30 PM CDT</span>
        </div>

        {/* Humorous punchline */}
        <p className="max-w-xl text-neutral-300 text-xs sm:text-base md:text-lg italic font-normal leading-relaxed mb-6 sm:mb-8 px-2">
          &ldquo;Come for one drink. Stay until someone asks, &lsquo;Wait... what time is it?&rsquo;&rdquo;
        </p>

        {/* Two Prominent CTAs (Optimized for full width on mobile with >=48px touch targets) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-4">
          <button
            onClick={scrollToRsvp}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>RSVP NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={openGoogleMaps}
            className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 text-sm sm:text-base font-bold text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 rounded-full backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>GET DIRECTIONS</span>
          </button>
        </div>

        {/* BYOB preview snippet */}
        <div className="mt-10 flex items-center gap-2 text-xs sm:text-sm text-neutral-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>BYOB 🍻 · No formal dress code · Bring good energy</span>
        </div>
      </div>
    </section>
  );
};
