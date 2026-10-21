/**
 * Text-to-Speech (TTS) galactic narrator engine for KUNTUR
 * Provides spoken audio with a sci-fi galactic radio intercom vibe for 10-year-olds.
 * Uses Web Speech API + Web Audio API radio chimes.
 * 
 * Features strict cancellation & token management so that speech from one level
 * or screen is immediately stopped when transitioning to another level/screen.
 */

export interface SpeakOptions {
  isGalactic?: boolean;
  prependChime?: boolean;
  pitch?: number;
  rate?: number;
  onEnd?: () => void;
  context?: string;
}

class SpeechNarratorService {
  private isEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private autoReadEnabled: boolean = true;
  private galacticMode: boolean = true;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();
  private bestVoice: SpeechSynthesisVoice | null = null;
  private audioCtx: AudioContext | null = null;
  
  // Monotonic token to invalidate pending timeouts or stale speech callbacks
  private activeToken: number = 0;
  private pendingTimeout: any = null;
  private currentContext: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Plays a futuristic sci-fi radio transponder chime before the galactic voice speaks
   */
  private playGalacticChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      // Beep 1 (high freq)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.06);
      gain1.gain.setValueAtTime(0.04, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.07);

      // Beep 2 (sci-fi confirmation)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1760, now + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(1174, now + 0.14);
      gain2.gain.setValueAtTime(0.03, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.15);
    } catch {}
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;
      // Prioritize Latin American / clear Spanish voices
      this.bestVoice = 
        voices.find(v => v.lang.startsWith('es-419')) ||
        voices.find(v => v.lang.startsWith('es-PE')) ||
        voices.find(v => v.lang.startsWith('es-MX')) ||
        voices.find(v => v.lang.startsWith('es-US')) ||
        voices.find(v => v.lang.startsWith('es-ES')) ||
        voices.find(v => v.lang.startsWith('es')) ||
        null;
    } catch {}
  }

  public setAutoRead(enabled: boolean) {
    this.autoReadEnabled = enabled;
  }

  public isAutoRead(): boolean {
    return this.autoReadEnabled;
  }

  public toggleAutoRead(): boolean {
    this.autoReadEnabled = !this.autoReadEnabled;
    if (!this.autoReadEnabled) {
      this.stop();
    }
    return this.autoReadEnabled;
  }

  public isGalactic(): boolean {
    return this.galacticMode;
  }

  public toggleGalactic(): boolean {
    this.galacticMode = !this.galacticMode;
    return this.galacticMode;
  }

  public addListener(cb: (isSpeaking: boolean) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(isSpeaking: boolean) {
    this.isSpeakingState = isSpeaking;
    this.listeners.forEach(cb => {
      try {
        cb(isSpeaking);
      } catch {}
    });
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  /**
   * Strictly cancels and stops all audio, pending timers, and utterances immediately.
   * Increments activeToken to guarantee no previous delayed speech can execute.
   */
  public stop() {
    this.activeToken++;
    this.currentContext = '';
    
    if (this.pendingTimeout) {
      clearTimeout(this.pendingTimeout);
      this.pendingTimeout = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        // Chromium fix: resume if queue was frozen
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {}
    }

    this.currentUtterance = null;
    this.notify(false);
  }

  /**
   * Alias for stop, for explicit unmount cleanup
   */
  public cancelAll() {
    this.stop();
  }

  /**
   * Speaks the provided text using the Galactic voice persona.
   * Cancels any prior audio immediately so that only the current level/dialogue speaks.
   */
  public speak(text: string, optionsOrOnEnd?: (() => void) | SpeakOptions, context?: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!this.isEnabled) return;

    // First, strictly stop any active or queued speech
    this.stop();

    const options: SpeakOptions = typeof optionsOrOnEnd === 'function'
      ? { onEnd: optionsOrOnEnd }
      : (optionsOrOnEnd || {});

    const targetContext = context || options.context || '';
    this.currentContext = targetContext;

    // Clean text of technical markup, emojis, URLs, and symbols for crisp pronunciation
    const cleanText = text
      .replace(/[«»“”"']/g, '')
      .replace(/[🚨🎯⚠️⭐🛸🚀🎮💡📌❌🤐✅🎭🔍⚖️🤝📊💾🔬📡📞🛡️🔒👉🔧🕹️✨🏅]/g, '')
      .replace(/(\/\/.*)/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return;

    const token = ++this.activeToken;

    if (options.prependChime !== false) {
      this.playGalacticChime();
    }

    // Schedule the utterance with a brief delay for chime
    this.pendingTimeout = setTimeout(() => {
      // Guard against stale invocation (e.g. if stop() was called during timeout)
      if (this.activeToken !== token) return;

      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        
        // Galactic robotic tone: slightly elevated pitch and brisk rate
        const useGalactic = options.isGalactic !== undefined ? options.isGalactic : this.galacticMode;
        if (useGalactic) {
          utterance.rate = options.rate ?? 1.05;
          utterance.pitch = options.pitch ?? 1.18; // Galactic sci-fi android inflection
        } else {
          utterance.rate = options.rate ?? 1.0;
          utterance.pitch = options.pitch ?? 1.0;
        }

        if (!this.bestVoice) {
          this.initVoices();
        }
        if (this.bestVoice) {
          utterance.voice = this.bestVoice;
        }

        utterance.onstart = () => {
          if (this.activeToken !== token) {
            try {
              window.speechSynthesis.cancel();
            } catch {}
            return;
          }
          this.notify(true);
        };

        utterance.onend = () => {
          if (this.activeToken === token) {
            this.notify(false);
            if (options.onEnd) {
              try {
                options.onEnd();
              } catch {}
            }
          }
        };

        utterance.onerror = () => {
          if (this.activeToken === token) {
            this.notify(false);
          }
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch {
        this.notify(false);
      }
    }, 100);
  }

  /**
   * Explains a mission step simply with the galactic computer persona for 10-year-olds
   */
  public speakMissionSimple(missionName: string, whatToDo: string, context?: string) {
    const text = `Computadora KUNTUR. Misión: ${missionName}. Qué tienes que hacer: ${whatToDo}`;
    this.speak(text, { isGalactic: true, prependChime: true, context });
  }

  /**
   * Reads a question and its options simply in sequence
   */
  public speakQuestionAndOptions(
    prompt: string,
    options: { label: string; text: string }[],
    context?: string
  ) {
    const optionsText = options
      .map(o => `Opción ${o.label}: ${o.text}`)
      .join('. ');
    
    const fullSpeech = `Atención cadete: ${prompt}. ${optionsText}`;
    this.speak(fullSpeech, { isGalactic: true, prependChime: true, context });
  }
}

export const speech = new SpeechNarratorService();
