import React from 'react';
import { PlayerGender } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { Shield, User, HeartHandshake, Info } from 'lucide-react';
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

        {/* Story context & Rules */}
        <div className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed mb-5 max-w-lg bg-[#0C0C22] p-4 border border-[#5E4FA2]/40 rounded-xs text-left space-y-2">
          <p>
            Te damos la bienvenida a la base espacial Kuntur. En esta misión asumes el rol de <strong>Ale</strong>, cadete de telecomunicaciones. Tu compañera de escuadrón, <strong>Vale</strong>, es una destacada ingeniera que acaba de ser promovida por sus méritos técnicos. Sin embargo, un compañero resentido ha difundido un video falso generado con Inteligencia Artificial (un <em>deepfake</em> o <em>holofake</em>) para desacreditarla ante la tripulación.
          </p>
          <div className="bg-[#181126] p-2.5 rounded-xs border-l-2 border-[#F2B544] text-[11px] text-[#F2B544] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#F2B544] shrink-0 mt-0.5" />
            <div>
              <strong>Regla fundamental:</strong> Tus comentarios y elecciones suman o restan puntos de empatía y vidas. Si apoyas comentarios machistas, te sumas a las burlas o reenvías el video, <strong>la simulación termina por complicidad</strong>. Si actúas con criterio y reúnes las pruebas técnicas, ayudarás a Vale y resolverás el caso.
            </div>
          </div>
        </div>

        {/* Character Gender Selector */}
        <div className="w-full mb-5">
          <div className="text-xs font-mono-tech font-bold text-[#EDEBFA] mb-3 flex items-center justify-center gap-2">
            <User className="w-4 h-4 text-[#4FD1C5]" />
            <span>SELECCIONA TU IDENTIDAD COMO CADETE ALE:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Ale Hombre */}
            <button
              onClick={() => {
                sound.playBlip();
                sound.startMusic();
                onSelect('hombre');
              }}
              className="p-3.5 bg-[#101026] hover:bg-[#1C1838] border-2 border-[#5E4FA2] hover:border-[#4FD1C5] rounded-xs flex items-center gap-3 transition-all cursor-pointer group shadow-lg text-left"
            >
              <CharacterPortrait type="ale_hombre" mood="neutral" size={64} />
              <div>
                <div className="text-sm font-bold text-[#EDEBFA] group-hover:text-[#4FD1C5] font-mono-tech">
                  ALEX (HOMBRE)
                </div>
                <div className="text-[11px] text-[#8F8CA8] mt-0.5">
                  Cadete de comunicaciones. Decides no avalar chistes descalificadores ni comentarios machistas, respaldando la verdad con pruebas.
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
              className="p-3.5 bg-[#101026] hover:bg-[#1C1838] border-2 border-[#5E4FA2] hover:border-[#E86AA8] rounded-xs flex items-center gap-3 transition-all cursor-pointer group shadow-lg text-left"
            >
              <CharacterPortrait type="ale_mujer" mood="neutral" size={64} />
              <div>
                <div className="text-sm font-bold text-[#EDEBFA] group-hover:text-[#E86AA8] font-mono-tech">
                  ALEXIA (MUJER)
                </div>
                <div className="text-[11px] text-[#8F8CA8] mt-0.5">
                  Cadete de comunicaciones. Te solidarizas con tu colega, frenas el acoso digital a tiempo y analizas las pruebas en equipo.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Secondary Pedagogy Guide link */}
        <button
          onClick={onOpenPedagogy}
          className="text-xs text-[#8F8CA8] hover:text-[#4FD1C5] underline font-mono-tech flex items-center gap-1.5 cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Ver marco conceptual sobre violencia digital de género (UNESCO 2024 / Perú)</span>
        </button>

      </div>
    </div>
  );
};
