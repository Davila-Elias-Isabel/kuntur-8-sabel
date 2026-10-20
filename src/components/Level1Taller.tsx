import React, { useState } from 'react';
import { CharacterPortrait } from './CharacterPortraits';
import { OscilloscopeMinigame } from './OscilloscopeMinigame';
import { PlayerGender, DecisionLogEntry, ClueItem } from '../types/game';
import { sound } from '../services/audio';
import { Radio, AlertTriangle, ArrowRight, Lightbulb, ShieldCheck, Info } from 'lucide-react';

interface Level1TallerProps {
  gender: PlayerGender;
  onCompleteLevel: (decision: DecisionLogEntry, clue: ClueItem) => void;
  onFailLevel: (decision: DecisionLogEntry) => void;
  onOpenGlossary: () => void;
}

export const Level1Taller: React.FC<Level1TallerProps> = ({
  gender,
  onCompleteLevel,
  onFailLevel,
  onOpenGlossary
}) => {
  const [step, setStep] = useState<'intro' | 'diego_talk' | 'choice_made' | 'oscilloscope' | 'finished'>('intro');
  const [selectedChoice, setSelectedChoice] = useState<{
    id: string;
    text: string;
    isToxic: boolean;
    points: number;
    why: string;
    impact: string;
  } | null>(null);

  const [showOscilloscopeModal, setShowOscilloscopeModal] = useState(false);

  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  const handleChoose = (choice: {
    id: string;
    text: string;
    isToxic: boolean;
    points: number;
    why: string;
    impact: string;
  }) => {
    setSelectedChoice(choice);
    setStep('choice_made');

    const decisionLog: DecisionLogEntry = {
      id: `l1-${choice.id}`,
      levelNumber: 1,
      levelTitle: 'Nivel 1: Taller de Mantenimiento',
      situation: 'Diego cuestiona el ascenso de Vale recurriendo a estereotipos machistas.',
      chosenComment: choice.text,
      isToxic: choice.isToxic,
      pointsDelta: choice.points,
      whyThisMatters: choice.why,
      realWorldImpact: choice.impact
    };

    if (choice.isToxic) {
      sound.playSignalDown();
      setTimeout(() => {
        onFailLevel(decisionLog);
      }, 2000);
    } else {
      sound.playSignalUp();
    }
  };

  const handleOscilloscopeSuccess = () => {
    sound.playScanSuccess();
    setShowOscilloscopeModal(false);
    setStep('finished');
  };

  const clueItem: ClueItem = {
    id: 'clue_oscilloscope',
    name: 'Bitácora del Osciloscopio',
    colloquialName: 'Coartada Técnica con Hora Exacta',
    category: 'coartada',
    icon: 'Radio',
    whatItIs: 'Registro del osciloscopio que grafica la onda de 4.0 Hz y certifica que Vale estuvo calibrando válvulas en el taller a las 14:00 hrs.',
    howItHelpsInCouncil: 'Desmiente a Diego cuando afirme ante la Comandante Rosa que Vale abandonó su puesto de guardia.',
    unlocked: true
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#12122A] border-2 border-[#5E4FA2] rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col my-auto relative">
      
      {/* Top Level Banner */}
      <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-[#4FD1C5]/20 text-[#4FD1C5] font-mono-tech font-bold text-xs rounded-xs">
            NIVEL 1 DE 5
          </span>
          <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA]">
            TALLER DE MANTENIMIENTO // CALIBRACIÓN DEL OSCILOSCOPIO
          </h2>
        </div>

        <button
          onClick={onOpenGlossary}
          className="text-xs text-[#F2B544] hover:text-white flex items-center gap-1 font-mono-tech underline cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>¿Qué es el Osciloscopio y para qué sirve?</span>
        </button>
      </div>

      {/* Step 1: Intro with Vale */}
      {step === 'intro' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-[#181838] p-3 rounded-xs border border-[#5E4FA2]/40">
            <CharacterPortrait type="vale" mood="firm" size={60} />
            <div className="space-y-0.5">
              <div className="text-[11px] font-mono-tech font-bold text-[#4FD1C5]">
                VALE // JEFA DE INGENIERÍA
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-snug">
                «¡Hola, {playerName}! Ayúdame a calibrar el <strong>osciloscopio</strong> a 4.0 Hz. Esto sella la hora oficial y nos da la <strong>Prueba #1</strong> para desmentir cualquier chisme.»
              </p>
            </div>
          </div>

          {/* Quick Mission Pill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech">
            <div className="bg-[#0A0A1C] p-2.5 rounded-xs border-l-4 border-[#4FD1C5] text-[#EDEBFA] flex items-center gap-2">
              <span className="text-base">🎯</span>
              <span><strong>Misión:</strong> Iguala tu onda con la onda verde.</span>
            </div>
            <div className="bg-[#0A0A1C] p-2.5 rounded-xs border-l-4 border-[#F2B544] text-[#EDEBFA] flex items-center gap-2">
              <span className="text-base">⭐</span>
              <span><strong>Premio:</strong> Aseguras la <strong>Prueba #1</strong> para el Consejo.</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              setStep('diego_talk');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-all self-end"
          >
            <span>Iniciar calibración</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Diego arrives with toxic comments */}
      {step === 'diego_talk' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-[#1E1428] p-3 rounded-xs border border-[#F2B544]/50">
            <CharacterPortrait type="diego" mood="neutral" size={60} />
            <div className="space-y-0.5">
              <div className="text-[11px] font-mono-tech font-bold text-[#F2B544]">
                DIEGO // CADETE
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-snug">
                «Miren a la nueva jefa... Oye {playerName}, seguro le regalaron el puesto. A las chicas se les complican los motores, ¿o me equivoco?»
              </p>
            </div>
          </div>

          {/* Player decision prompt with clear context and projections */}
          <div className="bg-[#12122A] p-3.5 border border-[#5E4FA2] rounded-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold font-mono-tech text-[#EDEBFA]">
              <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="neutral" size={24} />
              <span>DIEGO SE BURLA DE VALE. ¿QUÉ LE DICES?:</span>
            </div>

            <div className="space-y-2">
              {/* Option A */}
              <button
                onClick={() => handleChoose({
                  id: 'toxic',
                  text: '«Tienes razón, seguro la ayudaron por ser mujer.»',
                  isToxic: true,
                  points: -40,
                  why: 'Te sumaste a la burla y validaste el prejuicio.',
                  impact: 'Haces que el agresor se sienta apoyado y continúe atacando.'
                })}
                className="w-full text-left p-2.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-2.5 group shadow-sm"
              >
                <span className="w-5 h-5 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  A
                </span>
                <span>«Tienes razón, seguro la ayudaron por ser mujer.»</span>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleChoose({
                  id: 'passive',
                  text: '«Yo no me meto en problemas, arréglense ustedes.»',
                  isToxic: false,
                  points: -15,
                  why: 'Quedarte callado dejó a tu compañera sola.',
                  impact: 'El silencio permite que el acoso escale sin frenos.'
                })}
                className="w-full text-left p-2.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-2.5 group shadow-sm"
              >
                <span className="w-5 h-5 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  B
                </span>
                <span>«Yo no me meto en problemas, arréglense ustedes.»</span>
              </button>

              {/* Option C */}
              <button
                onClick={() => handleChoose({
                  id: 'assertive',
                  text: '«¡Corta tus comentarios, Diego! Vale ganó su puesto por mérito propio.»',
                  isToxic: false,
                  points: 25,
                  why: 'Pusiste un alto firme y defendiste a tu compañera.',
                  impact: 'Frenas el acoso en seco. Cuando un compañero habla, el agresor pierde poder.'
                })}
                className="w-full text-left p-2.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-2.5 group shadow-sm"
              >
                <span className="w-5 h-5 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  C
                </span>
                <span className="font-medium text-[#4FD1C5]">«¡Corta tus comentarios, Diego! Vale ganó su puesto por mérito propio.»</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Choice feedback */}
      {step === 'choice_made' && selectedChoice && (
        <div className="space-y-3">
          <div className={`p-3.5 rounded-xs border-2 ${
            selectedChoice.isToxic 
              ? 'bg-[#290C16] border-[#D7263D] text-[#EDEBFA]' 
              : selectedChoice.points > 0 
                ? 'bg-[#0E2628] border-[#4FD1C5] text-[#EDEBFA]'
                : 'bg-[#261E14] border-[#F2B544] text-[#EDEBFA]'
          }`}>
            <div className="flex items-center gap-2 font-mono-tech font-bold text-xs mb-1">
              {selectedChoice.points > 0 ? (
                <span className="text-[#4FD1C5] flex items-center gap-1.5 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  +25 PUNTOS // ¡EXCELENTE! TESTIGO ACTIVO
                </span>
              ) : selectedChoice.isToxic ? (
                <span className="text-[#D7263D] flex items-center gap-1.5 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  -40 PUNTOS // APOYASTE LA BURLA
                </span>
              ) : (
                <span className="text-[#F2B544] flex items-center gap-1.5 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  -15 PUNTOS // EL SILENCIO NO AYUDA
                </span>
              )}
            </div>
            
            <p className="text-xs sm:text-sm mt-1">
              👉 {selectedChoice.why} <strong>{selectedChoice.impact}</strong>
            </p>

            {selectedChoice.points > 0 && (
              <div className="mt-2 pt-1.5 border-t border-[#4FD1C5]/30 text-xs font-mono-tech text-[#4FD1C5]">
                ⭐ ¡Desbloqueaste la <strong>Prueba #1</strong>! Ahora ajusta el osciloscopio.
              </div>
            )}
          </div>

          {!selectedChoice.isToxic && (
            <div className="flex items-center gap-3 bg-[#181838] p-3 rounded-xs border border-[#5E4FA2]/40">
              <CharacterPortrait type="vale" mood="calm" size={48} />
              <p className="text-xs sm:text-sm text-[#EDEBFA]">
                {selectedChoice.points > 0 
                  ? `«¡Gracias por defenderme, ${playerName}! Ahora calibremos el osciloscopio para dejar la prueba sellada.»`
                  : `«Me dolió tu silencio, ${playerName}... En fin, calibremos el osciloscopio antes de que la máquina falle.»`}
              </p>
            </div>
          )}

          {!selectedChoice.isToxic && (
            <button
              onClick={() => {
                sound.playBlip();
                setShowOscilloscopeModal(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-all self-end"
            >
              <Radio className="w-4 h-4" />
              <span>Abrir Osciloscopio y Calibrar la Onda (Minijuego)</span>
            </button>
          )}
        </div>
      )}

      {/* Step 4: Finished with clue unlocked */}
      {step === 'finished' && selectedChoice && (
        <div className="space-y-4">
          <div className="bg-[#0D2426] border-2 border-[#4FD1C5] p-4 rounded-xs text-center space-y-2">
            <div className="text-[#4FD1C5] font-mono-tech font-bold text-sm tracking-wider">
              ¡NIVEL 1 COMPLETADO! // PRUEBA #1 REGISTRADA EN EL DATAPAD
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

          {/* Transition beat into Level 2 */}
          <div className="flex items-start gap-4 bg-[#26101E] p-4 rounded-xs border border-[#E86AA8]">
            <CharacterPortrait type="vale" mood="critical" size={64} />
            <div className="space-y-1">
              <div className="text-xs font-mono-tech font-bold text-[#E86AA8]">
                VALE (SEÑALANDO HACIA EL DUCTO DE VENTILACIÓN)
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
                «¡{playerName}, detente un segundo! ¿Viste ese destello rojo en el techo? ¡Había un microdron espía grabándonos en el taller! Acaba de salir volando hacia el hangar de gravedad cero. ¡Equípate la mochila propulsora y atrápalos antes de que borren la memoria interna!»
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              const decisionLog: DecisionLogEntry = {
                id: `l1-${selectedChoice.id}`,
                levelNumber: 1,
                levelTitle: 'Nivel 1: Taller de Mantenimiento',
                situation: 'Diego cuestiona el ascenso de Vale con estereotipos de género.',
                chosenComment: selectedChoice.text,
                isToxic: selectedChoice.isToxic,
                pointsDelta: selectedChoice.points,
                whyThisMatters: selectedChoice.why,
                realWorldImpact: selectedChoice.impact
              };
              onCompleteLevel(decisionLog, clueItem);
            }}
            className="w-full py-3 bg-[#E86AA8] hover:bg-[#ff7ebc] text-[#0B0B1A] font-extrabold font-mono-tech text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <span>ACTIVAR MOCHILA PROPULSORA E IR AL NIVEL 2</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Oscilloscope Minigame Modal */}
      {showOscilloscopeModal && (
        <OscilloscopeMinigame
          onSuccess={handleOscilloscopeSuccess}
          onClose={() => setShowOscilloscopeModal(false)}
        />
      )}

    </div>
  );
};
