import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, X, Search, FileText } from 'lucide-react';
import { HotspotItem } from '../types/game';
import { sound } from '../services/audio';

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
    'Haz clic sobre los puntos de muestreo en la proyección para examinar inconsistencias algorítmicas y metadatos...'
  );
  const [logStatus, setLogStatus] = useState<'neutral' | 'real' | 'fake'>('neutral');

  const realEvidenceFound = hotspots.filter(h => h.isRealAnomaly && h.examined).length;
  const isComplete = realEvidenceFound >= 3;

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
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {logStatus === 'real' && <ShieldCheck className="w-4 h-4 text-[#4FD1C5]" />}
              {logStatus === 'fake' && <AlertCircle className="w-4 h-4 text-[#F2B544]" />}
              {logStatus === 'real' && <span className="text-[#4FD1C5]">[EVIDENCIA FORENSE CONFIRMADA]</span>}
              {logStatus === 'fake' && <span className="text-[#F2B544]">[PARÁMETRO BENIGNO / DISTRACTOR]</span>}
              {logStatus === 'neutral' && <span className="text-[#8F8CA8]">[DIAGNÓSTICO EN ESPERA]</span>}
            </div>
            {activeLog}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-[#8F8CA8]">
              {isComplete ? (
                <span className="text-[#4FD1C5] font-semibold">
                  ✓ Umbral pericial alcanzado. Se generó la firma de hash para elevar la denuncia.
                </span>
              ) : (
                <span>Identifica las 3 anomalías algorítmicas entre los 5 vectores.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onCancelScan}
                className="px-3 py-1.5 rounded-xs border border-[#5E4FA2] text-[#EDEBFA] hover:text-[#E86AA8] hover:border-[#E86AA8] text-xs font-medium transition-colors"
              >
                Volver a la consola
              </button>

              <button
                onClick={onCompleteScan}
                disabled={!isComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-xs font-bold text-xs uppercase tracking-wider transition-all ${
                  isComplete
                    ? 'bg-[#4FD1C5] hover:bg-[#6fe4d9] text-[#0B0B1A] shadow-[0_0_15px_rgba(79,209,197,0.4)] cursor-pointer'
                    : 'bg-[#1C2033] text-[#555B77] border border-[#2B314F] cursor-not-allowed'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Generar reporte de denuncia formal
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
