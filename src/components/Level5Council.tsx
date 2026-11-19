import React, { useState, useEffect } from 'react';
import { ClueItem, PlayerGender, DecisionLogEntry } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { sound } from '../services/audio';
import { 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw,
  Award,
  Zap,
  HelpCircle,
  XCircle
} from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { speech } from '../services/speech';

interface Level5CouncilProps {
  gender: PlayerGender;
  clues: ClueItem[];
  onVictory: () => void;
  onDefeat: (entry: DecisionLogEntry) => void;
  onOpenGlossary: () => void;
  onAddPoints?: (pts: number) => void;
}

interface DuelOption {
  id: string;
  isCorrect: boolean;
  letter: string;
  title: string;
  detail: string;
  feedback: string;
}

interface DuelRound {
  id: string;
  roundNumber: number;
  totalRounds: number;
  pointsReward: number;
  diegoQuote: string;
  missionPrompt: string;
  options: DuelOption[];
}

const DUEL_ROUNDS: DuelRound[] = [
  {
    id: 'round_deepfake',
    roundNumber: 1,
    totalRounds: 3,
    pointsReward: 10,
    diegoQuote: '«¡El video del chat muestra a Vale saboteando la nave y se ve 100% real! ¡Nadie puede inventar una grabación así!»',
    missionPrompt: 'Diego afirma ante el Consejo que el video no puede ser inventado. ¿Cuál de las dos opciones eliges para responder ante el Consejo?',
    options: [
      {
        id: 'opt_forensic',
        isCorrect: true,
        letter: 'OPCIÓN A',
        title: 'Presentar el peritaje técnico sobre las sombras y el parpadeo del video',
        detail: 'Explicar al Consejo que las anomalías visuales en la iluminación demuestran que fue fabricado con un modelo de Inteligencia Artificial (Deepfake).',
        feedback: '¡Elección correcta! El peritaje forense demuestra de forma técnica y verificable que el video es una fabricación digital y desmiente la acusación.'
      },
      {
        id: 'opt_insult',
        isCorrect: false,
        letter: 'OPCIÓN B',
        title: 'Responder en el chat escolar que Diego está mintiendo por envidia',
        detail: 'Exponer a Diego ante los demás cadetes para que todos sepan que es una mala persona, sin presentar peritajes ni informes técnicos.',
        feedback: 'Esta acción no suma puntos. Los insultos o el enojo impulsivo no demuestran la verdad ante las autoridades y aumentan el conflicto. Se requiere evidencia técnica verificable.'
      }
    ]
  },
  {
    id: 'round_oscilloscope',
    roundNumber: 2,
    totalRounds: 3,
    pointsReward: 10,
    diegoQuote: '«¡Pero Vale no estaba trabajando a las 14:00 horas! ¡Abandonó el taller y descuidó la nave!»',
    missionPrompt: 'Diego acusa a Vale de no estar en su puesto de trabajo a la hora del incidente. ¿Cuál de las dos opciones eliges para responder ante el Consejo?',
    options: [
      {
        id: 'opt_oscilloscope',
        isCorrect: true,
        letter: 'OPCIÓN A',
        title: 'Presentar la bitácora del osciloscopio con registro de calibración a las 14:00 horas',
        detail: 'Mostrar el informe técnico de frecuencia a 4.0 Hz registrado oficialmente en el sistema del taller exactamente a esa hora.',
        feedback: '¡Elección correcta! La bitácora oficial demuestra con fecha y hora exactas que Vale sí estaba trabajando en su puesto cumpliendo sus labores.'
      },
      {
        id: 'opt_silence',
        isCorrect: false,
        letter: 'OPCIÓN B',
        title: 'Borrar los mensajes del chat y esperar a que el rumor se calme por sí solo',
        detail: 'Evitar el conflicto y confiar en que con el paso de los días la tripulación olvidará el tema sin necesidad de intervenir.',
        feedback: 'Esta acción no suma puntos. El silencio o la inacción permiten que las falsedades se normalicen y dañen a la persona afectada. Como testigo activo, presentar la verdad es fundamental.'
      }
    ]
  },
  {
    id: 'round_doxxing_bots',
    roundNumber: 3,
    totalRounds: 3,
    pointsReward: 10,
    diegoQuote: '«¡Pero toda la red de cadetes la repudiaba! ¡Había cientos de mensajes exigiendo su expulsión y filtraron su número!»',
    missionPrompt: 'Diego afirma que la tripulación entera la rechazaba. ¿Qué evidencia pericial presentas ante el Consejo?',
    options: [
      {
        id: 'opt_bots_doxxing',
        isCorrect: true,
        letter: 'OPCIÓN A',
        title: 'Presentar el registro de la red de bots y el log de doxxing extraído de la terminal',
        detail: 'Demostrar que los 200 mensajes eran un ataque coordinado (dogpiling) ejecutado por un script automatizado y que la cuenta impostora fue creada para acosarla.',
        feedback: '¡Elección correcta! La evidencia demuestra que no hubo rechazo genuino de la tripulación, sino un linchamiento digital orquestado mediante bots y doxxing.'
      },
      {
        id: 'opt_argue',
        isCorrect: false,
        letter: 'OPCIÓN B',
        title: 'Ponerse a discutir a los gritos con Diego diciendo que los cadetes no tienen criterio',
        detail: 'Perder la calma en el estrado y descalificar a la tripulación sin exhibir los informes técnicos de la red.',
        feedback: 'Esta acción no suma puntos. La ira sin pruebas resta credibilidad en una audiencia formal. La evidencia digital de los scripts automatizados es la que desbarata la farsa.'
      }
    ]
  }
];

