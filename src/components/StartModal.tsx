import React from 'react';
import { Play, BookOpen, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sound } from '../services/audio';

interface StartModalProps {
  onStart: () => void;
  onOpenPedagogy: () => void;
}

export const StartModal: React.FC<StartModalProps> = ({ onStart, onOpenPedagogy }) => {
  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#15152E] border-2 border-[#5E4FA2] shadow-2xl rounded-sm p-6 sm:p-8 flex flex-col items-center text-center">
        
        {/* Title & Tagline */}
        <div className="mb-4">
          <div className="text-[11px] font-mono-tech font-bold text-[#4FD1C5] tracking-widest uppercase mb-1">
            Simulador de Decisión Ética // Base Orbital de Rescate
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-[#E86AA8] font-mono-tech">
            KUNTUR
          </h1>
          <h2 className="text-sm sm:text-base font-semibold text-[#4FD1C5] mt-1 tracking-wider">
            «TU SEÑAL IMPORTA»
          </h2>
        </div>

        {/* Sensitive Content Warning */}
        <div className="w-full bg-[#D7263D]/10 border-l-4 border-[#D7263D] p-3.5 mb-5 text-left rounded-xs">
          <div className="flex items-center gap-2 text-[#D7263D] font-bold text-xs font-mono-tech mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>AVISO DE CONTENIDO SENSIBLE Y MARCO ÉTICO</span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#EDEBFA]/90 leading-relaxed">
            Esta experiencia educativa aborda la Violencia de Género Facilitada por la Tecnología (TFGBV), el acoso distribuido mediante imágenes sintéticas manipuladas (deepfakes/holofakes) y el rol crucial del <strong>testigo activo</strong>. Todas las representaciones de material agraviante son estrictamente abstractas y simbólicas (sin cuerpos humanos ni revictimización).
          </p>
        </div>

        {/* Narrative Pitch */}
        <div className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed mb-6 max-w-lg">
          Controlas a <strong>Ale</strong>, cadete de comunicaciones en la estación orbital KUNTUR. Cuando un archivo difamatorio generado con IA inunda la red de la dotación contra <strong>Vale</strong>, tus decisiones determinarán si el acoso se normaliza en el silencio o si se activa una red de protección ética colectiva.
        </div>

        {/* Controls Info */}
        <div className="w-full grid grid-cols-2 gap-3 bg-[#0C0C22] p-3 border border-[#5E4FA2]/40 rounded-xs mb-6 text-xs text-[#8F8CA8]">
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#EDEBFA] mb-0.5 font-mono-tech">MOVIMIENTO:</span>
            <span>Teclas [WASD] o Flechas</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#EDEBFA] mb-0.5 font-mono-tech">INTERACCIÓN:</span>
            <span>[Espacio], [E] o Botones Táctiles</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            onClick={() => {
              sound.startAmbient();
              sound.playBlip();
              onStart();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#4FD1C5] hover:bg-[#6fe4d9] text-[#0B0B1A] font-extrabold text-xs uppercase tracking-widest rounded-xs transition-all shadow-[0_0_15px_rgba(79,209,197,0.4)] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Inicializar Protocolo
          </button>

          <button
            onClick={onOpenPedagogy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 border border-[#5E4FA2] hover:border-[#E86AA8] text-[#EDEBFA] hover:text-[#E86AA8] font-bold text-xs uppercase tracking-wider rounded-xs transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Guía Didáctica Universitaria
          </button>
        </div>

      </div>
    </div>
  );
};
