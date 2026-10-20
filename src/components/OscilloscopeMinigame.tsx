import React, { useState, useEffect, useRef } from 'react';
import { Radio, CheckCircle, RefreshCw, X, Sliders, Zap } from 'lucide-react';
import { sound } from '../services/audio';

interface OscilloscopeMinigameProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const OscilloscopeMinigame: React.FC<OscilloscopeMinigameProps> = ({
  onSuccess,
  onClose
}) => {
  // Target wave parameters
  const targetFreq = 4.0;
  const targetAmp = 55;
  const targetPhase = 45;

  // Player adjustable parameters
  const [playerFreq, setPlayerFreq] = useState<number>(2.5);
  const [playerAmp, setPlayerAmp] = useState<number>(30);
  const [playerPhase, setPlayerPhase] = useState<number>(0);
  const [noiseFilter, setNoiseFilter] = useState<number>(50);

  const [matchPercent, setMatchPercent] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Compute wave match percentage
  useEffect(() => {
    const freqDiff = Math.abs(playerFreq - targetFreq) / targetFreq;
    const ampDiff = Math.abs(playerAmp - targetAmp) / targetAmp;
    const phaseDiff = Math.abs(playerPhase - targetPhase) / 180;
    const noiseBonus = noiseFilter / 100;

    const rawMatch = 1 - (freqDiff * 0.45 + ampDiff * 0.35 + phaseDiff * 0.2);
    const clamped = Math.max(0, Math.min(100, Math.round(rawMatch * 100 * (0.7 + noiseBonus * 0.3))));

    setMatchPercent(clamped);

    if (clamped >= 94 && !isLocked) {
      setIsLocked(true);
      sound.playScanSuccess();
    }
  }, [playerFreq, playerAmp, playerPhase, noiseFilter, isLocked]);

  // Oscilloscope Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const draw = () => {
      time += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      // Dark oscilloscope cathode background
      ctx.fillStyle = '#060B14';
      ctx.fillRect(0, 0, w, h);

      // Oscilloscope grid lines
      ctx.strokeStyle = '#0F2338';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center crosshairs
      ctx.strokeStyle = '#1D3B5C';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      // Draw Target Signal (Golden/Cyan beacon reference wave)
      ctx.beginPath();
      ctx.strokeStyle = '#4FD1C5';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]);
      for (let x = 0; x < w; x++) {
        const rad = (x / w) * Math.PI * 2 * targetFreq + (targetPhase * Math.PI / 180) + time;
        const y = midY + Math.sin(rad) * targetAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Player Signal (Magenta / Lavender live tuned wave)
      ctx.beginPath();
      ctx.strokeStyle = isLocked ? '#4FD1C5' : '#E86AA8';
      ctx.lineWidth = isLocked ? 3 : 2;
      ctx.shadowColor = isLocked ? '#4FD1C5' : '#E86AA8';
      ctx.shadowBlur = isLocked ? 12 : 4;

      // Add noise simulation if noise filter is low
      const noiseAmp = (100 - noiseFilter) * 0.15;

      for (let x = 0; x < w; x++) {
        const noise = (Math.random() - 0.5) * noiseAmp;
        const rad = (x / w) * Math.PI * 2 * playerFreq + (playerPhase * Math.PI / 180) + time;
        const y = midY + Math.sin(rad) * playerAmp + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [playerFreq, playerAmp, playerPhase, noiseFilter, isLocked]);

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#15152E] border-2 border-[#4FD1C5] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#4FD1C5] animate-pulse" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#4FD1C5] font-mono-tech tracking-wider">
                OSCILOSCOPIO // CALIBRACIÓN DE ONDA DE VALE
              </h2>
              <div className="text-[11px] text-[#8F8CA8]">
                💡 Mueve los controles para que tu onda magenta calce exactito sobre la onda cian de Vale (&gt;94% de acople).
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#201D3D] rounded-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cathode Oscilloscope Screen */}
        <div className="relative border-2 border-[#1E3B5C] rounded-sm overflow-hidden bg-[#060B14]">
          <canvas
            ref={canvasRef}
            width={600}
            height={220}
            className="w-full h-44 sm:h-56 block"
          />

          {/* HUD Indicator inside canvas */}
          <div className="absolute top-2 left-3 flex items-center gap-2 text-[11px] font-mono-tech">
            <span className="text-[#4FD1C5] font-semibold">REF: 4.0 Hz · 55%</span>
            <span className="text-[#8F8CA8]">|</span>
            <span className={isLocked ? 'text-[#4FD1C5] font-bold' : 'text-[#E86AA8]'}>
              SINTONÍA: {playerFreq.toFixed(1)} Hz · {Math.round(playerAmp)}%
            </span>
          </div>

          <div className="absolute top-2 right-3">
            <div className={`px-2.5 py-1 rounded-xs font-mono-tech font-bold text-xs flex items-center gap-1.5 ${
              isLocked 
                ? 'bg-[#4FD1C5]/20 text-[#4FD1C5] border border-[#4FD1C5]' 
                : 'bg-[#15152E] text-[#F2B544] border border-[#F2B544]/50'
            }`}>
              {isLocked ? <CheckCircle className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              ACOPLE: {matchPercent}%
            </div>
          </div>

          {isLocked && (
            <div className="absolute inset-0 bg-[#4FD1C5]/10 flex items-center justify-center pointer-events-none">
              <span className="text-sm sm:text-base font-bold font-mono-tech text-[#4FD1C5] bg-[#0B0B1A]/90 px-4 py-2 border border-[#4FD1C5] shadow-lg tracking-widest uppercase">
                ¡ENLACE DE COMUNICACIÓN SINCRONIZADO!
              </span>
            </div>
          )}
        </div>

        {/* Interactive Controls (Sliders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0D0D24] p-3.5 border border-[#5E4FA2]/40 rounded-xs text-xs font-mono-tech">
          {/* Frecuencia Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[#EDEBFA]">
              <span>FRECUENCIA (Hz):</span>
              <span className="text-[#4FD1C5] font-bold">{playerFreq.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.1"
              value={playerFreq}
              onChange={(e) => {
                setPlayerFreq(parseFloat(e.target.value));
                sound.playBlip();
              }}
              className="accent-[#4FD1C5] cursor-pointer"
            />
          </div>

          {/* Amplitud Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[#EDEBFA]">
              <span>AMPLITUD (%):</span>
              <span className="text-[#E86AA8] font-bold">{Math.round(playerAmp)}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              step="1"
              value={playerAmp}
              onChange={(e) => {
                setPlayerAmp(parseInt(e.target.value));
                sound.playBlip();
              }}
              className="accent-[#E86AA8] cursor-pointer"
            />
          </div>

          {/* Fase Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[#EDEBFA]">
              <span>DESFASE ANGULAR (°):</span>
              <span className="text-[#F2B544] font-bold">{playerPhase}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={playerPhase}
              onChange={(e) => {
                setPlayerPhase(parseInt(e.target.value));
                sound.playBlip();
              }}
              className="accent-[#F2B544] cursor-pointer"
            />
          </div>

          {/* Filtro de Ruido Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[#EDEBFA]">
              <span>FILTRO PARÁSITO (dB):</span>
              <span className="text-[#EDEBFA] font-bold">{noiseFilter}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={noiseFilter}
              onChange={(e) => {
                setNoiseFilter(parseInt(e.target.value));
                sound.playBlip();
              }}
              className="accent-[#5E4FA2] cursor-pointer"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-[#8F8CA8]">
            {isLocked ? (
              <span className="text-[#4FD1C5] font-semibold">
                ✓ ¡Listo el pollo! Sincronización al 100%. La bitácora de Vale quedó grabada con hora exacta.
              </span>
            ) : (
              <span>Mueve la frecuencia y amplitud hasta pasar el 94% de acople.</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-[#5E4FA2] hover:border-[#E86AA8] text-xs font-medium rounded-xs text-[#EDEBFA] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                sound.playScanSuccess();
                onSuccess();
              }}
              disabled={!isLocked}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xs font-bold text-xs uppercase tracking-wider font-mono-tech transition-all ${
                isLocked
                  ? 'bg-[#4FD1C5] hover:bg-[#6fe4d9] text-[#0B0B1A] shadow-[0_0_15px_rgba(79,209,197,0.4)] cursor-pointer'
                  : 'bg-[#1C1C36] text-[#555B77] border border-[#2B2B48] cursor-not-allowed'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Guardar Bitácora en el Datapad
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
