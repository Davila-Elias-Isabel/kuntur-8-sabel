import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';

interface VirtualDPadProps {
  onDirection: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onInteract: () => void;
  canInteract: boolean;
}

export const VirtualDPad: React.FC<VirtualDPadProps> = ({
  onDirection,
  onInteract,
  canInteract
}) => {
  return (
    <div className="flex items-center justify-between gap-4 p-2 bg-[#0E0E22]/90 border border-[#5E4FA2]/40 rounded-md backdrop-blur-md">
      {/* Direction Cross */}
      <div className="grid grid-cols-3 gap-1 w-28 h-28 p-1">
        <div />
        <button
          onClick={() => onDirection('up')}
          className="bg-[#1C1C38] active:bg-[#4FD1C5] text-[#EDEBFA] active:text-[#0B0B1A] border border-[#5E4FA2] rounded-xs flex items-center justify-center p-2"
          aria-label="Mover hacia arriba"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div />

        <button
          onClick={() => onDirection('left')}
          className="bg-[#1C1C38] active:bg-[#4FD1C5] text-[#EDEBFA] active:text-[#0B0B1A] border border-[#5E4FA2] rounded-xs flex items-center justify-center p-2"
          aria-label="Mover a la izquierda"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="bg-[#0B0B1A] rounded-xs flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#5E4FA2]" />
        </div>

        <button
          onClick={() => onDirection('right')}
          className="bg-[#1C1C38] active:bg-[#4FD1C5] text-[#EDEBFA] active:text-[#0B0B1A] border border-[#5E4FA2] rounded-xs flex items-center justify-center p-2"
          aria-label="Mover a la derecha"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <div />
        <button
          onClick={() => onDirection('down')}
          className="bg-[#1C1C38] active:bg-[#4FD1C5] text-[#EDEBFA] active:text-[#0B0B1A] border border-[#5E4FA2] rounded-xs flex items-center justify-center p-2"
          aria-label="Mover hacia abajo"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <div />
      </div>

      {/* Action Button */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={onInteract}
          disabled={!canInteract}
          className={`w-20 h-20 rounded-full flex flex-col items-center justify-center font-mono-tech text-xs font-bold transition-all ${
            canInteract
              ? 'bg-[#4FD1C5] text-[#0B0B1A] border-2 border-white shadow-[0_0_15px_#4FD1C5] animate-pulse cursor-pointer'
              : 'bg-[#1A1A30] text-[#555B77] border border-[#3A3A5A] cursor-not-allowed'
          }`}
        >
          <CornerDownLeft className="w-5 h-5 mb-0.5" />
          <span>HABLAR</span>
        </button>
        <span className="text-[10px] text-[#8F8CA8] font-mono-tech">[Espacio o E]</span>
      </div>
    </div>
  );
};
