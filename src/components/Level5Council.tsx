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
    statement: '«El informe es concluyente, Comandante: Vale abandonó su puesto de servicio en el taller criogénico y no se encontraba realizando labores técnicas a esa hora.»',
    subtext: 'Acusación 1 de 4: Cuestionamiento de la coartada y presencia de Vale.',
    correctClueId: 'clue_oscilloscope',
    rebuttalText: '¡FALSO! Aquí está la bitácora criptográfica del osciloscopio. Sincronizó las ondas a 4.0 Hz y registró su firma digital inalterable a las 14:00 horas exactas. Es técnicamente imposible que estuviera en otro lugar.',
    consequenceText: 'Diego titubea visiblemente y consulta su datapad sin argumentos. La Comandante Rosa asiente: «La evidencia técnica es categórica. Vale se encontraba en su puesto cumpliendo sus funciones reglamentarias.»',
    evidenceExplanation: 'El osciloscopio almacena un registro matemático que certifica la calibración de frecuencias con marca de tiempo del sistema central.'
  },
  {
    id: 2,
    statement: '«Aun si estuvo allí, el video difundido por El Eco es nítido. Se distingue claramente su rostro en situaciones indebidas. ¡Nadie puede inventar una grabación de esa naturaleza!»',
    subtext: 'Acusación 2 de 4: Afirmación de que el video es una grabación auténtica.',
    correctClueId: 'clue_forensic',
    rebuttalText: '¡FALSO! El peritaje forense identificó tres fallas graves de renderizado: parpadeo asincrónico en los ojos, iluminación invertida a 38° y la marca de agua del modelo de difusión sintética. ¡Se trata de un holofake fabricado con Inteligencia Artificial!',
    consequenceText: 'Murmullos de asombro en la sala de mando. La Comandante Rosa golpea la mesa con el mazo: «El material audiovisual es un montaje artificial fabricado con fines lesivos. Queda formalmente desestimado como prueba de cargo.»',
    evidenceExplanation: 'Los modelos generativos de video aún presentan imperfecciones en la coherencia de sombras y frecuencias de ruido de 14.2 kHz detectables por escaneo forense.'
  },
  {
    id: 3,
    statement: '«Ese material lo captó un dron cualquiera que sobrevolaba el hangar por mantenimiento rutinario; nadie realizó un seguimiento premeditado hacia ella.»',
    subtext: 'Acusación 3 de 4: Negación de premeditación y hostigamiento planificado.',
    correctClueId: 'clue_drone',
    rebuttalText: '¡FALSO! Interceptamos el microdron espía en el hangar de gravedad cero. Su memoria contiene fotografías fijas de Vale tomadas a escondidas con ángulo constante, utilizadas deliberadamente como plantilla para alimentar el modelo de IA.',
    consequenceText: 'Diego palidece al verse confrontado con el dispositivo. La Comandante Rosa interviene con firmeza: «Esto confirma una conducta de acecho sistemático y violación deliberada de la intimidad de una oficial.»',
    evidenceExplanation: 'Los metadatos almacenados en la tarjeta del dron demuestran fechas y ángulos de captura previos a la publicación del video difamatorio.'
  },
  {
    id: 4,
    statement: '«¡Yo no tengo relación alguna con esto! La cuenta "El Eco" es un canal anónimo externo; no existe forma legítima de vincularme con esa publicación.»',
    subtext: 'Acusación 4 de 4: Intento de escudarse en el anonimato de la red.',
    correctClueId: 'clue_antenna',
    rebuttalText: '¡FALSO! Al desactivar las tres antenas repetidoras en la nave interceptora, el cortafuegos rastreó el paquete de datos original: la transmisión de "El Eco" provino directamente de la dirección IP privada del terminal del Casillero 2, asignado a ti, Diego.',
    consequenceText: 'Diego agacha la mirada y su voz se quiebra: «Yo... solo deseaba el nombramiento de líder... nunca preví la magnitud del daño que causaría este montaje...»',
    evidenceExplanation: 'Toda transmisión digital conserva una firma de red y paquete de enrutamiento que delata el hardware físico desde el que se originó el envío.'
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
            situation: 'Presentar pruebas no pertinentes ante la Comandante Rosa.',
            chosenComment: 'Prueba pericial equivocada presentada en dos oportunidades.',
            isToxic: true,
            pointsDelta: -30,
            whyThisMatters: 'En una audiencia formal, sostener una defensa sin la prueba técnica adecuada debilita la posición de la víctima.',
            realWorldImpact: 'Documentar de manera rigurosa la evidencia pericial es indispensable para evitar la impunidad en casos de violencia digital.'
          };
          onDefeat(failureEntry);
        } else {
          setFeedback({
            isSuccess: false,
            text: '«Esa prueba no contradice la afirmación específica que Diego acaba de plantear. Analiza el contenido exacto de su acusación y escoge la evidencia que responda de forma directa a ese punto.»'
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
            <span>SELECCIONA LA PRUEBA PERICIAL EXACTA REUNIDA EN LAS MISIONES ANTERIORES:</span>
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
                  className={`p-3 rounded-xs border-2 text-left transition-all cursor-pointer ${
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
            className={`w-full py-3.5 font-black font-mono-tech text-base tracking-widest uppercase rounded-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
              selectedClueId 
                ? 'bg-[#D7263D] hover:bg-[#ff3b55] text-white cursor-pointer shadow-[0_0_20px_rgba(215,38,61,0.5)]' 
                : 'bg-[#1C1C36] text-[#555B77] border border-[#2B2B48] cursor-not-allowed'
            }`}
          >
            <Gavel className="w-5 h-5" />
            <span>¡EXCLAMAR «¡FALSO!» Y PRESENTAR PRUEBA PERICIAL!</span>
          </button>
        </div>
      )}

    </div>
  );
};
