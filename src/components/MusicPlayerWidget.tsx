import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, ExternalLink, Disc } from 'lucide-react';
import { partyAudio, CURRENT_TRACK } from '../utils/partyAudio';

export const MusicPlayerWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setIsPlaying(partyAudio.getIsPlaying());
    const unsubscribe = partyAudio.subscribe((playing) => {
      setIsPlaying(playing);
      if (playing) {
        setExpanded(true);
      }
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    partyAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    partyAudio.setVolume(val);
  };

  return (
    <div className="fixed bottom-18 md:bottom-6 right-3 md:right-6 z-40 transition-all duration-300">
      {/* Compact / Expanded Card */}
      <div
        className={`glass-panel border border-fuchsia-500/30 rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden ${
          expanded ? 'p-3.5 w-72 sm:w-80 bg-[#0c0a1a]/95' : 'p-2 bg-[#0c0a1a]/80'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Vinyl / Cover Art */}
          <div
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-600 via-purple-700 to-cyan-500 p-0.5 shadow-md flex items-center justify-center shrink-0 ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
            >
              <div className="w-full h-full bg-[#0a0815] rounded-[10px] flex items-center justify-center">
                <Disc className={`w-5 h-5 ${isPlaying ? 'text-fuchsia-400' : 'text-neutral-400'}`} />
              </div>
            </div>

            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xs text-white truncate">
                  {CURRENT_TRACK.title}
                </span>
                {isPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <p className="text-[10px] text-fuchsia-300/80 truncate">
                {CURRENT_TRACK.artist}
              </p>
            </div>
          </div>

          {/* Equalizer Visualizer & Play Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Animated Equalizer Bars */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-4 px-1" aria-hidden="true">
                <span className="w-0.5 bg-fuchsia-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                <span className="w-0.5 bg-pink-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-4" />
                <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
                <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3.5" />
              </div>
            )}

            {/* Play/Pause Button */}
            <button
              onClick={handleToggle}
              aria-label={isPlaying ? 'Pause Silver Lines' : 'Play Silver Lines by ANOTR'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Details & Volume Slider */}
        {expanded && (
          <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2.5 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>{CURRENT_TRACK.label} • {CURRENT_TRACK.bpm} BPM</span>
              <a
                href={CURRENT_TRACK.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <span>Spotify</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-2 text-neutral-400 pt-0.5">
              {volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Music volume"
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
              />
              <span className="font-mono text-[10px] text-neutral-400 w-6 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
