import React, { useState } from 'react';
import { InventoryItem } from '../types/game';
import { sound } from '../services/audio';
import { CharacterPortrait } from './CharacterPortraits';
import { ShieldAlert, CheckCircle2, AlertOctagon, Sparkles, X } from 'lucide-react';

interface CouncilDebateModalProps {
  inventory: InventoryItem[];
  onVictory: () => void;
  onDefeat: () => void;
  onClose: () => void;
}

interface StatementRound {
  id: number;
  speaker: 'ortega';
  statement: string;
  subtext: string;
  correctItemId: string; // The item that shatters this lie
  rebuttalText: string;
  consequenceText: string;
}

const DEBATE_ROUNDS: StatementRound[] = [
  {
    id: 1,
    speaker: 'ortega',
    statement: '«El informe anónimo es contundente: Vale abandonó su puesto de guardia en el sector 3 y nunca estuvo en el núcleo criogénico.»',
    subtext: 'Acusación 1 de 3: Cuestionamiento de coartada temporal y presencia física.',
    correctItemId: 'item_cryo_log',
    rebuttalText: '¡FALSO! Aquí tengo la Bitácora Criogénica de Vale. Sus 400 horas de código y el registro de válvulas a 4° bajo cero tienen firma criptográfica inalterable en el mismo minuto del supuesto video.',
    consequenceText: 'El Sargento Ortega titubea y revisa la telemetría en su datapad. La acusación de abandono de puesto queda desmentida.'
  },
  {
    id: 2,
    speaker: 'ortega',
    statement: '«Aun si estuvo allí, el video .holo difundido por El Eco es nítido. Se ve claramente la silueta de Vale pactando favoritismos en el hangar.»',
    subtext: 'Acusación 2 de 3: Legitimidad visual del material sintético.',
    correctItemId: 'item_forensic_report',
    rebuttalText: '¡FALSO! El análisis forense confirma 3 anomalías algorítmicas irrebatibles: falla de iluminación perimetral de 38°, vóxeles desfasados y ruido fractal de 14.2 kHz propio de un modelo generativo no autorizado.',
    consequenceText: 'La Comandante Rosa asiente enérgica. Queda pericialmente demostrado que el video es un holofake sintético fabricado para dañar.'
  },
  {
    id: 3,
    speaker: 'ortega',
    statement: '«Toda la tropa sospechaba de ella de forma espontánea. La desconfianza en la dotación surgió de los propios cadetes, no de un complot.»',
    subtext: 'Acusación 3 de 3: Origen y espontaneidad del acoso coordinado.',
    correctItemId: 'item_diego_draft',
    rebuttalText: '¡FALSO! Recuperamos el borrador confidencial de Diego en el locker 2. Admite que fue coaccionado por un canal clandestino para difundir el rumor bajo presión de grupo y miedo al aislamiento.',
    consequenceText: 'Silencio absoluto en la sala. Diego baja la mirada y admite la verdad. La campaña de desprestigio queda completamente expuesta.'
  }
];

