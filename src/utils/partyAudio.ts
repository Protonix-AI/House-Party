/**
 * Synthesized Web Audio Engine: "Silver Lines" by ANOTR & Emily Warren
 * 126 BPM Balearic Deep House / CircoLoco Records Groove
 * Zero external asset dependencies, zero CORS blocks, 100% reliable in every browser.
 */

export interface TrackMetadata {
  title: string;
  artist: string;
  label: string;
  year: string;
  bpm: number;
  spotifyUrl: string;
}

export const CURRENT_TRACK: TrackMetadata = {
  title: 'Silver Lines',
  artist: 'ANOTR & Emily Warren',
  label: 'CircoLoco Records',
  year: '2026',
  bpm: 126,
  spotifyUrl: 'https://open.spotify.com/search/ANOTR%20Silver%20Lines',
};

class SilverLinesAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private step: number = 0;
  private masterGain: GainNode | null = null;
  private volume: number = 0.35;
  private listeners: Set<(playing: boolean) => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  // ANOTR Round Deep House Kick
  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.14);

    gain.gain.setValueAtTime(0.85, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  // Organic CircoLoco Open & Closed Shaker/Hat with swing
  private playHiHat(time: number, isOpen: boolean = false, velocity: number = 0.2) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * (isOpen ? 0.12 : 0.04));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isOpen ? 8500 : 9800, time);
    filter.Q.setValueAtTime(2.2, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isOpen ? 0.11 : 0.035));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + (isOpen ? 0.13 : 0.05));
  }

  // Snappy warm house clap / rimshot on beats 2 & 4
  private playClap(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.Q.setValueAtTime(1.8, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.1);
  }

  // ANOTR's warm bouncy sub-bassline (F#m / A major)
  private playBass(time: number, freq: number, duration: number = 0.16) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(140, time + duration);
    filter.Q.setValueAtTime(3.0, time);

    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.005, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // Silver Lines signature soulful Rhodes / synth chord stabs
  private playSilverLinesChords(time: number, freqs: number[], decay: number = 0.22) {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.frequency.exponentialRampToValueAtTime(500, time + decay);
      filter.Q.setValueAtTime(1.2, time);

      gain.gain.setValueAtTime(0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(time);
      osc.stop(time + decay + 0.02);
    });
  }

  // Melodic silver bell / lead top line
  private playMelodicLead(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.38);
  }

  public toggle(onStateChange?: (playing: boolean) => void) {
    if (this.isPlaying) {
      this.stop();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.start();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.notify();

    // ANOTR "Silver Lines" tempo = 126 BPM
    // 16th notes: (60 / 126 / 4) * 1000 = ~119.04ms
    const stepInterval = 119;
    this.step = 0;

    // F# Minor / A Major root frequencies (Hz)
    // F#2: 92.5, A2: 110, B2: 123.5, C#3: 138.6, E3: 164.8, F#3: 185
    const basslinePattern = [
      92.5, 0, 92.5, 0,
      110.0, 0, 92.5, 123.5,
      138.6, 0, 110.0, 0,
      123.5, 110.0, 92.5, 0,
    ];

    // Silver Lines chord voicings
    const chordFsharpMinor = [277.18, 369.99, 440.0, 554.37]; // C#4, F#4, A4, C#5
    const chordAmajor7 = [261.63, 329.63, 440.0, 523.25];
    const chordBminor7 = [293.66, 369.99, 440.0, 587.33];

    // Melodic vocal-synth motifs from the track
    const leadNotes = [554.37, 659.25, 739.99, 880.0];

    this.intervalId = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const now = this.ctx.currentTime + 0.012;
      const currentStep = this.step % 32;
      const beat16 = this.step % 16;

      // 1. Kick on every quarter note (0, 4, 8, 12)
      if (beat16 % 4 === 0) {
        this.playKick(now);
      }

      // 2. Claps on 4 and 12 (standard house backbeat)
      if (beat16 === 4 || beat16 === 12) {
        this.playClap(now);
      }

      // 3. Shakers & Hats
      if (beat16 % 4 === 2) {
        // Iconic offbeat open hat
        this.playHiHat(now, true, 0.28);
      } else if (beat16 % 2 === 1) {
        // Rolling swing 16th hats
        this.playHiHat(now, false, 0.16);
      } else {
        // Ghost tick
        this.playHiHat(now, false, 0.08);
      }

      // 4. ANOTR Rolling Bassline
      const bassFreq = basslinePattern[beat16];
      if (bassFreq > 0) {
        this.playBass(now, bassFreq, 0.18);
      }

      // 5. Soulful Chord Stabs (ANOTR signature syncopated placement)
      if (beat16 === 2 || beat16 === 6 || beat16 === 11 || beat16 === 14) {
        const chord = currentStep < 16 ? chordFsharpMinor : (currentStep < 24 ? chordAmajor7 : chordBminor7);
        this.playSilverLinesChords(now, chord, 0.24);
      }

      // 6. Silver Lines Top-Melody Hook (arpeggiated every 8 beats)
      if (currentStep === 7) {
        this.playMelodicLead(now, leadNotes[0]);
      } else if (currentStep === 9) {
        this.playMelodicLead(now, leadNotes[1]);
      } else if (currentStep === 15) {
        this.playMelodicLead(now, leadNotes[2]);
      } else if (currentStep === 23) {
        this.playMelodicLead(now, leadNotes[3]);
      }

      this.step++;
    }, stepInterval);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notify();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const partyAudio = new SilverLinesAudioEngine();
