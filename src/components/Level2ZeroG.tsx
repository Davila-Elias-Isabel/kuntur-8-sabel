import React, { useState, useEffect } from 'react';
import { CharacterPortrait } from './CharacterPortraits';
import { ZeroGChaseMinigame } from './ZeroGChaseMinigame';
import { PlayerGender, ClueItem } from '../types/game';
import { sound } from '../services/audio';
import { Rocket, ShieldCheck, ArrowRight, Lightbulb, Info } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { speech } from '../services/speech';

interface Level2ZeroGProps {
  gender: PlayerGender;
  onCompleteLevel: (clue: ClueItem) => void;
  onOpenGlossary: () => void;
}

export const Level2ZeroG: React.FC<Level2ZeroGProps> = ({
  gender,
  onCompleteLevel,
  onOpenGlossary
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  // Strictly cancel speech on unmount, and auto-narrate level 2 instructions if enabled
  useEffect(() => {
    if (speech.isAutoRead()) {
      const timer = setTimeout(() => {
        speech.speak(
          "Atención cadete. Nivel dos: Hangar en Gravedad Cero. Tu misión es volar con las flechas del teclado o teclas W-A-S-D. Acércate al dron y tócalo para atraparlo antes de que se acabe el tiempo.",
          { isGalactic: true, prependChime: true, context: 'level_2' }
        );
      }, 350);
      return () => {
        clearTimeout(timer);
        speech.stop();
      };
    }
    return () => {
      speech.stop();
    };
  }, []);

  const clueItem: ClueItem = {
    id: 'clue_drone',
    name: 'Tarjeta de Memoria del Dron Espía',
    colloquialName: 'Fotografías Originales Sin Editar',
    category: 'fotos_base',
    icon: 'Camera',
    whatItIs: 'Guarda las fotos reales de Vale en el taller tomadas a escondidas para fabricar el video falso.',
    howItHelpsInCouncil: 'Demuestra que Diego espió a Vale para crear el montaje.',
    unlocked: true
  };

  const handleSuccess = () => {
    sound.playScanSuccess();
    setIsPlaying(false);
    setCompleted(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#12122A] border-2 border-[#5E4FA2] rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col my-auto relative">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-[#E86AA8]/20 text-[#E86AA8] font-mono-tech font-bold text-xs rounded-xs">
            NIVEL 2 DE 5
          </span>
          <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA]">
            HANGAR EN GRAVEDAD CERO // PERSECUCIÓN DEL DRON ESPÍA
          </h2>
        </div>

        <button
          onClick={onOpenGlossary}
          className="text-xs text-[#F2B544] hover:text-white flex items-center gap-1 font-mono-tech underline cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>¿Qué son los Metadatos y el sistema RCS?</span>
        </button>
      </div>

      {!completed ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-[#181838] p-3 rounded-xs border border-[#5E4FA2]/40">
            <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="firm" size={60} />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-tech font-bold text-[#E86AA8]">
                  {playerName.toUpperCase()} // MOCHILA PROPULSORA
                </span>
                <SpeakerButton 
                  textToSpeak="Ese microdron espía tiene las fotos de Vale! Atrápalo antes de que escape por la compuerta!"
                  label="Escuchar"
                />
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-snug">
                «¡Ese microdron espía tiene las fotos de Vale! ¡Atrápalo antes de que escape por la compuerta!»
              </p>
            </div>
          </div>

          {/* Galactic Mission Guide for 10-year-olds */}
          <div className="bg-[#0C0C22] p-3 rounded-xs border-l-4 border-[#E86AA8] flex items-center justify-between flex-wrap gap-2 text-xs font-mono-tech">
            <div className="flex items-center gap-2 text-[#EDEBFA]">
              <span className="text-base">🛰️</span>
              <span><strong>QUÉ TIENES QUE HACER:</strong> Vuela con las flechas o teclas W-A-S-D. ¡Acércate al dron y tócalo para atraparlo antes de que escape!</span>
            </div>
            <SpeakerButton 
              onCustomSpeak={() => {
                speech.speak("Atención cadete. Tu misión es volar con las flechas del teclado o teclas W-A-S-D. Acércate al dron y tócalo para atraparlo antes de que se acabe el tiempo.");
              }}
              label="🛰️ Guía Galáctica"
              className="bg-[#E86AA8]/20 text-[#E86AA8] border-[#E86AA8]"
            />
          </div>

          {/* Quick Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech">
            <div className="bg-[#12122A] p-2.5 rounded-xs border border-[#E86AA8]/40 text-[#EDEBFA] flex items-center gap-2">
              <span className="text-base">🕹️</span>
              <span><strong>Controles:</strong> Flechas / WASD para moverte | <strong>Espacio</strong> para frenar</span>
            </div>
            <div className="bg-[#12122A] p-2.5 rounded-xs border border-[#4FD1C5]/40 text-[#EDEBFA] flex items-center gap-2">
              <span className="text-base">⭐</span>
              <span><strong>Tu recompensa:</strong> Le quitas la tarjeta de memoria con las fotos robadas</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              speech.stop();
              setIsPlaying(true);
            }}
            className="w-full py-2.5 bg-[#E86AA8] hover:bg-[#ff7ebc] text-[#0B0B1A] font-extrabold font-mono-tech text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <Rocket className="w-4 h-4" />
            <span>ACTIVAR PROPULSORES // ¡ATRAPAR EL DRON!</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#0D2426] border-2 border-[#4FD1C5] p-4 rounded-xs text-center space-y-2">
            <div className="text-[#4FD1C5] font-mono-tech font-bold text-sm tracking-wider flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>¡DRON INTERCEPTADO! // PRUEBA #2 ASEGURADA</span>
            </div>
            <div className="p-3 bg-[#0A1A1C] border border-[#4FD1C5]/40 rounded-xs text-left max-w-lg mx-auto">
              <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech">
                {clueItem.name} ({clueItem.colloquialName})
              </div>
              <p className="text-xs text-[#EDEBFA] mt-1">
                {clueItem.whatItIs}
              </p>
              <p className="text-[11px] text-[#F2B544] mt-1">
                📌 <strong>Importancia para el Consejo:</strong> {clueItem.howItHelpsInCouncil}
              </p>
            </div>
          </div>

          {/* Alarm alert for Level 3 */}
          <div className="flex items-start gap-4 bg-[#260C14] p-4 rounded-xs border-2 border-[#D7263D] animate-pulse">
            <CharacterPortrait type="eco" mood="critical" size={64} />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech font-bold text-[#D7263D]">
                  ¡NOTIFICACIÓN EN LA RED DE COMUNICACIONES! // CUENTA «EL ECO»
                </span>
                <SpeakerButton 
                  textToSpeak="Alerta general en los dispositivos: Atención tripulación, revisen la grabación de la jefa Vale en el sector tres. La difusión masiva ha comenzado y varios cadetes piden reenviar el archivo."
                  label="Escuchar Alerta"
                  className="bg-[#D7263D]/20 text-[#D7263D] border-[#D7263D]"
                />
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
                ¡BZZZT! Se activa una alerta general en los dispositivos de la base: <em>«Atención tripulación: revisen la grabación de la jefa Vale comprometiendo la seguridad del sector 3»</em>. La difusión masiva ha comenzado y varios cadetes piden reenviar el archivo.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              speech.stop();
              onCompleteLevel(clueItem);
            }}
            className="w-full py-3 bg-[#D7263D] hover:bg-[#ff445c] text-white font-extrabold font-mono-tech text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <span>INGRESAR AL LABORATORIO FORENSE Y ANALIZAR EL MONTAJE</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Minigame Modal */}
      {isPlaying && (
        <ZeroGChaseMinigame
          onSuccess={handleSuccess}
          onClose={() => setIsPlaying(false)}
        />
      )}

    </div>
  );
};
