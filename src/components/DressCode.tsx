import React, { useState } from 'react';
import { Shirt, Sparkles, Check, Zap } from 'lucide-react';
import partyBlackOutfitImg from '../assets/images/party_black_outfit_1790955745687.jpg';

export const DressCode: React.FC = () => {
  const [wearingBlack, setWearingBlack] = useState(true);

  return (
    <section id="dress-code" className="relative py-20 px-4 max-w-6xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs sm:text-sm font-bold tracking-widest text-pink-400 uppercase">
          Style Directive
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mt-1 mb-3">
          WHAT DO I WEAR?
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base">
          Zero dress code anxiety allowed. Wear what feels good.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Editorial breakdown & interactive coolness meter */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Shirt className="w-4 h-4" />
              <span>Official Rule</span>
            </div>

            <h3 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-2">
              NO THEME.
            </h3>
            <p className="text-neutral-300 text-lg font-medium italic mb-6">
              &ldquo;Seriously. There is no theme.&rdquo;
            </p>

            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-700/60 mb-6">
              <h4 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <span>BUT BLACK IS ALWAYS A GOOD IDEA.</span>
                <span className="text-xl">🖤</span>
              </h4>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Black isn&apos;t required. It just makes you look like you had a plan.
              </p>
            </div>

            {/* Interactive Outfit Coolness Sim */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Test Outfit Algorithm
                </span>
                <span className="text-xs font-bold text-fuchsia-400">
                  {wearingBlack ? '+37% Coolness Active' : 'Baseline Coolness (100%)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWearingBlack(true)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    wearingBlack
                      ? 'bg-neutral-950 text-white border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] ring-1 ring-fuchsia-500'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  <Check className={`w-4 h-4 ${wearingBlack ? 'text-fuchsia-400' : 'opacity-0'}`} />
                  <span>Wearing All Black</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWearingBlack(false)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    !wearingBlack
                      ? 'bg-neutral-800 text-white border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  <Check className={`w-4 h-4 ${!wearingBlack ? 'text-cyan-400' : 'opacity-0'}`} />
                  <span>Anything Else</span>
                </button>
              </div>

              {/* Dynamic status pill */}
              <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 text-xs sm:text-sm">
                <Zap className={`w-4 h-4 shrink-0 ${wearingBlack ? 'text-fuchsia-400' : 'text-cyan-400'}`} />
                <span className="text-neutral-300">
                  {wearingBlack
                    ? 'Result: Instant nightlife aesthetic unlocked. You blend seamlessly into the bassline.'
                    : 'Result: Completely fine too! Just don’t wear a suit or a wedding tuxedo.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Lookbook Asset */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10">
            <img
              src={partyBlackOutfitImg}
              alt="Editorial all black party streetwear look"
              referrerPolicy="no-referrer"
              className="w-full h-[440px] sm:h-[500px] object-cover object-center filter grayscale-[30%] contrast-110 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 mb-2">
                <Sparkles className="w-3 h-3 text-fuchsia-400" />
                <span>The Unofficial Uniform</span>
              </div>
              <p className="text-sm font-semibold text-neutral-200">
                Leather, denim, hoodies, tees, sneakers. Comfortable enough to dance, sharp enough for polaroids.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
