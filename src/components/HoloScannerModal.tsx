import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, X, Search, FileText } from 'lucide-react';
import { HotspotItem } from '../types/game';
import { sound } from '../services/audio';
import { SpeakerButton } from './SpeakerButton';
import { speech } from '../services/speech';

interface HoloScannerModalProps {
  hotspots: HotspotItem[];
  onCompleteScan: () => void;
  onCancelScan: () => void;
}

export const HoloScannerModal: React.FC<HoloScannerModalProps> = ({
  hotspots: initialHotspots,
  onCompleteScan,
  onCancelScan
}) => {
  const [hotspots, setHotspots] = useState<HotspotItem[]>(initialHotspots);
  const [activeLog, setActiveLog] = useState<string>(
    '🔍 Toca los 5 círculos brillantes en la pantalla para encontrar las 3 fallas que demuestran que este video fue inventado con Inteligencia Artificial.'
  );
  const [logStatus, setLogStatus] = useState<'neutral' | 'real' | 'fake'>('neutral');

  const realEvidenceFound = hotspots.filter(h => h.isRealAnomaly && h.examined).length;
  const isComplete = realEvidenceFound >= 3;

  useEffect(() => {
    return () => {
      speech.stop();
    };
  }, []);

  const handleInspectHotspot = (item: HotspotItem) => {
    if (item.examined) {
      // Already examined, show description again
      setActiveLog(`${item.title}: ${item.description}`);
      setLogStatus(item.isRealAnomaly ? 'real' : 'fake');
      sound.playScanHotspot(item.isRealAnomaly);
      return;
    }

    const updated = hotspots.map(h => h.id === item.id ? { ...h, examined: true } : h);
    setHotspots(updated);

    sound.playScanHotspot(item.isRealAnomaly);
    setActiveLog(`${item.title}: ${item.description}`);
    setLogStatus(item.isRealAnomaly ? 'real' : 'fake');

    const newRealCount = updated.filter(h => h.isRealAnomaly && h.examined).length;
    if (newRealCount >= 3) {
      sound.playScanSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#15152E] border-2 border-[#4FD1C5] shadow-2xl rounded-sm flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#0D0D24] border-b border-[#5E4FA2] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#4FD1C5] animate-pulse" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#4FD1C5] tracking-wider font-mono-tech">
                ANALIZADOR FORENSE DE HOLO-DATOS // DESENCRIPTACIÓN
              </h2>
              <div className="text-[11px] text-[#E86AA8]">
                MUESTRA ANALIZADA: VALE_VERDAD_ASCENSO.HOLO (Origen anónimo: El Eco)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-[#101026] border border-[#E86AA8] rounded-xs text-xs font-mono-tech">
              EVIDENCIA: <span className="text-[#4FD1C5] font-bold tabular-nums">{realEvidenceFound}</span>/3
            </div>
            <button
              onClick={onCancelScan}
              className="p-1 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#201D3D] rounded-xs"
              title="Cerrar escáner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Galactic Guide for 10-year-olds */}
        <div className="bg-[#0A0A1F] border-b border-[#5E4FA2]/50 px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-[#EDEBFA]">
            <span className="text-base">🛰️</span>
            <span><strong>QUÉ TIENES QUE HACER:</strong> Toca los círculos brillantes para encontrar las 3 fallas que demuestran que el video fue inventado con IA.</span>
          </div>
          <SpeakerButton 
            onCustomSpeak={() => {
              speech.speak("Atención cadete forense. Toca los círculos brillantes del holograma para encontrar las tres fallas que demuestran que el video fue inventado con Inteligencia Artificial.");
            }}
            label="🛰️ Guía Galáctica"
            className="bg-[#4FD1C5]/20 text-[#4FD1C5] border-[#4FD1C5]"
          />
        </div>

        {/* Viewport with Abstract Ethical Hologram */}
        <div className="relative h-64 sm:h-80 bg-[#070716] overflow-hidden flex items-center justify-center border-b border-[#5E4FA2]/40 select-none">
          {/* Cyber Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(79, 209, 197, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 209, 197, 0.2) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          {/* Vertical Scan Sweep Line */}
          <div className="absolute inset-x-0 h-0.5 bg-[#4FD1C5] shadow-[0_0_12px_#4FD1C5] animate-scan-sweep pointer-events-none" />

          {/* STRICT ETHICAL REPRESENTATION: Abstract non-human geometric diffuse silhouette */}
          <div className="relative flex flex-col items-center justify-center animate-holo">
            <div 
              className="w-36 h-56 rounded-t-3xl rounded-b-xl opacity-80 blur-xs"
              style={{
                background: 'linear-gradient(180deg, #5E4FA2 0%, #E86AA8 50%, #4FD1C5 100%)',
                clipPath: 'polygon(46% 0%, 54% 0%, 75% 22%, 85% 65%, 65% 100%, 35% 100%, 15% 65%, 25% 22%)'
              }}
            />
            {/* Chromatic aberration glitch layers */}
            <div 
              className="absolute inset-0 bg-[#E86AA8] mix-blend-screen opacity-40 blur-[2px] transform -translate-x-1"
              style={{ clipPath: 'polygon(46% 0%, 54% 0%, 75% 22%, 85% 65%, 65% 100%, 35% 100%, 15% 65%, 25% 22%)' }}
            />
            <div 
              className="absolute inset-0 bg-[#4FD1C5] mix-blend-screen opacity-40 blur-[2px] transform translate-x-1"
              style={{ clipPath: 'polygon(46% 0%, 54% 0%, 75% 22%, 85% 65%, 65% 100%, 35% 100%, 15% 65%, 25% 22%)' }}
            />
            <span className="absolute bottom-2 text-[10px] text-[#EDEBFA]/60 font-mono-tech tracking-widest uppercase">
              Voxel Mesh // Sin Datos Biométricos Reales
            </span>
          </div>

          {/* Interactive Hotspots (5 points) */}
          {hotspots.map((spot) => {
            const isFoundReal = spot.examined && spot.isRealAnomaly;
            const isFoundFake = spot.examined && !spot.isRealAnomaly;

            return (
              <button
                key={spot.id}
                onClick={() => handleInspectHotspot(spot)}
                style={{ top: `${spot.yPercent}%`, left: `${spot.xPercent}%` }}
                className={`absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-xs font-bold transition-transform cursor-pointer ${
                  isFoundReal 
                    ? 'bg-[#4FD1C5] text-[#0B0B1A] border-2 border-white shadow-[0_0_12px_#4FD1C5]'
                    : isFoundFake
                    ? 'bg-[#F2B544]/60 text-[#EDEBFA] border border-[#F2B544]'
                    : 'bg-[#5E4FA2]/80 text-[#EDEBFA] border-2 border-[#EDEBFA] hover:scale-125 animate-pulse'
                }`}
                title={spot.examined ? spot.title : 'Examinar vector forense'}
                aria-label={`Examinar ${spot.title}`}
              >
                {isFoundReal ? '✓' : isFoundFake ? '·' : '?'}
              </button>
            );
          })}
        </div>

        {/* Forensic Log Display */}
        <div className="p-4 bg-[#0A0A1D] flex-1 flex flex-col justify-between gap-3">
          <div 
            className={`p-3 rounded-xs border-l-4 text-xs font-mono-tech leading-relaxed transition-colors ${
              logStatus === 'real'
                ? 'border-[#4FD1C5] bg-[#4FD1C5]/10 text-[#EDEBFA]'
                : logStatus === 'fake'
                ? 'border-[#F2B544] bg-[#F2B544]/10 text-[#EDEBFA]'
                : 'border-[#5E4FA2] bg-[#15152E] text-[#8F8CA8]'
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <div className="flex items-center gap-1.5">
                {logStatus === 'real' && <ShieldCheck className="w-4 h-4 text-[#4FD1C5]" />}
                {logStatus === 'fake' && <AlertCircle className="w-4 h-4 text-[#F2B544]" />}
                {logStatus === 'real' && <span className="text-[#4FD1C5]">[EVIDENCIA FORENSE CONFIRMADA]</span>}
                {logStatus === 'fake' && <span className="text-[#F2B544]">[PARÁMETRO BENIGNO / DISTRACTOR]</span>}
                {logStatus === 'neutral' && <span className="text-[#8F8CA8]">[DIAGNÓSTICO EN ESPERA]</span>}
              </div>
              <SpeakerButton 
                textToSpeak={activeLog}
                label="Escuchar Diagnóstico"
              />
            </div>
            {activeLog}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-[#8F8CA8]">
              {isComplete ? (
                <span className="text-[#4FD1C5] font-semibold">
                  ✓ ¡Encontraste las 3 fallas de la IA! El informe está listo para presentar ante el Consejo.
                </span>
              ) : (
                <span>Toca los círculos para descubrir las 3 fallas que delatan a la IA ({realEvidenceFound}/3 encontradas).</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  speech.stop();
                  onCancelScan();
                }}
                className="px-3 py-1.5 rounded-xs border border-[#5E4FA2] text-[#EDEBFA] hover:text-[#E86AA8] hover:border-[#E86AA8] text-xs font-medium transition-colors cursor-pointer"
              >
                Volver
              </button>

              <button
                onClick={() => {
                  speech.stop();
                  onCompleteScan();
                }}
                disabled={!isComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-xs font-bold text-xs uppercase tracking-wider transition-all ${
                  isComplete
                    ? 'bg-[#4FD1C5] hover:bg-[#6fe4d9] text-[#0B0B1A] shadow-[0_0_15px_rgba(79,209,197,0.4)] cursor-pointer'
                    : 'bg-[#1C2033] text-[#555B77] border border-[#2B314F] cursor-not-allowed'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Guardar Prueba #3 y Continuar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
