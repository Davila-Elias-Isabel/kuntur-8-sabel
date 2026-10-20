import React, { useState } from 'react';
import { ClueItem, PlayerGender, DecisionLogEntry } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { sound } from '../services/audio';
import { CheckCircle2, AlertOctagon, Sparkles, Lightbulb, Gavel, ArrowRight, Info } from 'lucide-react';

interface Level5CouncilProps {
  gender: PlayerGender;
  clues: ClueItem[];
  onVictory: () => void;
  onDefeat: (entry: DecisionLogEntry) => void;
  onOpenGlossary: () => void;
}

interface StatementRound {
  id: number;
  statement: string;
  subtext: string;
  correctClueId: string;
  rebuttalText: string;
  consequenceText: string;
  evidenceExplanation: string;
}

const DEBATE_ROUNDS: StatementRound[] = [
  {
    id: 1,
    statement: '«¡Comandante Rosa, el caso es claro: Vale abandonó su turno en el taller y no estaba trabajando a esa hora!»',
    subtext: 'Acusación 1 de 4: ¿Cómo demuestras que Vale sí estaba en su puesto a las 14:00?',
    correctClueId: 'clue_oscilloscope',
    rebuttalText: '¡FALSO! El osciloscopio registró la hora exacta (14:00) en que Vale calibró el motor. ¡Estaba trabajando en su puesto!',
    consequenceText: 'Diego titubea y se queda mudo. La Comandante Rosa asiente: «El osciloscopio sella la hora oficial. Vale estuvo cumpliendo su deber a las 14:00 hrs exactas.»',
    evidenceExplanation: 'El osciloscopio guarda una marca de tiempo digital automática que nadie puede alterar ni borrar.'
  },
  {
    id: 2,
    statement: '«¡Pero el video que mandaron al chat se ve súper real! Se distingue claramente la cara de Vale cometiendo faltas. ¡Nadie puede inventar una grabación así!»',
    subtext: 'Acusación 2 de 4: ¿Cómo demuestras que el video es un montaje trucho hecho con IA?',
    correctClueId: 'clue_forensic',
    rebuttalText: '¡FALSO! El análisis forense descubrió que las sombras de la cara están al revés y los ojos parpadean mal. ¡Es un montaje creado con Inteligencia Artificial!',
    consequenceText: 'Murmullos de asombro en el tribunal. La Comandante Rosa golpea su mazo: «El video es un montaje artificial (Deepfake) para difamarla. ¡Queda totalmente anulado!»',
    evidenceExplanation: 'Los videos inventados con IA tienen fallas en la iluminación del rostro y firmas digitales que el escáner forense detecta al instante.'
  },
  {
    id: 3,
    statement: '«¡Ese video lo grabó un dron cualquiera de limpieza por casualidad; nadie la persiguió ni la espió a propósito!»',
    subtext: 'Acusación 3 de 4: ¿Cómo demuestras que alguien la espió en secreto para robar sus fotos?',
    correctClueId: 'clue_drone',
    rebuttalText: '¡FALSO! Atrapamos el microdron en el hangar y su tarjeta de memoria tenía fotos de Vale tomadas a escondidas para recortar su cara.',
    consequenceText: 'Diego palidece de golpe. La Comandante Rosa interviene con voz firme: «Esto prueba que hubo espionaje premeditado y acoso para robar su imagen.»',
    evidenceExplanation: 'La tarjeta MicroSD del dron guardaba las fotos originales con fecha anterior a la creación del video falso.'
  },
  {
    id: 4,
    statement: '«¡Yo no tengo nada que ver con esto! La cuenta "El Eco" es anónima, nadie puede probar quién envió el mensaje al grupo.»',
    subtext: 'Acusación 4 de 4: ¿Cómo demuestras que el mensaje anónimo salió de la computadora de Diego?',
    correctClueId: 'clue_antenna',
    rebuttalText: '¡FALSO! Al desactivar las antenas espaciales rastreamos la dirección IP (la matrícula digital de internet) y salió directo de tu computadora, Diego.',
    consequenceText: 'Diego baja la cabeza y confiesa con la voz rota: «Yo... solo quería que me nombraran líder a mí... no pensé que causaría tanto daño...»',
    evidenceExplanation: 'En internet el anonimato total no existe: todo mensaje enviado deja una dirección IP que identifica el dispositivo emisor.'
  }
];

