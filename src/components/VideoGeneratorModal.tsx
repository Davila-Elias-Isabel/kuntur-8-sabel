import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Video, 
  Sparkles, 
  Loader2, 
  Download, 
  AlertTriangle, 
  Monitor, 
  Smartphone, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../services/audio';

interface VideoGeneratorModalProps {
  onClose: () => void;
}

const PRESET_PROMPTS = [
  {
    title: 'Hangar en Gravedad Cero',
    prompt: 'A cinematic space cadet floating inside a futuristic orbital hangar with small glowing surveillance drones and zero gravity dust particles, cinematic lighting, photorealistic.',
    aspect: '16:9' as const
  },
  {
    title: 'Nave KUNTUR en Vuelo Espacial',
    prompt: 'A sleek white and teal interceptor spaceship maneuvering through asteroid field in deep space, firing an electric blue EMP pulse at a communications relay tower.',
    aspect: '16:9' as const
  },
  {
    title: 'Retrato de Cadete Espacial (Vertical)',
    prompt: 'Close up portrait of a young heroic space engineer in a reflective high tech astronaut suit looking at holographic data projections, stars reflecting on helmet visor.',
    aspect: '9:16' as const
  }
];

const REASSURING_MESSAGES = [
  'Iniciando pipeline neuronal con Veo 3 (veo-3.1-fast-generate-preview)...',
  'Calculando vectores de movimiento y coherencia lumínica...',
  'Generando física espacial de partículas y sombras dinámicas...',
  'Sintetizando fotogramas continuos en resolución 720p...',
  'Finalizando renderizado y codificación del archivo MP4...'
];

