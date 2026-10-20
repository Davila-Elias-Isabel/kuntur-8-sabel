import React, { useState } from 'react';
import { Music, Play, Pause, Download, Sparkles, RefreshCw, Volume2, X, CheckCircle2, ShieldCheck, Radio } from 'lucide-react';
import { sound, TrackInfo } from '../services/audio';

interface GeneratedTrack {
  id: string;
  title: string;
  prompt: string;
  audioUrl: string;
  blob: Blob;
  mimeType: string;
  model: string;
  createdAt: string;
}

interface MusicGeneratorModalProps {
  currentTrack: TrackInfo | null;
  onClose: () => void;
}

const LYRIA_PRESETS = [
  {
    title: 'Tema Principal KUNTUR',
    genre: 'Retro Sci-Fi Orchestral',
    prompt: 'Cinematic retro sci-fi soundtrack, warm analog synth arpeggios, atmospheric sub-bass, uplifting space melody, 120 bpm, royalty-free video game theme.'
  },
  {
    title: 'Persecución Gravedad Cero',
    genre: 'Cyberpunk Dark Synthwave',
    prompt: 'High-adrenaline dark synthwave with fast driving pulse bassline, zero-gravity space thrill, energetic electronic beat, 135 bpm, video game chase.'
  },
  {
    title: 'Vuelo Espacial Interceptor',
    genre: 'Cosmic Arcade Action',
    prompt: 'Energetic arcade space combat music with soaring lead synthesizers, cosmic arpeggios, driving laser rhythms, heroic outer space mission.'
  },
  {
    title: 'Duelo ante el Consejo',
    genre: 'Tensión Judicial Dramática',
    prompt: 'Dramatic cinematic tension strings with pulsing analog bass, emotional courtroom standoff, high stakes deliberation, intense video game soundtrack.'
  },
  {
    title: 'Constelación: Victoria Ética',
    genre: 'Ambient Épico Esperanzador',
    prompt: 'Uplifting emotional space resolution with lush ambient synth pads, triumphant chord progression, warm acoustic textures, hopeful peaceful future.'
  }
];

