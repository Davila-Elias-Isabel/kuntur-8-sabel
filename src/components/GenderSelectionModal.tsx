import React from 'react';
import { PlayerGender } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { Shield, User } from 'lucide-react';
import { sound } from '../services/audio';

interface GenderSelectionModalProps {
  onSelect: (gender: PlayerGender) => void;
  onOpenPedagogy: () => void;
}

export const GenderSelectionModal: React.FC<GenderSelectionModalProps> = ({
  onSelect,
  onOpenPedagogy
}) => {
  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#15152E] border-2 border-[#5E4FA2] shadow-2xl rounded-sm p-5 sm:p-7 flex flex-col items-center text-center">
        
        {/* Title & Badge */}
        <div className="mb-3">
          <div className="text-[11px] font-mono-tech font-bold text-[#4FD1C5] tracking-widest uppercase mb-1">
            Simulación Narrativa e Interactiva en 5 Niveles
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-[#E86AA8] font-mono-tech">
            KUNTUR
          </h1>
          <h2 className="text-sm sm:text-base font-bold text-[#4FD1C5] mt-0.5">
            «TU SEÑAL IMPORTA»
          </h2>
        </div>

        {/* Story context & Rules - Punchy and didactic */}
        <div className="w-full max-w-lg bg-[#0C0C22] p-3.5 border border-[#5E4FA2]/50 rounded-xs text-left mb-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E86AA8] font-mono-tech">
            <span className="text-sm">🚨</span>
            <span>MISIÓN ESPACIAL // CASO DE CIBERACOSO</span>
          </div>
          <p className="text-xs sm:text-sm text-[#EDEBFA] leading-snug">
            Alguien difundió un <strong>video falso hecho con IA (Deepfake)</strong> para atacar a <strong>Vale</strong>, la mejor ingeniera del equipo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-tech pt-1">
            <div className="bg-[#14122E] p-2 rounded-xs border-l-3 border-[#4FD1C5] text-[#EDEBFA]">
              <span className="text-[#4FD1C5] font-bold">🎯 TU OBJETIVO:</span> Encontrar las pruebas y frenar el chisme.
            </div>
            <div className="bg-[#14122E] p-2 rounded-xs border-l-3 border-[#F2B544] text-[#EDEBFA]">
              <span className="text-[#F2B544] font-bold">⚠️ REGLA DE ORO:</span> Reírte o reenviar resta vidas. ¡Defender suma puntos!
            </div>
          </div>
        </div>

        {/* Character Gender Selector */}
        <div className="w-full mb-4">
          <div className="text-xs font-mono-tech font-bold text-[#EDEBFA] mb-2.5 flex items-center justify-center gap-2">
            <User className="w-4 h-4 text-[#4FD1C5]" />
            <span>ELIGE A TU PERSONAJE:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ale Hombre */}
            <button
              onClick={() => {
                sound.playBlip();
                sound.startMusic();
                onSelect('hombre');
              }}
              className="p-3 bg-[#101026] hover:bg-[#1C1838] border-2 border-[#5E4FA2] hover:border-[#4FD1C5] rounded-xs flex items-center gap-3 transition-all cursor-pointer group shadow-lg text-left"
            >
              <CharacterPortrait type="ale_hombre" mood="neutral" size={56} />
              <div>
                <div className="text-sm font-bold text-[#EDEBFA] group-hover:text-[#4FD1C5] font-mono-tech">
                  ALEX (HOMBRE)
                </div>
                <div className="text-[11px] text-[#A6A2C5] mt-0.5">
                  Cadete de comunicaciones. No apoya bromas pesadas y defiende la verdad con pruebas.
                </div>
              </div>
            </button>

            {/* Ale Mujer */}
            <button
              onClick={() => {
                sound.playBlip();
                sound.startMusic();
                onSelect('mujer');
              }}
              className="p-3 bg-[#101026] hover:bg-[#1C1838] border-2 border-[#5E4FA2] hover:border-[#E86AA8] rounded-xs flex items-center gap-3 transition-all cursor-pointer group shadow-lg text-left"
            >
              <CharacterPortrait type="ale_mujer" mood="neutral" size={56} />
              <div>
                <div className="text-sm font-bold text-[#EDEBFA] group-hover:text-[#E86AA8] font-mono-tech">
                  ALEXIA (MUJER)
                </div>
                <div className="text-[11px] text-[#A6A2C5] mt-0.5">
                  Cadete de comunicaciones. Frena el acoso a tiempo y apoya a su compañera en equipo.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Secondary Links: Pedagogy Guide */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenPedagogy}
            className="text-xs text-[#8F8CA8] hover:text-[#4FD1C5] underline font-mono-tech flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Guía didáctica y protocolo para escuelas (Perú)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
