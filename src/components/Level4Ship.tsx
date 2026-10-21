import React, { useState, useEffect } from 'react';
import { CharacterPortrait } from './CharacterPortraits';
import { ShipFlightMinigame } from './ShipFlightMinigame';
import { PlayerGender, ClueItem } from '../types/game';
import { sound } from '../services/audio';
import { ShieldCheck, ArrowRight, Lightbulb, Zap, Rocket, Info } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { speech } from '../services/speech';

interface Level4ShipProps {
  gender: PlayerGender;
  onCompleteLevel: (clue: ClueItem) => void;
  onOpenGlossary: () => void;
}

export const Level4Ship: React.FC<Level4ShipProps> = ({
  gender,
  onCompleteLevel,
  onOpenGlossary
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  // Strictly cancel speech on unmount, and auto-narrate level 4 instructions if enabled
  useEffect(() => {
    if (speech.isAutoRead()) {
      const timer = setTimeout(() => {
        speech.speak(
          "Atención piloto espacial. Nivel cuatro: Carrera en Nave Espacial. Tu nave KUNTUR tiene que destruir las tres antenas repetidoras. Muévete arriba y abajo con las flechas del teclado y presiona la barra de espacio para disparar.",
          { isGalactic: true, prependChime: true, context: 'level_4' }
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
    id: 'clue_antenna',
    name: 'Rastreo de Antenas // Firma de IP de Diego',
    colloquialName: 'Huella Digital del Responsable',
    category: 'ip_culpable',
    icon: 'Radio',
    whatItIs: 'Al cortar las antenas, el sistema atrapó la dirección IP exacta: el video salió directo del dispositivo de Diego.',
    howItHelpsInCouncil: 'Prueba que Diego fue quien subió y difundió el video difamatorio.',
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
            NIVEL 4 DE 5
          </span>
          <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA]">
            VUELO ESPACIAL EN NAVE // CORTAR LA TRANSMISIÓN DEL ECO
          </h2>
        </div>

        <button
          onClick={onOpenGlossary}
          className="text-xs text-[#F2B544] hover:text-white flex items-center gap-1 font-mono-tech underline cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>¿Cómo funciona el rastreo de IP y las Antenas Repetidoras?</span>
        </button>
      </div>

      {!completed ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-[#181838] p-3 rounded-xs border border-[#5E4FA2]/40">
            <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="firm" size={60} />
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-tech font-bold text-[#E86AA8]">
                  {playerName.toUpperCase()} // NAVE KUNTUR
                </span>
                <SpeakerButton 
                  textToSpeak="El atacante conectó tres antenas espaciales para viralizar el video difamatorio! Pilota la nave y destrúyelas antes de que termine la subida!"
                  label="Escuchar"
                />
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-snug">
                «¡El atacante conectó <strong>3 antenas espaciales</strong> para viralizar el video! ¡Pilota la nave y destrúyelas antes de que termine la subida!»
              </p>
            </div>
          </div>

          {/* Galactic Mission Guide for 10-year-olds */}
          <div className="bg-[#0C0C22] p-3 rounded-xs border-l-4 border-[#E86AA8] flex items-center justify-between flex-wrap gap-2 text-xs font-mono-tech">
            <div className="flex items-center gap-2 text-[#EDEBFA]">
              <span className="text-base">🛰️</span>
              <span><strong>QUÉ TIENES QUE HACER:</strong> Pilota tu nave con [W, S o Flechas], esquiva los asteroides y presiona [Espacio] para disparar a las 3 antenas repetidoras.</span>
            </div>
            <SpeakerButton 
              onCustomSpeak={() => {
                speech.speak("Atención piloto espacial. Tu nave KUNTUR tiene que destruir las tres antenas repetidoras. Muévete arriba y abajo con las flechas del teclado y presiona la barra de espacio para disparar.");
              }}
              label="🛰️ Guía Galáctica"
              className="bg-[#E86AA8]/20 text-[#E86AA8] border-[#E86AA8]"
            />
          </div>

          {/* Quick Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech">
            <div className="bg-[#12122A] p-2.5 rounded-xs border border-[#E86AA8]/40 text-[#EDEBFA] flex items-center gap-2">
              <span className="text-base">🕹️</span>
              <span><strong>Controles:</strong> [Arriba / Abajo] Navegar | <strong className="text-[#F2B544]">[Espacio]</strong> Disparar</span>
            </div>
            <div className="bg-[#12122A] p-2.5 rounded-xs border border-[#4FD1C5]/40 text-[#EDEBFA] flex items-center gap-2">
              <span className="text-base">⭐</span>
              <span><strong>Tu recompensa:</strong> Rastreas la dirección de la computadora del agresor</span>
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
            <span>DESPEGAR NAVE // ¡CORTAR LA TRANSMISIÓN!</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#0D2426] border-2 border-[#4FD1C5] p-4 rounded-xs text-center space-y-2">
            <div className="text-[#4FD1C5] font-mono-tech font-bold text-sm tracking-wider flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>¡ANTENAS NEUTRALIZADAS! // PRUEBA #4 CAPTURADA</span>
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

          {/* Council Summon */}
          <div className="flex items-start gap-4 bg-[#201830] p-4 rounded-xs border-2 border-[#4FD1C5]">
            <CharacterPortrait type="rosa" mood="firm" size={64} />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech font-bold text-[#4FD1C5]">
                  COMANDANTE ROSA // ORDEN DE AUDIENCIA URGENTE
                </span>
                <SpeakerButton 
                  textToSpeak="Cadetes! Diego convocó al Consejo de emergencia para exigir la expulsión de Vale. Vengan ya a la Sala de Mando! Si tienen las pruebas para demostrar la verdad, este es el momento de presentarlas!"
                  label="Voz de Rosa"
                  className="bg-[#4FD1C5]/20 text-[#4FD1C5] border-[#4FD1C5]"
                />
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-snug">
                «¡Cadetes! Diego convocó al Consejo de emergencia para exigir la expulsión de Vale. ¡Vengan ya a la Sala de Mando! Si tienen las pruebas para demostrar la verdad, ¡este es el momento de presentarlas!»
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              speech.stop();
              onCompleteLevel(clueItem);
            }}
            className="w-full py-3.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-extrabold font-mono-tech text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <span>INGRESAR A LA SALA DEL CONSEJO // EL DUELO DE PRUEBAS (NIVEL 5)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Minigame Modal */}
      {isPlaying && (
        <ShipFlightMinigame
          onSuccess={handleSuccess}
          onClose={() => setIsPlaying(false)}
        />
      )}

    </div>
  );
};
