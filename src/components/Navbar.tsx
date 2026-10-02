import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  Shirt,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Music,
} from 'lucide-react';
import { partyAudio } from '../utils/partyAudio';

interface NavbarProps {
  onOpenHost: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHost }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setIsPlayingAudio(partyAudio.getIsPlaying());
    const unsubscribe = partyAudio.subscribe((playing) => {
      setIsPlayingAudio(playing);
    });
    return unsubscribe;
  }, []);

  const toggleSound = () => {
    partyAudio.toggle();
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#07070c]/90 backdrop-blur-md border-b border-white/10 shadow-2xl'
            : 'bg-gradient-to-b from-[#07070c]/90 to-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Zone 1: Single Brand Wordmark in display face */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-base sm:text-2xl font-black tracking-tight text-white hover:text-fuchsia-400 transition-colors whitespace-nowrap shrink-0"
          >
            HOUSE PARTY &apos;26
          </a>

          {/* Zone 2: Desktop 4-6 Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
            <button
              onClick={() => scrollTo('details')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => scrollTo('vibes')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              The Vibe
            </button>
            <button
              onClick={() => scrollTo('dress-code')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Dress Code
            </button>
            <button
              onClick={() => scrollTo('location')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Location
            </button>
          </nav>

          {/* Zone 3: Desktop Actions & Mobile Menu Triggers */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Audio Toggle */}
            <button
              onClick={toggleSound}
              aria-label={isPlayingAudio ? 'Pause Silver Lines by ANOTR' : 'Play Silver Lines by ANOTR'}
              title={isPlayingAudio ? 'Playing: ANOTR & Emily Warren - Silver Lines (126 BPM)' : 'Play "Silver Lines" by ANOTR'}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[38px] ${
                isPlayingAudio
                  ? 'bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(217,70,239,0.4)] animate-pulse'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                  <span>SILVER LINES: PLAYING</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>PLAY SILVER LINES</span>
                </>
              )}
            </button>

            {/* Desktop RSVP CTA Button */}
            <button
              onClick={() => scrollTo('rsvp')}
              className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 rounded-full shadow-lg shadow-pink-600/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              RSVP NOW
            </button>

            {/* Desktop Host Admin Trigger */}
            <button
              onClick={onOpenHost}
              aria-label="Host Portal"
              title="Host guest list & setup"
              className="hidden sm:flex p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Mobile Quick RSVP Pill (fits with balanced proportions) */}
            <button
              onClick={() => scrollTo('rsvp')}
              className="sm:hidden h-8 px-3 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold text-[11px] flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              <span>RSVP</span>
            </button>

            {/* Mobile Sound Toggle (Sleek circular 32px button) */}
            <button
              onClick={toggleSound}
              aria-label={isPlayingAudio ? 'Mute party beat' : 'Play party beat'}
              className={`sm:hidden w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                isPlayingAudio
                  ? 'bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.4)]'
                  : 'bg-white/10 text-neutral-400 border border-white/10'
              }`}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-fuchsia-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {/* Mobile Menu Trigger (Sleek, perfectly proportioned pill button) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open party navigation menu"
              className="md:hidden h-8 px-2.5 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/15 flex items-center gap-1.5 text-[11px] font-bold text-white transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
            >
              <Menu className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
              <span className="uppercase tracking-wider">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* FULL MOBILE NAVIGATION DROPDOWN / DRAWER (ALL OPTIONS VISIBLE) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-up Container with all options */}
          <div className="relative w-full max-h-[90vh] bg-[#0c0d18] border-t border-white/15 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom duration-300">
            {/* Grab handle indicator */}
            <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mt-3 mb-1" />

            {/* Menu Header */}
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-black text-white uppercase tracking-wider">
                  PARTY NAVIGATION
                </h3>
                <p className="text-[11px] text-fuchsia-400 font-medium">
                  Saturday, Oct 3, 2026 • 9:30 PM CDT
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable List of All Options */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {/* Option 1: Top / Hero */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[48px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">Party Overview</p>
                    <p className="text-[10px] text-neutral-400">Headlines, host info & countdown</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              {/* Option 2: Event Details */}
              <button
                onClick={() => scrollTo('details')}
                className="w-full min-h-[48px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">The Important Stuff</p>
                    <p className="text-[10px] text-neutral-400">When, Where & BYOB guide</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              {/* Option 3: Dress Code */}
              <button
                onClick={() => scrollTo('dress-code')}
                className="w-full min-h-[48px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">What Do I Wear?</p>
                    <p className="text-[10px] text-neutral-400">No theme · Black is 37% cooler</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              {/* Option 4: The Party Vibe */}
              <button
                onClick={() => scrollTo('vibes')}
                className="w-full min-h-[48px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">The Party Vibe</p>
                    <p className="text-[10px] text-neutral-400">Expect Absolutely Nothing</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              {/* Option 5: RSVP Form (Highlighted) */}
              <button
                onClick={() => scrollTo('rsvp')}
                className="w-full min-h-[48px] p-3 rounded-2xl bg-gradient-to-r from-fuchsia-950/70 to-pink-950/70 border border-fuchsia-500/40 flex items-center justify-between text-left transition-colors cursor-pointer group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-fuchsia-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-black text-white">RSVP Section</p>
                    <p className="text-[10px] text-fuchsia-200">Confirm your attendance & guests</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/30 text-fuchsia-200">
                  Required
                </span>
              </button>

              {/* Option 6: Location & Directions */}
              <button
                onClick={() => scrollTo('location')}
                className="w-full min-h-[48px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">Where the Chaos Is</p>
                    <p className="text-[10px] text-neutral-400">5349 Amesbury Dr #1916, Dallas</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>

              {/* Option 7: Audio Beat / Music Toggle */}
              <button
                onClick={toggleSound}
                className="w-full min-h-[48px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isPlayingAudio
                        ? 'bg-fuchsia-600 text-white animate-pulse'
                        : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">Silver Lines — ANOTR</p>
                    <p className="text-[10px] text-neutral-400">
                      {isPlayingAudio ? 'Playing CircoLoco Records (126 BPM)' : 'Tap to play Silver Lines'}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isPlayingAudio
                      ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {isPlayingAudio ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Option 8: Host Portal (Nirav Patel) */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenHost();
                }}
                className="w-full min-h-[48px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">Host Portal & Google Sheets</p>
                    <p className="text-[10px] text-neutral-400">Guest roster, CSV export, live sync</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Quick Sticky Action Bar at Bottom of Dropdown */}
            <div className="p-3.5 bg-black/60 border-t border-white/10 space-y-2 pb-6">
              <button
                onClick={() => scrollTo('rsvp')}
                className="w-full h-11 px-4 rounded-full font-display font-black text-xs sm:text-sm text-white bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM YOUR RSVP NOW</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openGoogleMaps();
                }}
                className="w-full h-9 px-3 rounded-full font-bold text-[11px] text-neutral-200 bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FLOATING BOTTOM THUMB BAR (Ergonomic 1-tap navigation for mobile users) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0c0d18]/95 backdrop-blur-lg border-t border-white/10 px-3 py-1.5 flex items-center justify-around shadow-2xl pb-safe">
        <button
          onClick={() => scrollTo('details')}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 hover:text-white cursor-pointer min-w-[48px] h-11"
        >
          <Calendar className="w-4 h-4 text-fuchsia-400" />
          <span className="text-[10px] font-semibold mt-0.5">Details</span>
        </button>

        <button
          onClick={() => scrollTo('location')}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 hover:text-white cursor-pointer min-w-[48px] h-11"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-semibold mt-0.5">Map</span>
        </button>

        {/* Center Primary RSVP Thumb Button */}
        <button
          onClick={() => scrollTo('rsvp')}
          className="flex items-center gap-1.5 px-4 h-9 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black text-xs shadow-lg shadow-pink-600/30 active:scale-95 transition-transform cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>RSVP</span>
        </button>

        <button
          onClick={toggleSound}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 hover:text-white cursor-pointer min-w-[48px] h-11"
        >
          {isPlayingAudio ? (
            <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-400" />
          )}
          <span className="text-[10px] font-semibold mt-0.5">
            {isPlayingAudio ? 'Playing' : 'Sound'}
          </span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 hover:text-white cursor-pointer min-w-[48px] h-11"
        >
          <Menu className="w-4 h-4 text-fuchsia-400" />
          <span className="text-[10px] font-semibold mt-0.5">Menu</span>
        </button>
      </div>
    </>
  );
};