export const MusicGeneratorModal: React.FC<MusicGeneratorModalProps> = ({
  currentTrack,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [selectedModel, setSelectedModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [customPrompt, setCustomPrompt] = useState<string>(LYRIA_PRESETS[0].prompt);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Stored generated tracks in this session
  const [generatedList, setGeneratedList] = useState<GeneratedTrack[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(currentTrack?.id || null);

  const handleGenerateMusic = async (promptToUse?: string) => {
    const finalPrompt = promptToUse || customPrompt;
    if (!finalPrompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);
    sound.playBlip();

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          model: selectedModel
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al conectar con el servicio de música.');
      }

      // Decode base64 audio into Blob URL
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      const newTrack: GeneratedTrack = {
        id: `track-${Date.now()}`,
        title: finalPrompt.split(',')[0].slice(0, 36),
        prompt: finalPrompt,
        audioUrl,
        blob,
        mimeType: data.mimeType || 'audio/wav',
        model: selectedModel,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setGeneratedList(prev => [newTrack, ...prev]);
      setPlayingTrackId(newTrack.id);

      // Play as background music
      sound.playLyriaTrack(newTrack.audioUrl, newTrack.title);
      sound.playScanSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al generar música con IA.');
      sound.playSignalDown();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadTrack = (track: GeneratedTrack) => {
    const a = document.createElement('a');
    a.href = track.audioUrl;
    a.download = `kuntur_${track.title.toLowerCase().replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    sound.playBlip();
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#15152E] border-2 border-[#E86AA8] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col gap-4 max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#E86AA8] animate-pulse" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#E86AA8] font-mono-tech tracking-wider uppercase">
                MÚSICA LIBRE DE COPYRIGHT // GENERADOR LYRIA IA & BSO
              </h2>
              <div className="text-[11px] text-[#8F8CA8]">
                Banda sonora original 100% libre de derechos generada con Google Lyria y sintetizador procedural.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#201D3D] rounded-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Playing Bar */}
        <div className="bg-[#0C0C22] border border-[#5E4FA2]/50 p-2.5 px-3 rounded-xs flex items-center justify-between text-xs font-mono-tech">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#4FD1C5] animate-pulse" />
            <span className="text-[#8F8CA8]">REPRODUCIENDO:</span>
            <span className="text-[#4FD1C5] font-bold truncate max-w-xs">
              {currentTrack?.title || 'Sintetizador Procedural KUNTUR'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (sound.getIsPlaying()) {
                  sound.stopMusic();
                } else {
                  sound.startMusic();
                }
              }}
              className="p-1 px-2.5 bg-[#15152E] border border-[#4FD1C5] text-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-[#0B0B1A] rounded-xs font-bold transition-colors flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{sound.getIsPlaying() ? 'Pausar' : 'Reanudar'}</span>
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#5E4FA2]/40 text-xs font-mono-tech">
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-2 px-4 border-b-2 font-bold transition-colors ${
              activeTab === 'generate'
                ? 'border-[#E86AA8] text-[#E86AA8] bg-[#101026]'
                : 'border-transparent text-[#8F8CA8] hover:text-[#EDEBFA]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> GENERAR NUEVA PISTA (LYRIA)
            </span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`py-2 px-4 border-b-2 font-bold transition-colors ${
              activeTab === 'library'
                ? 'border-[#4FD1C5] text-[#4FD1C5] bg-[#101026]'
                : 'border-transparent text-[#8F8CA8] hover:text-[#EDEBFA]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" /> PISTAS PROCEDURALES & BIBLIOTECA ({sound.proceduralTracks.length + generatedList.length})
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'generate' && (
            <div className="flex flex-col gap-3">
              
              {/* Model Selector & Presets */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#0A0A1D] p-3 border border-[#5E4FA2]/40 rounded-xs">
                <div className="text-xs font-mono-tech text-[#EDEBFA]">
                  <span>MODELO DE MÚSICA IA:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedModel('lyria-3-clip-preview')}
                    className={`px-3 py-1 rounded-xs text-xs font-mono-tech font-bold transition-colors ${
                      selectedModel === 'lyria-3-clip-preview'
                        ? 'bg-[#E86AA8] text-[#0B0B1A]'
                        : 'bg-[#15152E] text-[#8F8CA8] border border-[#5E4FA2]'
                    }`}
                  >
                    Lyria Clip (30s)
                  </button>
                  <button
                    onClick={() => setSelectedModel('lyria-3-pro-preview')}
                    className={`px-3 py-1 rounded-xs text-xs font-mono-tech font-bold transition-colors ${
                      selectedModel === 'lyria-3-pro-preview'
                        ? 'bg-[#E86AA8] text-[#0B0B1A]'
                        : 'bg-[#15152E] text-[#8F8CA8] border border-[#5E4FA2]'
                    }`}
                  >
                    Lyria Pro (Pista Completa)
                  </button>
                </div>
              </div>

              {/* Fast Presets */}
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] font-mono-tech text-[#8F8CA8]">
                  PREAJUSTES DE LA ESTACIÓN KUNTUR (CLIC PARA CARGAR):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LYRIA_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomPrompt(preset.prompt)}
                      className="p-2.5 rounded-xs border border-[#5E4FA2]/50 bg-[#121228] hover:border-[#4FD1C5] text-left transition-all cursor-pointer group"
                    >
                      <div className="text-xs font-bold text-[#EDEBFA] group-hover:text-[#4FD1C5] font-mono-tech">
                        {preset.title}
                      </div>
                      <div className="text-[10px] text-[#8F8CA8]">{preset.genre}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Editor */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono-tech text-[#EDEBFA] flex items-center justify-between">
                  <span>PROMPT MUSICAL (DESCRIPCIÓN DE GÉNERO, INSTRUMENTOS, TEMPO):</span>
                  <span className="text-[#4FD1C5]">100% Libre de Copyright</span>
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ej: Synthwave espacial retro, sintetizadores analógicos cálidos, arpegios cósmicos..."
                  className="w-full bg-[#080818] border border-[#5E4FA2] p-2.5 text-xs text-[#EDEBFA] font-mono-tech rounded-xs focus:outline-none focus:border-[#E86AA8]"
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-[#D7263D]/20 border border-[#D7263D] text-xs font-mono-tech text-[#EDEBFA] rounded-xs">
                  {errorMsg}
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-[#8F8CA8] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4FD1C5]" />
                  <span>Uso comercial y de videojuegos permitido sin regalías</span>
                </div>

                <button
                  onClick={() => handleGenerateMusic()}
                  disabled={isGenerating}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xs font-extrabold text-xs uppercase tracking-wider font-mono-tech transition-all ${
                    isGenerating
                      ? 'bg-[#252545] text-[#8F8CA8] cursor-not-allowed'
                      : 'bg-[#E86AA8] hover:bg-[#ff7dbd] text-[#0B0B1A] shadow-[0_0_15px_rgba(232,106,168,0.5)] cursor-pointer'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Componiendo con Lyria...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generar y Reproducir Pista</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {activeTab === 'library' && (
            <div className="flex flex-col gap-3">
              {/* Procedural Tracks */}
              <div className="flex flex-col gap-1.5">
                <div className="text-xs font-mono-tech text-[#4FD1C5] font-bold">
                  PISTAS PROCEDURALES NATIVAS (WEB AUDIO API):
                </div>
                {sound.proceduralTracks.map((pt, idx) => (
                  <div
                    key={pt.id}
                    className="p-3 rounded-xs border border-[#5E4FA2]/50 bg-[#101026] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#EDEBFA] font-mono-tech">{pt.title}</div>
                      <div className="text-[10px] text-[#8F8CA8]">{pt.genre} · {pt.duration}</div>
                    </div>
                    <button
                      onClick={() => {
                        sound.switchProceduralTrack(idx);
                        setPlayingTrackId(pt.id);
                        sound.playBlip();
                      }}
                      className="px-3 py-1 bg-[#4FD1C5] hover:bg-[#6fe4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Escuchar
                    </button>
                  </div>
                ))}
              </div>

              {/* Generated Lyria Tracks */}
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="text-xs font-mono-tech text-[#E86AA8] font-bold">
                  PISTAS GENERADAS CON LYRIA IA EN ESTA SESIÓN ({generatedList.length}):
                </div>
                {generatedList.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#8F8CA8] border border-dashed border-[#5E4FA2]/40 rounded-xs">
                    Aún no has generado pistas con Lyria. Usa la pestaña "Generar Nueva Pista" para crear temas con IA.
                  </div>
                ) : (
                  generatedList.map((gt) => (
                    <div
                      key={gt.id}
                      className="p-3 rounded-xs border border-[#E86AA8]/50 bg-[#161028] flex items-center justify-between text-xs gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[#EDEBFA] font-mono-tech truncate">{gt.title}</div>
                        <div className="text-[10px] text-[#8F8CA8] truncate">{gt.prompt}</div>
                        <div className="text-[9px] text-[#E86AA8] font-mono-tech mt-0.5">
                          {gt.model} · {gt.createdAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            sound.playLyriaTrack(gt.audioUrl, gt.title);
                            setPlayingTrackId(gt.id);
                          }}
                          className="p-1.5 px-2 bg-[#E86AA8] hover:bg-[#ff7dbd] text-[#0B0B1A] font-bold text-xs rounded-xs font-mono-tech flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" /> Poner de BSO
                        </button>
                        <button
                          onClick={() => handleDownloadTrack(gt)}
                          title="Descargar archivo WAV"
                          className="p-1.5 bg-[#15152E] border border-[#E86AA8] text-[#E86AA8] hover:bg-[#E86AA8] hover:text-[#0B0B1A] rounded-xs text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#5E4FA2]/40 pt-2 flex items-center justify-between text-[11px] text-[#8F8CA8] font-mono-tech">
          <span>Licencia: CC0 / Dominio Público · Libre de Reclamaciones</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#5E4FA2] hover:bg-[#E86AA8] text-[#EDEBFA] hover:text-[#0B0B1A] font-bold rounded-xs transition-colors"
          >
            Volver a la Base
          </button>
        </div>

      </div>
    </div>
  );
};