export const CouncilDebateModal: React.FC<CouncilDebateModalProps> = ({
  inventory,
  onVictory,
  onDefeat,
  onClose
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [objectionBanner, setObjectionBanner] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [councilTension, setCouncilTension] = useState(100); // 100 drops to 0 as lies are crushed

  const round = DEBATE_ROUNDS[currentRoundIndex];

  const handleSlamObjection = () => {
    if (!selectedItemId) {
      sound.playSignalDown();
      return;
    }

    // Play Dramatic Sound + Screen Shake
    sound.playObjection();
    setIsShaking(true);
    setObjectionBanner('¡FALSO!');

    setTimeout(() => {
      setIsShaking(false);
    }, 600);

    setTimeout(() => {
      setObjectionBanner(null);

      // Check correctness
      if (selectedItemId === round.correctItemId) {
        sound.playShatter();
        setFeedback({
          isSuccess: true,
          text: `${round.rebuttalText}\n\n>> ${round.consequenceText}`
        });
        setCouncilTension(prev => Math.max(0, prev - 34));
      } else {
        sound.playSignalDown();
        setFeedback({
          isSuccess: false,
          text: 'Ortega contraataca: «Esa prueba no contradice esta afirmación en particular. Presenta una evidencia que demuestre la mentira directa de este enunciado.»'
        });
      }
    }, 1100);
  };

  const handleNextRound = () => {
    setFeedback(null);
    setSelectedItemId(null);
    if (currentRoundIndex + 1 < DEBATE_ROUNDS.length) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      sound.playScanSuccess();
      onVictory();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md">
      <div 
        className={`w-full max-w-3xl bg-[#15152E] border-2 border-[#E86AA8] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col gap-4 relative overflow-hidden transition-transform ${
          isShaking ? 'scale-105 ring-8 ring-[#E86AA8]/50' : ''
        }`}
      >
        
        {/* Giant OBJECTION Banner Animation */}
        {objectionBanner && (
          <div className="absolute inset-0 bg-[#E86AA8]/20 z-50 flex items-center justify-center pointer-events-none backdrop-blur-xs">
            <div className="bg-[#D7263D] text-[#EDEBFA] border-4 border-white px-8 py-4 -rotate-6 font-mono-tech font-extrabold text-4xl sm:text-6xl tracking-widest shadow-[0_0_50px_#D7263D] animate-bounce">
              ¡FALSO!
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E86AA8] animate-spin" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#E86AA8] font-mono-tech tracking-wider uppercase">
                DUELO DE PRUEBAS // MESA DE AUDITORÍA DEL CONSEJO
              </h2>
              <div className="text-[11px] text-[#8F8CA8]">
                Desmonta las acusaciones de la crónica falsa frase por frase. Elige la prueba correcta y pulsa ¡FALSO!
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#201D3D] rounded-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tension Meter of the Accusation */}
        <div className="flex items-center justify-between bg-[#0C0C22] p-2.5 px-3 border border-[#5E4FA2]/40 rounded-xs text-xs font-mono-tech">
          <span className="flex items-center gap-1.5 text-[#EDEBFA]">
            <AlertOctagon className="w-4 h-4 text-[#D7263D]" /> CRÓNICA FALSA (TENSIÓN):
          </span>
          <div className="w-36 h-2 bg-[#1B1B36] border border-[#D7263D]/40 rounded-xs overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#D7263D] to-[#F2B544] transition-all duration-300"
              style={{ width: `${councilTension}%` }}
            />
          </div>
          <span className="text-[#F2B544] font-bold">RONDA {currentRoundIndex + 1} DE 3</span>
        </div>

        {/* Main Debate Stage: Speaker vs Statement */}
        <div className="bg-[#09091A] border-2 border-[#5E4FA2] rounded-xs p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="shrink-0 flex flex-col items-center">
            <CharacterPortrait type="diego" mood="firm" size={76} />
            <span className="text-[10px] font-mono-tech font-bold text-[#F2B544] mt-1">DIEGO</span>
          </div>

          <div className="flex-1 text-left">
            <div className="text-[10px] text-[#E86AA8] font-mono-tech uppercase mb-1">
              {round.subtext}
            </div>
            <div className="text-sm sm:text-base text-[#EDEBFA] font-medium leading-relaxed bg-[#12122A] p-3 border-l-4 border-[#D7263D] rounded-xs shadow-inner">
              {round.statement}
            </div>
          </div>
        </div>

        {/* Rebuttal Result Modal / Feedback Box */}
        {feedback && (
          <div className={`p-3.5 rounded-xs border-l-4 text-xs font-mono-tech leading-relaxed ${
            feedback.isSuccess 
              ? 'bg-[#4FD1C5]/10 border-[#4FD1C5] text-[#EDEBFA]' 
              : 'bg-[#D7263D]/10 border-[#D7263D] text-[#EDEBFA]'
          }`}>
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {feedback.isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#4FD1C5]" />
                  <span className="text-[#4FD1C5]">¡CONTRADICCIÓN DEMOSTRADA CON ÉXITO!</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-[#D7263D]" />
                  <span className="text-[#D7263D]">ARGUMENTO RECHAZADO POR EL CONSEJO</span>
                </>
              )}
            </div>
            <p className="whitespace-pre-line">{feedback.text}</p>

            {feedback.isSuccess && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleNextRound}
                  className="px-4 py-1.5 bg-[#4FD1C5] hover:bg-[#6fe4d9] text-[#0B0B1A] font-bold uppercase tracking-wider rounded-xs cursor-pointer"
                >
                  {currentRoundIndex + 1 < DEBATE_ROUNDS.length ? 'Siguiente Acusación >' : 'Veredicto Final del Consejo >'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Inventory Selector & Slam Button */}
        {!feedback && (
          <div className="flex flex-col gap-2 bg-[#0C0C22] p-3 border border-[#5E4FA2]/40 rounded-xs">
            <div className="text-xs font-mono-tech text-[#8F8CA8] flex items-center justify-between">
              <span>SELECCIONA LA PRUEBA DE TU INVENTARIO:</span>
              <span className="text-[#4FD1C5] font-bold">({inventory.length} Disponibles)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {inventory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playBlip();
                    setSelectedItemId(item.id);
                  }}
                  className={`p-2 rounded-xs border text-left text-xs transition-all cursor-pointer font-mono-tech ${
                    selectedItemId === item.id 
                      ? 'border-[#4FD1C5] bg-[#4FD1C5]/20 text-[#4FD1C5] font-bold shadow-[0_0_8px_rgba(79,209,197,0.4)]' 
                      : 'border-[#5E4FA2]/50 bg-[#15152E] text-[#EDEBFA] hover:border-[#E86AA8]'
                  }`}
                >
                  <div className="truncate font-bold">{item.name}</div>
                  <div className="text-[10px] text-[#8F8CA8] truncate">{item.description}</div>
                </button>
              ))}
            </div>

            {/* BIG ACTION BUTTON */}
            <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#5E4FA2]/30">
              <span className="text-[11px] text-[#8F8CA8]">
                {selectedItemId ? 'Prueba seleccionada. ¡Lanza la objeción!' : 'Selecciona una prueba para refutar.'}
              </span>

              <button
                onClick={handleSlamObjection}
                disabled={!selectedItemId}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xs font-extrabold text-sm uppercase tracking-widest font-mono-tech transition-all shadow-xl ${
                  selectedItemId
                    ? 'bg-[#D7263D] hover:bg-[#ff3b53] text-white shadow-[0_0_20px_#D7263D] cursor-pointer animate-pulse'
                    : 'bg-[#1C1C33] text-[#555877] border border-[#2B2B48] cursor-not-allowed'
                }`}
              >
                <span>¡FALSO!</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
