import React from 'react';
import { AlertOctagon, RotateCcw, HeartCrack, BookOpen, Info } from 'lucide-react';
import { DecisionLogEntry, PlayerGender } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { sound } from '../services/audio';

interface GameOverModalProps {
  gender: PlayerGender;
  decisionLog: DecisionLogEntry[];
  onRetryLevel: () => void;
  onRestartAll: () => void;
  onOpenPedagogy: () => void;
  onOpenReflectionNotes?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gender,
  decisionLog,
  onRetryLevel,
  onRestartAll,
  onOpenPedagogy,
  onOpenReflectionNotes
}) => {
  const toxicDecisions = decisionLog.filter(d => d.isToxic);

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#180C14] border-2 border-[#D7263D] shadow-2xl rounded-sm p-5 sm:p-7 flex flex-col items-center my-auto">
        
        {/* Banner */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#D7263D]/20 border border-[#D7263D] rounded-xs text-[#D7263D] font-mono-tech text-xs font-bold tracking-widest mb-3">
          <AlertOctagon className="w-4 h-4" />
          <span>SIMULACIÓN INTERRUMPIDA // CADETE DADO DE BAJA</span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <CharacterPortrait 
            type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} 
            mood="critical" 
            size={64} 
          />
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D7263D] font-mono-tech">
              EXPULSADO DE LA BASE KUNTUR
            </h1>
            <p className="text-xs text-[#EDEBFA]/80">
              Tus comentarios y elecciones avalaron la violencia de género digital contra Vale.
            </p>
          </div>
        </div>

        {/* Narrative explanation */}
        <div className="w-full bg-[#24101A] border-l-4 border-[#D7263D] p-3.5 my-4 rounded-xs text-xs text-[#EDEBFA] leading-relaxed text-left space-y-2">
          <p className="font-semibold text-[#F2B544] flex items-center gap-1.5">
            <HeartCrack className="w-4 h-4 text-[#D7263D]" />
            ¿Por qué se perdieron los puntos y concluyó la partida?:
          </p>
          <p>
            En la base KUNTUR —de la misma forma que en centros educativos, universidades y espacios de trabajo— el acoso digital se sostiene cuando <strong>los espectadores eligen reírse, solicitar el reenvío de imágenes íntimas o emitir comentarios machistas</strong> como <em>«por algo será»</em> o <em>«las mujeres no están capacitadas para este puesto»</em>.
          </p>
          <p className="text-[#A6A2C5]">
            Al escoger esas respuestas, aislaste a Vale, destruiste el entorno seguro que requería para denunciar y legitimaste el hostigamiento del agresor. La complicidad activa o pasiva con la violencia digital tiene consecuencias éticas e institucionales severas.
          </p>
        </div>

        {/* Decisions breakdown that led to game over */}
        {toxicDecisions.length > 0 && (
          <div className="w-full text-left my-2 space-y-2">
            <div className="text-[11px] font-mono-tech font-bold text-[#D7263D] uppercase">
              Respuestas que redujeron tus puntos de empatía y vidas:
            </div>
            {toxicDecisions.map((entry, idx) => (
              <div key={idx} className="bg-[#12080E] p-3 border border-[#D7263D]/40 rounded-xs text-xs space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#8F8CA8] font-bold">{entry.levelTitle}:</span>
                  <span className="text-[#D7263D] font-bold font-mono-tech">{entry.pointsDelta} pts</span>
                </div>
                <div className="text-[#EDEBFA] italic">
                  «{entry.chosenComment}»
                </div>
                <div className="text-[11px] text-[#F2B544] pt-1">
                  ⚠️ <strong>Por qué genera daño:</strong> {entry.whyThisMatters}
                </div>
                <div className="text-[10px] text-[#8F8CA8]">
                  Consecuencia real: {entry.realWorldImpact}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full pt-4 mt-2 border-t border-[#D7263D]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {onOpenReflectionNotes && (
              <button
                onClick={onOpenReflectionNotes}
                className="text-xs text-[#F2B544] hover:text-[#FFE3A0] underline font-mono-tech flex items-center gap-1.5 cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>Notitas Pedagógicas y Dudas</span>
              </button>
            )}
            <button
              onClick={onOpenPedagogy}
              className="text-xs text-[#8F8CA8] hover:text-[#4FD1C5] underline font-mono-tech flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Guía didáctica 5D</span>
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playBlip();
                onRetryLevel();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-[#D7263D] hover:bg-[#ff3b55] text-white font-bold font-mono-tech text-xs rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reintentar este Nivel con Empatía
            </button>
            <button
              onClick={() => {
                sound.playBlip();
                onRestartAll();
              }}
              className="px-3 py-2 border border-[#5E4FA2] hover:border-[#EDEBFA] text-[#8F8CA8] hover:text-white font-mono-tech text-xs rounded-xs cursor-pointer"
            >
              Reiniciar Simulación
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
