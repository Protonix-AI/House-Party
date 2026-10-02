import React from 'react';
import { Calendar, MapPin, Wine, ArrowUpRight } from 'lucide-react';
import partyDiscoBarImg from '../assets/images/party_disco_bar_1790955735439.jpg';

export const PartyDetails: React.FC = () => {
  const openMaps = () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=5349+Amesbury+Dr+Apt+1916+Dallas+TX+75206',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section id="details" className="relative py-20 px-4 max-w-6xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs sm:text-sm font-bold tracking-widest text-fuchsia-400 uppercase">
          Key Intel
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mt-1 mb-3">
          THE IMPORTANT STUFF
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base">
          Read once, remember forever, or screenshot it for your group chat right now.
        </p>
      </div>

      {/* 3 Core Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: WHEN */}
        <div className="glass-panel rounded-3xl p-7 flex flex-col justify-between hover:border-fuchsia-500/40 transition-all duration-300 group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div className="text-xs font-semibold tracking-wider text-fuchsia-300 uppercase mb-1">
              Timing
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              WHEN
            </h3>
            <p className="text-lg font-bold text-white mb-1">
              Saturday, October 3, 2026
            </p>
            <p className="text-fuchsia-400 font-mono font-semibold text-base mb-4">
              9:30 PM &rarr; Until further notice
            </p>
          </div>
          <div className="pt-4 border-t border-white/5">
            <p className="text-neutral-300 text-sm italic">
              &ldquo;Official end time: whenever the vibes run out.&rdquo;
            </p>
          </div>
        </div>

        {/* Card 2: WHERE */}
        <div className="glass-panel rounded-3xl p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-xs font-semibold tracking-wider text-cyan-300 uppercase mb-1">
              Location
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              WHERE
            </h3>
            <p className="text-lg font-bold text-white mb-1">
              5349 Amesbury Dr, Apt 1916
            </p>
            <p className="text-neutral-300 text-sm mb-4">
              Dallas, TX 75206
            </p>
          </div>
          <div className="pt-4 border-t border-white/5">
            <button
              onClick={openMaps}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
            >
              <span>GET DIRECTIONS</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 3: WHAT TO BRING */}
        <div className="glass-panel rounded-3xl p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wine className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-xs font-semibold tracking-wider text-amber-300 uppercase mb-1">
              Fuel
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              WHAT TO BRING
            </h3>
            <p className="text-lg font-bold text-white mb-2">
              Yourself. Your friends. And your booze.
            </p>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
              BYOB. Bring whatever you like to drink and whatever helps you become the version of yourself who actually dances.
            </p>
          </div>
          <div className="pt-4 border-t border-white/5">
            <p className="text-amber-300/90 text-xs italic font-medium">
              &ldquo;Bring your own booze. We&apos;re hosts, not a liquor store. 🍻&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Visual Accent Banner */}
      <div className="glass-panel rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-white/10">
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-2">
            The BYOB Golden Rule
          </span>
          <h4 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
            &ldquo;The drinks are happier when everyone contributes.&rdquo;
          </h4>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
            We will have plenty of ice, cups, mixers, sound, and good hospitality ready for you. Just bring your favorite spirits, seltzers, beers, or mocktails.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-400">
            <span>Ice provided</span>
            <span aria-hidden="true">·</span>
            <span>Mixers & cups ready</span>
            <span aria-hidden="true">·</span>
            <span>Chilled fridge space available</span>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-[280px]">
          <img
            src={partyDiscoBarImg}
            alt="Atmospheric disco ball and party drinks on dark bar counter"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#12121c] via-transparent to-transparent opacity-70" />
        </div>
      </div>
    </section>
  );
};
