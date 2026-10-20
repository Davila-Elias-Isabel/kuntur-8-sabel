import React, { useState } from 'react';
import { CharacterPortrait } from './CharacterPortraits';
import { ShipFlightMinigame } from './ShipFlightMinigame';
import { PlayerGender, ClueItem } from '../types/game';
import { sound } from '../services/audio';
import { ShieldCheck, ArrowRight, Lightbulb, Zap, Rocket, Info } from 'lucide-react';

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

  const clueItem: ClueItem = {
    id: 'clue_antenna',
    name: 'Rastreo de Antenas // Firma de IP de Diego',
    colloquialName: 'Huella de Red del Responsable',
    category: 'ip_culpable',
    icon: 'Radio',
    whatItIs: 'Al neutralizar las 3 antenas repetidoras, el cortafuegos de telecomunicaciones interceptó el paquete de transmisión original: provino de la dirección IP privada asignada al terminal del Casillero 2, correspondiente a Diego.',
    howItHelpsInCouncil: 'Impide que Diego alegue que la cuenta «El Eco» era de un remitente externo desconocido.',
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
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-[#181838] p-4 rounded-xs border border-[#5E4FA2]/40">
            <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="firm" size={72} />
            <div className="space-y-1">
              <div className="text-xs font-mono-tech font-bold text-[#E86AA8]">
                {playerName.toUpperCase()} // AL MANDO DE LA NAVE INTERCEPTORA KUNTUR
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
                «El remitente clandestino vinculó su canal a <strong>3 antenas repetidoras</strong> situadas en el cinturón de escombros de la estación. Si la difusión satelital alcanza el 100%, el archivo será descargado en todos los terminales de la Tierra y la flota. Debo maniobrar la nave esquivando los asteroides y disparar pulsos electromagnéticos a las tres torres para interrumpir la retransmisión e interceptar la IP de origen.»
              </p>
            </div>
          </div>

          {/* Technical Explanation on IP and Repeater Towers */}
          <div className="bg-[#0C0C22] p-3.5 rounded-xs border-l-4 border-[#E86AA8] text-xs text-[#EDEBFA] space-y-1">
            <div className="font-bold text-[#E86AA8] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#E86AA8]" />
              ¿Por qué es crucial cortar las antenas y cómo opera la Firma de IP?:
            </div>
            <p>
              Una <strong>antena repetidora</strong> replica y amplifica señales débiles para acelerar su alcance masivo. Al derribar los 3 enlaces con pulsos EMP, se captura la <strong>Firma de IP</strong> (la dirección de red del emisor). Esta información constituye la <strong>Prueba #4 (Identidad del emisor)</strong>, eliminando el velo del anonimato digital.
            </p>
            <div className="text-[#A6A2C5] text-[11px] pt-1">
              🎮 <strong>Mecánica:</strong> Usa <strong>[W, S]</strong> o las flechas <strong>Arriba / Abajo</strong> para maniobrar la nave verticalmente. Presiona <strong>[Espacio]</strong> para disparar ráfagas de pulso a los asteroides y a las 3 torres repetidoras.
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
            <span>DESPEGAR NAVE INTERCEPTORA // INICIAR MISIÓN DE VUELO</span>
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
            <div className="space-y-1">
              <div className="text-xs font-mono-tech font-bold text-[#4FD1C5]">
                COMANDANTE ROSA // ORDEN DE AUDIENCIA URGENTE
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
                «Cadetes: El cadete Diego ha solicitado formalmente mi comparecencia en la Sala de Mando para exigir la remoción inmediata de la ingeniera Vale. Ale, Vale: preséntense en este instante ante el tribunal del Consejo. Si cuentan con pruebas periciales que aclaren lo sucedido, este es el momento procesal para presentarlas.»
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
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