export const Level5Council: React.FC<Level5CouncilProps> = ({
  gender,
  clues,
  onVictory,
  onDefeat,
  onOpenGlossary
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [objectionBanner, setObjectionBanner] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string; explanation?: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const round = DEBATE_ROUNDS[currentRoundIndex];

  const handleSlamObjection = () => {
    if (!selectedClueId) {
      sound.playSignalDown();
      return;
    }

    sound.playObjection();
    setIsShaking(true);
    setObjectionBanner('¡FALSO!');

    setTimeout(() => {
      setIsShaking(false);
    }, 600);

    setTimeout(() => {
      setObjectionBanner(null);

      if (selectedClueId === round.correctClueId) {
        sound.playScanSuccess();
        setFeedback({
          isSuccess: true,
          text: round.consequenceText,
          explanation: round.evidenceExplanation
        });
      } else {
        sound.playSignalDown();
        const nextMistakes = mistakes + 1;
        setMistakes(nextMistakes);

        if (nextMistakes >= 2) {
          const failureEntry: DecisionLogEntry = {
            id: 'l5-fail',
            levelNumber: 5,
            levelTitle: 'Nivel 5: Sala del Consejo // Duelo de Pruebas',
            situation: 'Presentar pruebas no correspondientes ante el Consejo.',
            chosenComment: 'Prueba incorrecta presentada en dos oportunidades.',
            isToxic: true,
            pointsDelta: -30,
            whyThisMatters: 'Si presentas pruebas que no corresponden, la acusación falsa de Diego queda sin desmentir.',
            realWorldImpact: 'Presentar la evidencia adecuada es clave para frenar el acoso digital.'
          };
          onDefeat(failureEntry);
        } else {
          setFeedback({
            isSuccess: false,
            text: '«¡Esa prueba no responde a esta mentira! Lee bien qué inventó Diego y escoge la prueba que lo desmiente directamente.»'
          });
        }
      }
    }, 900);
  };

  const handleNextRound = () => {
    setFeedback(null);
    setSelectedClueId(null);

    if (currentRoundIndex + 1 < DEBATE_ROUNDS.length) {
      setCurrentRoundIndex(prev => prev + 1);
    } else {
      onVictory();
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-[#12122A] border-2 border-[#5E4FA2] rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col my-auto relative transition-transform ${isShaking ? 'animate-bounce' : ''}`}>
      
      {/* Objection Dramatic Banner */}
      {objectionBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#D7263D]/85 pointer-events-none">
          <div className="text-4xl sm:text-7xl font-black text-white font-mono-tech tracking-widest border-y-8 border-white py-4 px-8 transform -rotate-6 shadow-2xl animate-pulse">
            {objectionBanner}
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-[#D7263D]/20 text-[#D7263D] font-mono-tech font-bold text-xs rounded-xs flex items-center gap-1">
            <Gavel className="w-3.5 h-3.5" />
            NIVEL 5 DE 5 // CLÍMAX
          </span>
          <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA]">
            SALA DEL CONSEJO // EL DUELO DE PRUEBAS PERICIALES
          </h2>
        </div>

        <button
          onClick={onOpenGlossary}
          className="text-xs text-[#F2B544] hover:text-white flex items-center gap-1 font-mono-tech underline cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Glosario de Términos</span>
        </button>
      </div>

      {/* Round indicator */}
      <div className="flex items-center justify-between text-xs font-mono-tech text-[#8F8CA8] mb-3 bg-[#0A0A1C] p-2 rounded-xs border border-[#5E4FA2]/30">
        <span>ACUSACIÓN DE DIEGO: {currentRoundIndex + 1} DE {DEBATE_ROUNDS.length}</span>
        <span className={mistakes > 0 ? 'text-[#D7263D] font-bold' : 'text-[#4FD1C5]'}>
          INTENTOS DISPONIBLES: {2 - mistakes} / 2
        </span>
      </div>

      {/* Main Dialogue Box: Diego Accusing */}
      <div className="bg-[#1C1428] border-2 border-[#F2B544]/60 rounded-xs p-4 sm:p-5 mb-4 shadow-lg">
        <div className="flex items-start gap-4">
          <CharacterPortrait type="diego" mood="neutral" size={72} />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech font-bold text-[#F2B544]">
                DIEGO // ACUSANDO FORMALMENTE ANTE LA COMANDANTE ROSA
              </span>
              <span className="text-[10px] text-[#A6A2C5] font-mono-tech">
                {round.subtext}
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#EDEBFA] font-medium leading-relaxed italic">
              {round.statement}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback modal / banner after objection */}
      {feedback && (
        <div className={`p-4 rounded-xs border-2 mb-4 ${feedback.isSuccess ? 'bg-[#0E2628] border-[#4FD1C5] text-[#EDEBFA]' : 'bg-[#290C16] border-[#D7263D] text-[#EDEBFA]'}`}>
          <div className="flex items-center gap-2 font-mono-tech font-bold text-xs mb-1">
            {feedback.isSuccess ? (
              <span className="text-[#4FD1C5] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                ¡CONTRADICCIÓN CONFIRMADA! ACUSACIÓN DESESTIMADA
              </span>
            ) : (
              <span className="text-[#D7263D] flex items-center gap-1">
                <AlertOctagon className="w-4 h-4" />
                PRUEBA NO PERTINENTE
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm mt-1">
            {feedback.text}
          </p>

          {feedback.isSuccess && feedback.explanation && (
            <div className="mt-2 p-2 bg-[#081719] rounded-xs border-l-2 border-[#4FD1C5] text-[11px] text-[#A6A2C5] flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#4FD1C5] shrink-0 mt-0.5" />
              <span>{feedback.explanation}</span>
            </div>
          )}

          {feedback.isSuccess && (
            <button
              onClick={handleNextRound}
              className="mt-3 px-5 py-2 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>{currentRoundIndex + 1 < DEBATE_ROUNDS.length ? 'Analizar la siguiente acusación' : 'Escuchar el veredicto final de la Comandante Rosa'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Evidence Carousel (Clues) */}
      {!feedback?.isSuccess && (
        <div className="space-y-3">
          <div className="text-xs font-mono-tech font-bold text-[#EDEBFA] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4FD1C5]" />
            <span>ELIGE LA PRUEBA QUE DESMIENTE A DIEGO:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {clues.map((clue) => {
              const isSelected = selectedClueId === clue.id;
              return (
                <button
                  key={clue.id}
                  onClick={() => {
                    sound.playBlip();
                    setSelectedClueId(clue.id);
                  }}
                  className={`p-2.5 rounded-xs border-2 text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#1C1838] border-[#4FD1C5] shadow-[0_0_15px_rgba(79,209,197,0.3)]' 
                      : 'bg-[#0E0E22] border-[#5E4FA2]/50 hover:border-[#4FD1C5]/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-tech font-bold text-xs text-[#4FD1C5]">
                      {clue.name}
                    </span>
                    <span className="text-[10px] bg-[#5E4FA2]/30 px-1.5 py-0.5 rounded text-[#EDEBFA]">
                      {clue.colloquialName}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A6A2C5] line-clamp-2">
                    {clue.whatItIs}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Action Slam Button */}
          <button
            onClick={handleSlamObjection}
            disabled={!selectedClueId}
            className={`w-full py-3 font-black font-mono-tech text-sm sm:text-base tracking-widest uppercase rounded-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
              selectedClueId 
                ? 'bg-[#D7263D] hover:bg-[#ff3b55] text-white cursor-pointer shadow-[0_0_20px_rgba(215,38,61,0.5)]' 
                : 'bg-[#1C1C36] text-[#555B77] border border-[#2B2B48] cursor-not-allowed'
            }`}
          >
            <Gavel className="w-5 h-5" />
            <span>¡EXCLAMAR «¡FALSO!» Y PRESENTAR PRUEBA!</span>
          </button>
        </div>
      )}

    </div>
  );
};
