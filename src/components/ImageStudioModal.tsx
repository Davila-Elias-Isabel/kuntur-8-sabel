import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Wand2, 
  Info,
  Trash2
} from 'lucide-react';
import { sound } from '../services/audio';

interface ImageStudioModalProps {
  onClose: () => void;
}

const PRESET_IMAGE_PROMPTS = [
  'Retrato hiperrealista de una ingeniera aeroespacial en la estación KUNTUR, uniforme con detalles turquesas y pantalla holográfica.',
  'La estación espacial KUNTUR orbitando el planeta Tierra con reflejos solares dorados y nebulosa violeta de fondo.',
  'Microdron de vigilancia con lente circular brillante y propulsores iónicos en el hangar espacial.',
  'Pantalla táctil futurista de un osciloscopio cuántico mostrando ondas electromagnéticas luminosas de color cian.'
];

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState(PRESET_IMAGE_PROMPTS[0]);
  const [sourceImageBase64, setSourceImageBase64] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (PNG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSourceImageBase64(reader.result as string);
      sound.playBlip();
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateOrEdit = async () => {
    if (!prompt.trim() || isProcessing) return;

    setError(null);
    setIsProcessing(true);
    sound.playBlip();

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageBase64: sourceImageBase64 || undefined,
          aspectRatio,
          imageSize
        })
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || 'No se pudo generar o editar la imagen con gemini-nano-banana-2.1.');
      }

      setGeneratedImageUrl(data.imageUrl);
      sound.playScanSuccess();
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(err.message || 'Error de conexión con el servicio de imagen.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#12122A] border-2 border-[#E86AA8] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5E4FA2]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#E86AA8]/20 text-[#E86AA8] rounded-xs">
              <Wand2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA] flex items-center gap-2">
                ESTUDIO GRÁFICO // CREAR Y EDITAR CON GEMINI NANO BANANA 2.1
              </h2>
              <p className="text-[11px] text-[#A6A2C5]">
                Modelo: <code className="text-[#E86AA8]">gemini-nano-banana-2.1</code> (Soporte para 1K/2K/4K y edición por texto)
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

        {/* Narrative Context */}
        <div className="my-3 p-3 bg-[#1C0D20] border-l-4 border-[#E86AA8] rounded-xs text-xs text-[#EDEBFA] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#E86AA8] shrink-0 mt-0.5" />
          <p>
            Utiliza <strong>gemini-nano-banana-2.1</strong> para generar nuevos assets espaciales o subir una imagen de referencia para editarla mediante instrucciones en lenguaje natural (ej. «agrega un visor holográfico», «cambia la iluminación a azul cian»).
          </p>
        </div>

        {/* Mode Selector / Upload Area */}
        <div className="space-y-4 flex-1">
          
          {/* Preset Prompts */}
          <div>
            <label className="text-[11px] font-mono-tech font-bold text-[#8F8CA8] uppercase block mb-1.5">
              Ideas de la Base Espacial KUNTUR:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_IMAGE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playBlip();
                    setPrompt(p);
                  }}
                  className="p-2 bg-[#181836] hover:bg-[#22224D] border border-[#5E4FA2]/40 rounded-xs text-left cursor-pointer text-[11px] text-[#EDEBFA] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Source Image for Editing */}
          <div className="p-3 bg-[#0A0A1C] border border-[#5E4FA2]/50 rounded-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono-tech font-bold text-[#EDEBFA] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#E86AA8]" />
                IMAGEN DE REFERENCIA (OPCIONAL PARA EDICIÓN):
              </span>
              {sourceImageBase64 && (
                <button
                  onClick={() => setSourceImageBase64(null)}
                  className="text-[10px] text-[#D7263D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Quitar imagen
                </button>
              )}
            </div>

            {sourceImageBase64 ? (
              <div className="flex items-center gap-3">
                <img 
                  src={sourceImageBase64} 
                  alt="Referencia para editar" 
                  className="w-20 h-20 object-cover rounded-xs border border-[#E86AA8]"
                />
                <div className="text-xs text-[#EDEBFA]">
                  <span className="text-[#E86AA8] font-bold">Modo Edición Activado:</span> El modelo tomará esta imagen como base y aplicará las modificaciones descritas en el prompt.
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#5E4FA2] hover:border-[#E86AA8] p-3 text-center rounded-xs cursor-pointer text-xs text-[#8F8CA8] hover:text-[#EDEBFA] transition-colors"
              >
                Haz clic para subir una imagen si deseas editarla con texto (o déjalo vacío para crear una imagen desde cero).
              </div>
            )}
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="text-[11px] font-mono-tech font-bold text-[#8F8CA8] uppercase block mb-1.5">
              Instrucción / Prompt de Imagen:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isProcessing}
              rows={3}
              placeholder="Escribe la descripción de la imagen a generar o los cambios a realizar..."
              className="w-full bg-[#0A0A1C] border border-[#5E4FA2] focus:border-[#E86AA8] rounded-xs p-3 text-xs text-[#EDEBFA] font-mono-tech focus:outline-none transition-colors"
            />
          </div>

          {/* Controls: Aspect Ratio & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-tech font-bold text-[#8F8CA8] uppercase block mb-1.5">
                Relación de Aspecto:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => {
                      sound.playBlip();
                      setAspectRatio(ratio);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-xs font-mono-tech cursor-pointer transition-all ${
                      aspectRatio === ratio
                        ? 'bg-[#E86AA8] text-[#0B0B1A] font-bold'
                        : 'bg-[#181836] text-[#A6A2C5] hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono-tech font-bold text-[#8F8CA8] uppercase block mb-1.5">
                Resolución (imageSize):
              </label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      sound.playBlip();
                      setImageSize(size);
                    }}
                    className={`px-3 py-1 text-xs rounded-xs font-mono-tech cursor-pointer transition-all ${
                      imageSize === size
                        ? 'bg-[#E86AA8] text-[#0B0B1A] font-bold'
                        : 'bg-[#181836] text-[#A6A2C5] hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#240F18] border border-[#D7263D] rounded-xs text-xs text-[#EDEBFA] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D7263D] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-4 bg-[#1C0D20] border border-[#E86AA8]/50 rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-tech font-bold text-[#E86AA8]">
                <Loader2 className="w-4 h-4 animate-spin text-[#E86AA8]" />
                <span>Generando imagen en alta fidelidad con gemini-nano-banana-2.1 ({imageSize})...</span>
              </div>
              <div className="w-full bg-[#1B1B36] h-1.5 rounded-xs overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#8E2A6A] to-[#E86AA8] w-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Result Image */}
          {generatedImageUrl && (
            <div className="p-4 bg-[#0A0A1C] border-2 border-[#E86AA8] rounded-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-tech text-[#E86AA8] font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  IMAGEN GENERADA ({imageSize} // {aspectRatio})
                </span>
                <a
                  href={generatedImageUrl}
                  download={`kuntur-nano-banana-${Date.now()}.png`}
                  className="px-3 py-1 bg-[#E86AA8] text-[#0B0B1A] rounded-xs hover:bg-[#ff85c2] flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar PNG</span>
                </a>
              </div>

              <div className="max-h-[380px] flex items-center justify-center bg-black/60 rounded-xs overflow-hidden p-2">
                <img
                  src={generatedImageUrl}
                  alt="Resultado de Gemini Nano Banana 2.1"
                  className="max-h-[360px] w-auto object-contain rounded-xs shadow-lg"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-[#5E4FA2]/40 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="px-4 py-2 border border-[#5E4FA2] text-[#8F8CA8] hover:text-white rounded-xs font-mono-tech text-xs cursor-pointer transition-colors"
          >
            Cerrar Estudio
          </button>

          <button
            onClick={handleGenerateOrEdit}
            disabled={isProcessing || !prompt.trim()}
            className={`px-5 py-2.5 font-bold font-mono-tech text-xs rounded-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
              isProcessing || !prompt.trim()
                ? 'bg-[#2A2A48] text-[#6E6E94] cursor-not-allowed'
                : 'bg-[#E86AA8] hover:bg-[#ff85c2] text-[#0B0B1A]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando con Nano Banana 2.1...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{sourceImageBase64 ? 'Editar Imagen' : 'Crear Imagen'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
