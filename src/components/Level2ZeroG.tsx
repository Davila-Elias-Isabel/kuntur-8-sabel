import React, { useState } from 'react';
import { CharacterPortrait } from './CharacterPortraits';
import { ZeroGChaseMinigame } from './ZeroGChaseMinigame';
import { PlayerGender, ClueItem } from '../types/game';
import { sound } from '../services/audio';
import { Rocket, ShieldCheck, ArrowRight, Lightbulb, Info } from 'lucide-react';

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

  const clueItem: ClueItem = {
    id: 'clue_drone',
    name: 'Tarjeta de Memoria del Dron Espía',
    colloquialName: 'Fotografías Originales Sin Alterar',
    category: 'fotos_base',
    icon: 'Camera',
    whatItIs: 'El módulo de almacenamiento del microdron. Guarda las fotos reales de Vale tomadas a escondidas en el taller, las cuales fueron empleadas para recortar su rostro y montar el video falso.',
    howItHelpsInCouncil: 'Demuestra ante la Comandante Rosa que existió espionaje previo y premeditación deliberada para atacarla.',
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
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-[#181838] p-4 rounded-xs border border-[#5E4FA2]/40">
            <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="firm" size={72} />
            <div className="space-y-1">
              <div className="text-xs font-mono-tech font-bold text-[#E86AA8]">
                {playerName.toUpperCase()} // EQUIPÁNDOSE LA MOCHILA PROPULSORA RCS
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
                «El microdron intenta escapar hacia la compuerta de despresurización del hangar. En gravedad cero no hay rozamiento del aire: cada impulso me desplaza continuamente por inercia. Debo calcular bien la trayectoria, esquivar los contenedores magnéticos y alcanzar al dron a menos de 36 metros antes de que se pierda en el vacío.»
              </p>
            </div>
          </div>

          {/* Technical and Narrative Context Box */}
          <div className="bg-[#0C0C22] p-3.5 rounded-xs border-l-4 border-[#E86AA8] text-xs text-[#EDEBFA] space-y-1">
            <div className="font-bold text-[#E86AA8] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#E86AA8]" />
              ¿Por qué es fundamental interceptar este microdron en la trama?:
            </div>
            <p>
              El agresor utilizó este dron con cámara oculta para vigilar a Vale. En los <strong>metadatos</strong> de su memoria están las capturas reales con fecha de creación previa al montaje. Recuperar esta tarjeta nos da la <strong>Prueba #2 (Fotos originales)</strong> para comprobar que el video viral fue manipulado artificialmente.
            </p>
            <div className="text-[#A6A2C5] text-[11px] pt-1">
              🎮 <strong>Mecánica:</strong> Usa las flechas de dirección o <strong>W, A, S, D</strong> para activar los propulsores RCS. Presiona <strong>[Espacio]</strong> para activar el retrofreno estabilizador.
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              setIsPlaying(true);
            }}
            className="w-full py-3 bg-[#E86AA8] hover:bg-[#ff7ebc] text-[#0B0B1A] font-extrabold font-mono-tech text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <Rocket className="w-4 h-4" />
            <span>ACTIVAR PROPULSORES // INICIAR PERSECUCIÓN EN GRAVEDAD CERO</span>
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
            <div className="space-y-1">
              <div className="text-xs font-mono-tech font-bold text-[#D7263D]">
                ¡NOTIFICACIÓN EN LA RED DE COMUNICACIONES! // CUENTA «EL ECO»
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
                ¡BZZZT! Se activa una alerta general en los dispositivos de la base: <em>«Atención tripulación: revisen la grabación de la jefa Vale comprometiendo la seguridad del sector 3»</em>. La difusión masiva ha comenzado y varios cadetes piden reenviar el archivo.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
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
