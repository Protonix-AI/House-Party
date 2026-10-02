import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';

export const Countdown: React.FC = () => {
  // Target: Saturday, October 3, 2026 at 9:30 PM Dallas time (CDT is UTC-5 -> 2026-10-04T02:30:00Z)
  const targetDate = new Date('2026-10-04T02:30:00.000Z').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    hasStarted: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    hasStarted: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          hasStarted: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        hasStarted: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="relative py-12 px-4 max-w-5xl mx-auto">
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 relative overflow-hidden text-center">
        {/* Decorative corner light bursts */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-fuchsia-600/15 to-transparent rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-gradient-to-tr from-cyan-600/15 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-pink-400 mb-2">
            <Clock className="w-4 h-4 animate-spin text-pink-400" style={{ animationDuration: '6s' }} />
            <span>THE CLOCK IS TICKING...</span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 mb-8">
            Saturday, October 3, 2026 • 9:30 PM Dallas Local Time
          </p>

          {timeLeft.hasStarted ? (
            <div className="py-8 px-6 rounded-2xl bg-gradient-to-r from-fuchsia-950/60 to-purple-950/60 border border-fuchsia-500/40 shadow-xl max-w-2xl mx-auto animate-pulse">
              <div className="flex items-center justify-center gap-3 text-xl sm:text-4xl font-black text-amber-300 font-display">
                <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 shrink-0" />
                <span>THE PARTY HAS STARTED. GET OVER HERE. 🍻</span>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm mt-3">
                Grab your drinks and head to Apt 1916 right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-6 w-full max-w-3xl">
              {/* Days */}
              <div className="glass-panel rounded-2xl p-2.5 sm:p-6 flex flex-col items-center border border-white/10 hover:border-pink-500/40 transition-colors">
                <span className="font-display text-2xl xs:text-3xl sm:text-6xl font-black text-white tabular-nums tracking-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-0.5 sm:mt-1">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="glass-panel rounded-2xl p-2.5 sm:p-6 flex flex-col items-center border border-white/10 hover:border-fuchsia-500/40 transition-colors">
                <span className="font-display text-2xl xs:text-3xl sm:text-6xl font-black text-fuchsia-300 tabular-nums tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-0.5 sm:mt-1">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="glass-panel rounded-2xl p-2.5 sm:p-6 flex flex-col items-center border border-white/10 hover:border-cyan-500/40 transition-colors">
                <span className="font-display text-2xl xs:text-3xl sm:text-6xl font-black text-cyan-300 tabular-nums tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-0.5 sm:mt-1">
                  Mins
                </span>
              </div>

              {/* Seconds */}
              <div className="glass-panel rounded-2xl p-2.5 sm:p-6 flex flex-col items-center border border-white/10 hover:border-amber-500/40 transition-colors">
                <span className="font-display text-2xl xs:text-3xl sm:text-6xl font-black text-amber-300 tabular-nums tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-0.5 sm:mt-1">
                  Secs
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