export const VideoGeneratorModal: React.FC<VideoGeneratorModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState<string>(PRESET_PROMPTS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    };
  }, []);

  const handleStartGeneration = async () => {
    if (!prompt.trim() || isGenerating) return;

    setError(null);
    setVideoUrl(null);
    setIsGenerating(true);
    setStatusMessage(REASSURING_MESSAGES[0]);
    sound.playBlip();

    let msgIdx = 0;
    messageIntervalRef.current = setInterval(() => {
      msgIdx = (msgIdx + 1) % REASSURING_MESSAGES.length;
      setStatusMessage(REASSURING_MESSAGES[msgIdx]);
    }, 4500);

    try {
      // 1. Start generation
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio })
      });

      const data = await res.json();
      if (!res.ok || !data.operationName) {
        throw new Error(data.error || 'No se pudo iniciar la generación con Veo 3.');
      }

      const operationName = data.operationName;

      // 2. Poll until done
      pollIntervalRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName })
          });

          const pollData = await pollRes.json();
          if (pollData.error) {
            clearInterval(pollIntervalRef.current!);
            clearInterval(messageIntervalRef.current!);
            setIsGenerating(false);
            setError(pollData.error.message || 'Error en la operación de video.');
            return;
          }

          if (pollData.done) {
            clearInterval(pollIntervalRef.current!);
            clearInterval(messageIntervalRef.current!);
            setStatusMessage('¡Renderizado completado! Descargando video...');

            // 3. Download the video stream
            const downloadRes = await fetch('/api/video-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName })
            });

            if (!downloadRes.ok) {
              throw new Error('Error al descargar el archivo de video procesado.');
            }

            const blob = await downloadRes.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            setIsGenerating(false);
            sound.playScanSuccess();
          }
        } catch (pollErr: any) {
          console.error('Polling error:', pollErr);
        }
      }, 5000);

    } catch (err: any) {
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setIsGenerating(false);
      setError(err.message || 'Ocurrió un error al contactar el servicio de video Veo 3.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#12122A] border-2 border-[#4FD1C5] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5E4FA2]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#4FD1C5]/20 text-[#4FD1C5] rounded-xs">
              <Video className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA] flex items-center gap-2">
                LABORATORIO VEO 3 // GENERADOR DE VIDEO CON IA
              </h2>
              <p className="text-[11px] text-[#A6A2C5]">
                Modelo: <code className="text-[#4FD1C5]">veo-3.1-fast-generate-preview</code> (Aspect Ratio: 16:9 o 9:16)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="p-1.5 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#1A1A3A] rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Context Banner */}
        <div className="my-3 p-3 bg-[#0B1D22] border-l-4 border-[#4FD1C5] rounded-xs text-xs text-[#EDEBFA] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#4FD1C5] shrink-0 mt-0.5" />
          <p>
            En la base espacial KUNTUR, los cadetes analizan la generación de video sintético con <strong>Veo 3</strong> para comprender cómo los algoritmos crean movimiento fotograma a fotograma y aprender a reconocer las fallas en los <em>holofakes</em> manipulados.
          </p>
        </div>

        {/* Main Content Form */}
        <div className="space-y-4 flex-1">
          
          {/* Preset Prompts Buttons */}
          <div>
            <label className="text-[11px] font-mono-tech font-bold text-[#8F8CA8] uppercase block mb-1.5">
              Plantillas de Simulación Rápida:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playBlip();
                    setPrompt(item.prompt);
                    setAspectRatio(item.aspect);
                  }}
                  className="p-2.5 bg-[#181836] hover:bg-[#22224D] border border-[#5E4FA2]/40 rounded-xs text-left cursor-pointer transition-colors group"
                >
                  <div className="text-xs font-bold text-[#EDEBFA] group-hover:text-[#4FD1C5] font-mono-tech flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-[#8F8CA8] bg-[#0A0A18] px-1 rounded">{item.aspect}</span>
                  </div>
                  <div className="text-[10px] text-[#A6A2C5] line-clamp-1 mt-1">
                    {item.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Textarea */}
          <div>
            <label className="text-[11px] font-mono-tech font-bold text-[#8F8CA8] uppercase block mb-1.5">
              Descripción del Video (Prompt):
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              rows={3}
              placeholder="Describe detalladamente la escena espacial, iluminación y movimiento..."
              className="w-full bg-[#0A0A1C] border border-[#5E4FA2] focus:border-[#4FD1C5] rounded-xs p-3 text-xs text-[#EDEBFA] font-mono-tech focus:outline-none transition-colors"
            />
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="text-[11px] font-mono-tech font-bold text-[#8F8CA8] uppercase block mb-1.5">
              Relación de Aspecto (Aspect Ratio):
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => {
                  sound.playBlip();
                  setAspectRatio('16:9');
                }}
                className={`p-2.5 rounded-xs border flex items-center justify-center gap-2 font-mono-tech text-xs cursor-pointer transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-[#4FD1C5]/20 border-[#4FD1C5] text-[#4FD1C5] font-bold shadow-md'
                    : 'bg-[#181836] border-[#5E4FA2]/40 text-[#8F8CA8] hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>16:9 (Paisaje)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playBlip();
                  setAspectRatio('9:16');
                }}
                className={`p-2.5 rounded-xs border flex items-center justify-center gap-2 font-mono-tech text-xs cursor-pointer transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-[#4FD1C5]/20 border-[#4FD1C5] text-[#4FD1C5] font-bold shadow-md'
                    : 'bg-[#181836] border-[#5E4FA2]/40 text-[#8F8CA8] hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>9:16 (Vertical)</span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-[#240F18] border border-[#D7263D] rounded-xs text-xs text-[#EDEBFA] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D7263D] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generating Indicator */}
          {isGenerating && (
            <div className="p-4 bg-[#0A1A24] border border-[#4FD1C5]/50 rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-tech font-bold text-[#4FD1C5]">
                <Loader2 className="w-4 h-4 animate-spin text-[#4FD1C5]" />
                <span>{statusMessage}</span>
              </div>
              <div className="w-full bg-[#1B1B36] h-1.5 rounded-xs overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#299E94] to-[#4FD1C5] w-full animate-pulse" />
              </div>
              <p className="text-[10px] text-[#A6A2C5]">
                La generación con Veo 3 toma entre 30 y 90 segundos. Estamos procesando la solicitud en el servidor.
              </p>
            </div>
          )}

          {/* Video Player Display */}
          {videoUrl && (
            <div className="p-4 bg-[#0A0A1C] border-2 border-[#4FD1C5] rounded-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-tech text-[#4FD1C5] font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  VIDEO GENERADO CON VEO 3 (720p // {aspectRatio})
                </span>
                <a
                  href={videoUrl}
                  download={`kuntur-veo3-${Date.now()}.mp4`}
                  className="px-3 py-1 bg-[#4FD1C5] text-[#0B0B1A] rounded-xs hover:bg-[#6ee4d9] flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar MP4</span>
                </a>
              </div>

              <div className={`mx-auto bg-black rounded-xs overflow-hidden flex items-center justify-center ${
                aspectRatio === '9:16' ? 'max-w-[280px] aspect-[9/16]' : 'w-full aspect-[16/9]'
              }`}>
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-[#5E4FA2]/40 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="px-4 py-2 border border-[#5E4FA2] text-[#8F8CA8] hover:text-white rounded-xs font-mono-tech text-xs cursor-pointer transition-colors"
          >
            Cerrar Laboratorio
          </button>

          <button
            onClick={handleStartGeneration}
            disabled={isGenerating || !prompt.trim()}
            className={`px-5 py-2.5 font-bold font-mono-tech text-xs rounded-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
              isGenerating || !prompt.trim()
                ? 'bg-[#2A2A48] text-[#6E6E94] cursor-not-allowed'
                : 'bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A]'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando con Veo 3...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Video con Veo 3</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