export const Level5Council: React.FC<Level5CouncilProps> = ({
  gender,
  clues,
  onVictory,
  onDefeat,
  onOpenGlossary,
  onAddPoints
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [roundScores, setRoundScores] = useState<{ [roundIdx: number]: number }>({});
  const [attemptsThisRound, setAttemptsThisRound] = useState(0);
  const [showResolution, setShowResolution] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';
  const playerPortraitType = gender === 'hombre' ? 'ale_hombre' : 'ale_mujer';
  const playerRoleTitle = gender === 'hombre' ? 'el cadete Alex' : 'la cadete Alexia';

  const round = DUEL_ROUNDS[currentRoundIdx];

  // Auto-narrate on round mount
  useEffect(() => {
    if (speech.isAutoRead() && !showResolution) {
      const timer = setTimeout(() => {
        speech.speak(
          `Sala del Consejo, alegato ${round.roundNumber} de ${round.totalRounds}. Diego afirma: ${round.diegoQuote}. Lee ambas opciones y elige la que consideres correcta. Si aciertas, sumas ${round.pointsReward} puntos éticos.`,
          { isGalactic: true, prependChime: true, context: `level_5_round_${round.roundNumber}` }
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
  }, [currentRoundIdx, showResolution]);

  const handleSelectOption = (opt: DuelOption) => {
    if (answeredState === 'correct') return; // already solved this round

    setSelectedOptionId(opt.id);
    speech.stop();
    const newAttemptCount = attemptsThisRound + 1;
    setAttemptsThisRound(newAttemptCount);

    if (opt.isCorrect) {
      sound.playScanSuccess();
      setAnsweredState('correct');
      
      // Award points if solved on first attempt or partial if retried
      const earnedPoints = newAttemptCount === 1 ? round.pointsReward : Math.round(round.pointsReward / 2);
      setRoundScores(prev => ({ ...prev, [currentRoundIdx]: earnedPoints }));
      if (onAddPoints) {
        onAddPoints(earnedPoints);
      }

      if (speech.isAutoRead()) {
        speech.speak(`¡Opción correcta! Sumas ${earnedPoints} puntos éticos. ${opt.feedback}`, {
          isGalactic: true,
          context: `level_5_feedback_${round.roundNumber}`
        });
      }
    } else {
      sound.playSignalDown();
      setIsShaking(true);
      setAnsweredState('incorrect');
      setTimeout(() => setIsShaking(false), 500);

      if (speech.isAutoRead()) {
        speech.speak(`Esta opción no suma puntos. ${opt.feedback}`, {
          isGalactic: true,
          context: `level_5_error_${round.roundNumber}`
        });
      }
    }
  };

  const handleNextRound = () => {
    speech.stop();
    sound.playBlip();
    setSelectedOptionId(null);
    setAnsweredState('idle');
    setAttemptsThisRound(0);

    if (currentRoundIdx + 1 < DUEL_ROUNDS.length) {
      setCurrentRoundIdx(prev => prev + 1);
    } else {
      // Victory resolution
      sound.playFanfare();
      setShowResolution(true);
      if (speech.isAutoRead()) {
        setTimeout(() => {
          speech.speak(
            `¡Misión cumplida! Has resuelto los tres casos ante el Consejo Galáctico demostrando la verdad con pruebas periciales objetivas.`,
            { isGalactic: true, prependChime: true, context: 'level_5_victory' }
          );
        }, 300);
      }
    }
  };

  const handleRetryRound = () => {
    speech.stop();
    sound.playBlip();
    setSelectedOptionId(null);
    setAnsweredState('idle');
  };

  const totalPointsEarned = Object.values(roundScores).reduce((a, b) => a + b, 0);

  // Resolution Screen after completing both rounds
  if (showResolution) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-[#12122A] border-2 border-[#4FD1C5] rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col my-auto relative space-y-4 animate-in fade-in duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#4FD1C5]/40 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#4FD1C5]/20 text-[#4FD1C5] font-mono-tech font-bold text-xs rounded-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              VEREDICTO FINAL // ASAMBLEA KUNTUR
            </span>
            <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA]">
              {playerName.toUpperCase()} DESARMÓ EL RUMOR CON EVIDENCIAS
            </h2>
          </div>

          <SpeakerButton 
            onCustomSpeak={() => {
              speech.speak(`Resolución de la Asamblea KUNTUR. Gracias a la valentía de ${playerRoleTitle}, la verdad ha salido a la luz y Vale queda confirmada con honores como Jefa de Ingeniería. Sumaste ${totalPointsEarned} puntos éticos en el Consejo.`);
            }}
            label="🛰️ Escuchar Veredicto"
            className="bg-[#4FD1C5]/20 text-[#4FD1C5] border-[#4FD1C5]"
          />
        </div>

        {/* Hero Card */}
        <div className="bg-[#161638] border-2 border-[#4FD1C5] rounded-xs p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-lg">
          <CharacterPortrait type={playerPortraitType} mood="firm" size={72} />
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-xs font-mono-tech font-bold text-[#4FD1C5]">
                {playerName.toUpperCase()} // CADETE Y TESTIGO ACTIVO EJEMPLAR
              </span>
              <span className="text-[10px] bg-[#4FD1C5]/20 text-[#4FD1C5] px-2 py-0.5 rounded font-mono-tech font-bold flex items-center gap-1">
                <Award className="w-3 h-3" />
                +{totalPointsEarned} PUNTOS ÉTICOS OBTENIDOS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
              En lugar de caer en discusiones o quedarte en silencio, elegiste las pruebas reales en cada acusación:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2 bg-[#0E2024] rounded border border-[#4FD1C5]/40 text-[#4FD1C5]">
                ✓ <strong>Peritaje Forense:</strong> Probó que el video era un Deepfake manipulado.
              </div>
              <div className="p-2 bg-[#0E2024] rounded border border-[#4FD1C5]/40 text-[#4FD1C5]">
                ✓ <strong>Bitácora de Osciloscopio:</strong> Probó que Vale trabajaba a las 14:00 hrs.
              </div>
              <div className="p-2 bg-[#0E2024] rounded border border-[#4FD1C5]/40 text-[#4FD1C5]">
                ✓ <strong>Matriz de Bots & Doxxing:</strong> Desmanteló el linchamiento y la cuenta impostora.
              </div>
            </div>
          </div>
        </div>

        {/* Character Reactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Vale */}
          <div className="flex items-start gap-3 bg-[#0E2024] p-3 rounded-xs border border-[#4FD1C5]/50">
            <CharacterPortrait type="vale" mood="firm" size={54} />
            <div className="space-y-0.5 flex-1">
              <span className="text-[11px] font-mono-tech font-bold text-[#4FD1C5]">
                VALE // JEFA DE INGENIERÍA
              </span>
              <p className="text-xs text-[#EDEBFA] leading-snug">
                «¡Gracias, {playerName}! Si te hubieras callado o hubieras reenviado ese video, me habrían expulsado injustamente. Me demostraste qué significa ser un verdadero compañero de equipo.»
              </p>
            </div>
          </div>

          {/* Diego */}
          <div className="flex items-start gap-3 bg-[#24141E] p-3 rounded-xs border border-[#D7263D]/50">
            <CharacterPortrait type="diego" mood="neutral" size={54} />
            <div className="space-y-0.5 flex-1">
              <span className="text-[11px] font-mono-tech font-bold text-[#D7263D]">
                DIEGO // CADETE EN PROCESO FORMATIVO
              </span>
              <p className="text-xs text-[#EDEBFA] leading-snug">
                «Pido disculpas públicas a Vale y a toda la tripulación. Actué por envidia y creí que nadie me descubriría. Acepto reparar el daño colaborando con el equipo.»
              </p>
            </div>
          </div>
        </div>

        {/* Decree */}
        <div className="flex items-center gap-3 bg-[#1A102E] p-3 rounded-xs border-2 border-[#5E4FA2]">
          <CharacterPortrait type="rosa" mood="firm" size={56} />
          <div className="space-y-0.5 flex-1">
            <span className="text-[11px] font-mono-tech font-bold text-[#F2B544]">
              COMANDANTE ROSA // DECRETO DEL CONSEJO
            </span>
            <p className="text-xs text-[#EDEBFA] leading-snug">
              «¡Caso cerrado! Vale queda ratificada como Jefa de Ingeniería con honores. Y el cadete {playerName} recibe la condecoración de la Constelación Ética por proteger la verdad en KUNTUR.»
            </p>
          </div>
        </div>

        {/* Victory Action */}
        <button
          onClick={() => {
            sound.playScanSuccess();
            speech.stop();
            onVictory();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-[#4FD1C5] via-[#48BB78] to-[#4FD1C5] hover:opacity-95 text-[#0B0B1A] font-extrabold font-mono-tech text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(79,209,197,0.4)] transition-all uppercase tracking-wider"
        >
          <span>CONCLUIR MISIÓN // VER CONSTELACIÓN ÉTICA Y MEDALLAS</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    );
  }

  const selectedOption = round.options.find(o => o.id === selectedOptionId);

  return (
    <div className={`w-full max-w-4xl mx-auto bg-[#12122A] border-2 border-[#5E4FA2] rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col my-auto relative space-y-4 ${isShaking ? 'animate-shake' : ''}`}>
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-[#4FD1C5]/20 text-[#4FD1C5] font-mono-tech font-bold text-xs rounded-xs">
            NIVEL 5 DE 5 // ETAPA FINAL
          </span>
          <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA]">
            SALA DEL CONSEJO // CASO DE CONVIVENCIA
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGlossary}
            className="text-xs text-[#F2B544] hover:text-white flex items-center gap-1 font-mono-tech underline cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Glosario de Pruebas</span>
          </button>
        </div>
      </div>

      {/* Progress & Scoring Banner */}
      <div className="flex items-center justify-between bg-[#0C0C22] px-3.5 py-2 rounded-xs border border-[#5E4FA2]/50 text-xs font-mono-tech flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#8F8CA8]">CASO EN AUDIENCIA:</span>
          <span className="text-[#EDEBFA] font-bold">
            {round.roundNumber} DE {round.totalRounds}
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            {DUEL_ROUNDS.map((r, idx) => (
              <div
                key={r.id}
                className={`w-6 h-6 rounded-xs flex items-center justify-center font-bold text-xs border ${
                  idx < currentRoundIdx
                    ? 'bg-[#4FD1C5] text-[#0B0B1A] border-[#4FD1C5]'
                    : idx === currentRoundIdx
                    ? 'bg-[#5E4FA2] text-[#EDEBFA] border-[#4FD1C5]'
                    : 'bg-[#161638] text-[#8F8CA8] border-[#5E4FA2]/40'
                }`}
              >
                {idx < currentRoundIdx ? '✓' : idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Clear Scoring Explanation */}
        <div className="flex items-center gap-2 text-[#4FD1C5] bg-[#4FD1C5]/10 px-2.5 py-1 rounded border border-[#4FD1C5]/30">
          <Award className="w-3.5 h-3.5" />
          <span>RECOMPENSA: <strong>+{round.pointsReward} PUNTOS ÉTICOS</strong> SI ACIERTAS</span>
        </div>
      </div>

      {/* Diego's Accusation Card */}
      <div className="bg-[#1F1226] border-2 border-[#D7263D] rounded-xs p-3.5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-3.5 shadow-lg relative">
        <CharacterPortrait type="diego" mood="neutral" size={68} />
        
        <div className="space-y-1.5 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-mono-tech font-bold text-[#D7263D] tracking-wider">
              ACUSACIÓN DE DIEGO ANTE EL CONSEJO
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#EDEBFA] font-medium italic leading-snug">
            {round.diegoQuote}
          </p>

          <p className="text-[11px] text-[#F2B544] font-mono-tech pt-1">
            🎯 {round.missionPrompt}
          </p>
        </div>

        <SpeakerButton 
          onCustomSpeak={() => {
            speech.speak(`Diego acusa: ${round.diegoQuote}. ${round.missionPrompt}`);
          }}
          label="🛰️ Escuchar Acusación"
          className="bg-[#D7263D]/20 text-[#D7263D] border-[#D7263D]"
        />
      </div>

      {/* 2 Options with EQUAL STYLING (No prejudging colors or labels before selecting) */}
      <div className="space-y-2">
        <div className="text-xs font-mono-tech text-[#8F8CA8] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#8F8CA8]" />
            ELIGE LA OPCIÓN QUE CONSIDERES ADECUADA (AMBAS SE PRESENTAN DE FORMA NEUTRAL):
          </span>
          <span className="text-[11px] text-[#8F8CA8]">Elige para ver si suma puntos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {round.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isAnswered = answeredState !== 'idle';
            const isThisCorrect = isAnswered && opt.isCorrect;
            const isThisWrong = isAnswered && isSelected && !opt.isCorrect;

            // Before answering, BOTH cards use THE EXACT SAME neutral colors and styling
            let cardClasses = 'bg-[#161638] border-2 border-[#5E4FA2]/60 hover:border-[#4FD1C5] hover:bg-[#1A1A40]';
            let badgeClasses = 'bg-[#5E4FA2]/30 text-[#EDEBFA] border border-[#5E4FA2]/60';
            let badgeText = opt.letter;

            // Only AFTER answering do we evaluate the selected option
            if (isThisCorrect) {
              cardClasses = 'bg-[#0E2628] border-2 border-[#4FD1C5] ring-2 ring-[#4FD1C5]/50 shadow-[0_0_15px_rgba(79,209,197,0.3)]';
              badgeClasses = 'bg-[#4FD1C5]/20 text-[#4FD1C5] border border-[#4FD1C5]';
              badgeText = `${opt.letter} // ¡ACIERTO! (+${roundScores[currentRoundIdx] || round.pointsReward} PTS)`;
            } else if (isThisWrong) {
              cardClasses = 'bg-[#2E101A] border-2 border-[#D7263D] ring-2 ring-[#D7263D]/50';
              badgeClasses = 'bg-[#D7263D]/20 text-[#D7263D] border border-[#D7263D]';
              badgeText = `${opt.letter} // NO SUMA PUNTOS (0 PTS)`;
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                disabled={answeredState === 'correct'}
                className={`p-4 rounded-xs text-left flex flex-col justify-between transition-all cursor-pointer relative shadow-md ${cardClasses}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono-tech font-bold px-2.5 py-0.5 rounded ${badgeClasses}`}>
                      {badgeText}
                    </span>

                    {/* Checkmark only appears AFTER answering correctly */}
                    {isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-[#4FD1C5] animate-bounce shrink-0" />
                    )}
                    {isThisWrong && (
                      <XCircle className="w-5 h-5 text-[#D7263D] shrink-0" />
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-[#EDEBFA] leading-snug">
                    {opt.title}
                  </h3>

                  <p className="text-xs text-[#8F8CA8] leading-relaxed">
                    {opt.detail}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono-tech text-[#8F8CA8] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#F2B544]" />
                    {answeredState === 'correct' && opt.isCorrect
                      ? 'RESPUESTA VALIDADA'
                      : 'TOCA PARA ELEGIR'}
                  </span>

                  <SpeakerButton
                    onCustomSpeak={() => {
                      speech.speak(`${opt.letter}. ${opt.title}. ${opt.detail}`);
                    }}
                    label="Escuchar opción"
                    className="p-1 h-auto text-[10px]"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Post-selection Evaluation: Clearly shows points won or 0 points */}
      {answeredState === 'correct' && selectedOption && (
        <div className="p-3.5 bg-[#0E2628] border-2 border-[#4FD1C5] rounded-xs text-xs font-mono-tech text-[#4FD1C5] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-[#4FD1C5]" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-sm block">¡RESPUESTA CORRECTA!</strong>
                <span className="text-[11px] bg-[#4FD1C5]/20 text-[#4FD1C5] px-2 py-0.5 rounded font-bold">
                  +{roundScores[currentRoundIdx] || round.pointsReward} PUNTOS ÉTICOS SUMADOS
                </span>
              </div>
              <p className="text-xs text-[#EDEBFA] mt-1 leading-snug">{selectedOption.feedback}</p>
            </div>
          </div>

          <button
            onClick={handleNextRound}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#4FD1C5] hover:bg-[#38b2ac] text-[#0B0B1A] font-extrabold font-mono-tech text-xs rounded-xs flex items-center justify-center gap-1.5 cursor-pointer uppercase shadow-lg transition-transform active:scale-95 shrink-0"
          >
            <span>{currentRoundIdx + 1 < DUEL_ROUNDS.length ? 'Siguiente Caso (2/2)' : 'Ver Veredicto del Consejo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {answeredState === 'incorrect' && selectedOption && (
        <div className="p-3.5 bg-[#2E101A] border-2 border-[#D7263D] rounded-xs text-xs font-mono-tech text-[#EDEBFA] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <XCircle className="w-6 h-6 shrink-0 text-[#D7263D]" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-sm text-[#D7263D] block">ESTA OPCIÓN NO SUMA PUNTOS (0 PTS)</strong>
              </div>
              <p className="text-xs text-[#EDEBFA] mt-1 leading-snug">{selectedOption.feedback}</p>
            </div>
          </div>

          <button
            onClick={handleRetryRound}
            className="w-full sm:w-auto px-4 py-2 bg-[#D7263D] hover:bg-[#b01f31] text-white font-bold font-mono-tech text-xs rounded-xs flex items-center justify-center gap-1 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Probar la otra opción</span>
          </button>
        </div>
      )}

    </div>
  );
};
