import React from 'react';
import { Sparkles, Music, Flame, Laugh, Users, Zap, Radio, Moon } from 'lucide-react';
import partyAtmosphereImg from '../assets/images/party_atmosphere_night_1790955724488.jpg';

export const PartyVibes: React.FC = () => {
  const vibeStatements = [
    {
      icon: Sparkles,
      title: 'Questionable dance moves',
      quote: 'Nobody is judging, mostly because nobody is qualified to judge.',
      color: 'from-pink-500/20 to-rose-500/5',
      border: 'hover:border-pink-500/40',
      iconColor: 'text-pink-400',
    },
    {
      icon: Music,
      title: 'Loud music',
      quote: 'From ANOTR’s "Silver Lines" & CircoLoco deep grooves to late-night bangers. Bass will be felt in your chest.',
      color: 'from-purple-500/20 to-indigo-500/5',
      border: 'hover:border-purple-500/40',
      iconColor: 'text-purple-400',
    },
    {
      icon: Flame,
      title: 'Unnecessary confidence',
      quote: 'Everyone becomes a world-class philosopher and beer pong Olympian after 11 PM.',
      color: 'from-amber-500/20 to-orange-500/5',
      border: 'hover:border-amber-500/40',
      iconColor: 'text-amber-400',
    },
    {
      icon: Zap,
      title: '“Just one drink”',
      quote: 'The biggest lie in human history, repeated with 100% conviction every single weekend.',
      color: 'from-cyan-500/20 to-blue-500/5',
      border: 'hover:border-cyan-500/40',
      iconColor: 'text-cyan-400',
    },
    {
      icon: Radio,
      title: 'Someone fighting for aux',
      quote: 'There will be an impromptu DJ duel by the speaker. Democracy will fall.',
      color: 'from-emerald-500/20 to-teal-500/5',
      border: 'hover:border-emerald-500/40',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Moon,
      title: 'Deep conversations at 2 AM',
      quote: 'Solving life’s mysteries in the kitchen while eating cold pizza with people you just met.',
      color: 'from-indigo-500/20 to-violet-500/5',
      border: 'hover:border-indigo-500/40',
      iconColor: 'text-indigo-400',
    },
    {
      icon: Users,
      title: 'Best friends within 15 minutes',
      quote: 'You will exchange Instagrams and plan a group trip to Cabo you will never take.',
      color: 'from-fuchsia-500/20 to-pink-500/5',
      border: 'hover:border-fuchsia-500/40',
      iconColor: 'text-fuchsia-400',
    },
    {
      icon: Laugh,
      title: 'Stories that stay at the party',
      quote: 'What happens at Apt 1916 stays at Apt 1916. No leaked group chat screenshots.',
      color: 'from-rose-500/20 to-red-500/5',
      border: 'hover:border-rose-500/40',
      iconColor: 'text-rose-400',
    },
  ];

  return (
    <section id="vibes" className="relative py-24 px-4 max-w-6xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-400 uppercase">
          Vibe Check
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mt-1 mb-3">
          EXPECT ABSOLUTELY NOTHING
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base">
          Come with low expectations and leave with iconic stories.
        </p>
      </div>

      {/* Grid of Vibe Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {vibeStatements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`glass-panel bg-gradient-to-b ${item.color} rounded-2xl p-6 flex flex-col justify-between border border-white/10 ${item.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mt-2 pt-3 border-t border-white/5">
                {item.quote}
              </p>
            </div>
          );
        })}
      </div>

      {/* Atmospheric Microcopy Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-12">
        {/* Background Image Scrim */}
        <div className="absolute inset-0 -z-10">
          <img
            src={partyAtmosphereImg}
            alt="Moody nightclub crowd lighting"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070c] via-[#07070c]/85 to-[#07070c]/90" />
        </div>

        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 block">
            Party Etiquette
          </span>
          <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-6">
            &ldquo;Attendance is highly encouraged. Dignity is optional.&rdquo;
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-neutral-300 pt-6 border-t border-white/10">
            <div>
              <p className="font-bold text-white mb-1">Drink Responsibly</p>
              <p className="text-xs text-neutral-400">Dance irresponsibly. Know your limits and hydrate.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">No Pressure</p>
              <p className="text-xs text-neutral-400">Sit on the couch, play games, or own the dance floor.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Leaving Early?</p>
              <p className="text-xs text-neutral-400">If you hear someone say &lsquo;I&apos;m leaving in 10 mins,&rsquo; don&apos;t believe them.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
