/**
 * Audio synthesis engine and procedural soundtrack sequencer for KUNTUR
 * 100% royalty-free, copyright-free, with Lyria audio stream support.
 */

export interface TrackInfo {
  id: string;
  title: string;
  genre: string;
  source: 'procedural' | 'lyria';
  duration?: string;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.5;

  // Background procedural music state
  private isMusicPlaying: boolean = false;
  private musicInterval: NodeJS.Timeout | null = null;
  private currentTrackIndex: number = 0;
  private activeLyriaAudio: HTMLAudioElement | null = null;

  private onTrackChangeCallback: ((track: TrackInfo) => void) | null = null;

  // Presets of procedural tracks
  public readonly proceduralTracks: TrackInfo[] = [
    {
      id: 'track-kuntur',
      title: 'KUNTUR: Frecuencia de Rescate',
      genre: 'Retro Sci-Fi Ambient Arpeggios',
      source: 'procedural',
      duration: 'Bucle Continuo'
    },
    {
      id: 'track-eco',
      title: 'El Eco: Tensión Cibernética',
      genre: 'Dark Electro Pulse',
      source: 'procedural',
      duration: 'Bucle Continuo'
    },
    {
      id: 'track-constellation',
      title: 'Constelación: Alianza Ética',
      genre: 'Uplifting Space Melody',
      source: 'procedural',
      duration: 'Bucle Continuo'
    }
  ];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.activeLyriaAudio) {
      this.activeLyriaAudio.muted = muted;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.activeLyriaAudio) {
      this.activeLyriaAudio.volume = this.musicVolume;
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public onTrackChange(cb: (track: TrackInfo) => void) {
    this.onTrackChangeCallback = cb;
  }

  // --- PROCEDURAL MUSIC SYNTHESIZER SEQUENCER ---
  public startMusic() {
    if (this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    let step = 0;

    // Melody sequences in Hz
    // Track 0: KUNTUR (C minor pentatonic arpeggio)
    const melodyKuntur = [261.63, 311.13, 392.00, 466.16, 523.25, 466.16, 392.00, 311.13];
    const bassKuntur = [130.81, 130.81, 116.54, 116.54, 98.00, 98.00, 103.83, 103.83];

    // Track 1: El Eco (Tense rapid 16ths in D minor)
    const melodyEco = [293.66, 349.23, 293.66, 440.00, 293.66, 349.23, 466.16, 440.00];
    const bassEco = [73.42, 73.42, 73.42, 73.42, 87.31, 87.31, 82.41, 82.41];

    // Track 2: Constelación (F major warm progression)
    const melodyConst = [349.23, 440.00, 523.25, 659.25, 523.25, 440.00, 392.00, 329.63];
    const bassConst = [87.31, 87.31, 110.00, 110.00, 130.81, 130.81, 98.00, 98.00];

    const currentTrack = this.proceduralTracks[this.currentTrackIndex];
    if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback(currentTrack);
    }

    if (this.musicInterval) clearInterval(this.musicInterval);

    this.musicInterval = setInterval(() => {
      if (this.isMuted || !this.isMusicPlaying) return;

      const track = this.currentTrackIndex;
      const melody = track === 0 ? melodyKuntur : track === 1 ? melodyEco : melodyConst;
      const bass = track === 0 ? bassKuntur : track === 1 ? bassEco : bassConst;

      const noteFreq = melody[step % melody.length];
      const bassFreq = bass[Math.floor(step / 2) % bass.length];

      // Play lead arpeggio note
      this.playSynthNote(noteFreq, track === 1 ? 'sawtooth' : 'triangle', 0.22, 0.035 * this.musicVolume);

      // Play bass drone on every 2nd step
      if (step % 2 === 0) {
        this.playSynthNote(bassFreq, 'sine', 0.45, 0.05 * this.musicVolume);
      }

      step++;
    }, 240); // 125 BPM
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.activeLyriaAudio) {
      this.activeLyriaAudio.pause();
    }
  }

  public switchProceduralTrack(index: number) {
    this.currentTrackIndex = (index + this.proceduralTracks.length) % this.proceduralTracks.length;
    if (this.activeLyriaAudio) {
      this.activeLyriaAudio.pause();
      this.activeLyriaAudio = null;
    }
    this.stopMusic();
    this.startMusic();
  }

  public nextTrack() {
    this.switchProceduralTrack(this.currentTrackIndex + 1);
  }

  public playLyriaTrack(audioUrl: string, trackTitle: string) {
    this.stopMusic();
    if (this.activeLyriaAudio) {
      this.activeLyriaAudio.pause();
    }

    this.activeLyriaAudio = new Audio(audioUrl);
    this.activeLyriaAudio.volume = this.musicVolume;
    this.activeLyriaAudio.muted = this.isMuted;
    this.activeLyriaAudio.loop = true;
    this.activeLyriaAudio.play().catch(() => {});

    if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback({
        id: `lyria-${Date.now()}`,
        title: trackTitle,
        genre: 'Generado con Google Lyria IA',
        source: 'lyria',
        duration: '30s / Completa'
      });
    }
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying || (this.activeLyriaAudio !== null && !this.activeLyriaAudio.paused);
  }

  private playSynthNote(freq: number, type: OscillatorType, duration: number, gainVal: number) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  // --- SOUND EFFECTS ---
  public playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.08) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  public playStep() {
    this.playTone(180 + Math.random() * 40, 'sine', 0.04, 0.015);
  }

  public playBlip() {
    this.playTone(520, 'sine', 0.02, 0.02);
  }

  public playTypewriter() {
    this.playTone(440 + Math.random() * 80, 'triangle', 0.03, 0.015);
  }

  public playAlert() {
    if (this.isMuted) return;
    try {
      this.playTone(480, 'sawtooth', 0.12, 0.05);
      setTimeout(() => this.playTone(330, 'sawtooth', 0.18, 0.05), 80);
      setTimeout(() => this.playTone(260, 'sawtooth', 0.22, 0.04), 160);
    } catch {}
  }

  public playSignalUp() {
    if (this.isMuted) return;
    this.playTone(523.25, 'triangle', 0.12, 0.06);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.14, 0.06), 70);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.07), 140);
  }

  public playSignalDown() {
    if (this.isMuted) return;
    this.playTone(349.23, 'square', 0.14, 0.04);
    setTimeout(() => this.playTone(311.13, 'square', 0.28, 0.05), 90);
  }

  public playScanHotspot(isReal: boolean) {
    if (isReal) {
      this.playTone(600, 'sine', 0.08, 0.05);
      setTimeout(() => this.playTone(900, 'sine', 0.15, 0.06), 70);
    } else {
      this.playTone(250, 'triangle', 0.12, 0.04);
    }
  }

  public playScanSuccess() {
    if (this.isMuted) return;
    this.playTone(587.33, 'triangle', 0.1, 0.06);
    setTimeout(() => this.playTone(739.99, 'triangle', 0.12, 0.06), 80);
    setTimeout(() => this.playTone(880.00, 'triangle', 0.3, 0.08), 160);
  }

  public playThruster() {
    if (this.isMuted) return;
    this.playTone(90 + Math.random() * 20, 'sawtooth', 0.08, 0.04);
    this.playTone(130, 'triangle', 0.06, 0.03);
  }

  public playLaser() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }

  public playObjection() {
    if (this.isMuted) return;
    this.playTone(80, 'square', 0.4, 0.12);
    this.playTone(120, 'sawtooth', 0.35, 0.1);
    setTimeout(() => {
      this.playTone(1046.5, 'triangle', 0.25, 0.1);
      this.playTone(1318.5, 'triangle', 0.35, 0.08);
    }, 50);
  }

  public playShatter() {
    if (this.isMuted) return;
    this.playTone(1200, 'sawtooth', 0.1, 0.08);
    setTimeout(() => this.playTone(850, 'sawtooth', 0.12, 0.07), 40);
    setTimeout(() => this.playTone(400, 'square', 0.18, 0.09), 80);
  }

  public playFanfare() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.3, 0.08);
      }, idx * 120);
    });
  }

  // --- 80s RETRO ARCADE SYNTH EFFECTS ---
  public playRetroCoin() {
    if (this.isMuted) return;
    this.playTone(987.77, 'square', 0.08, 0.08); // B5
    setTimeout(() => this.playTone(1318.51, 'square', 0.28, 0.1), 70); // E6
  }

  public playRetroLaser() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  public playRetroExplosion() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Noise burst combined with square drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {}
  }

  public playRetroPowerUp() {
    if (this.isMuted) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.09, 0.07);
      }, idx * 45);
    });
  }

  public playRetroShield() {
    if (this.isMuted) return;
    this.playTone(440, 'sine', 0.15, 0.08);
    this.playTone(880, 'triangle', 0.15, 0.05);
  }

  public startAmbient() {
    this.startMusic();
  }
}

export const sound = new SoundEngine();
