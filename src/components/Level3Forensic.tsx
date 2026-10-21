import React, { useState, useEffect } from 'react';
import { CharacterPortrait } from './CharacterPortraits';
import { HoloScannerModal } from './HoloScannerModal';
import { PlayerGender, DecisionLogEntry, ClueItem, HotspotItem } from '../types/game';
import { sound } from '../services/audio';
import { INITIAL_HOTSPOTS } from '../data/narrative';
import { ShieldCheck, ArrowRight, Lightbulb, AlertTriangle, MessageSquare, Search, Info } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { speech } from '../services/speech';

interface Level3ForensicProps {
  gender: PlayerGender;
  onCompleteLevel: (decision: DecisionLogEntry, clue: ClueItem) => void;
  onFailLevel: (decision: DecisionLogEntry) => void;
  onOpenGlossary: () => void;
}

export const Level3Forensic: React.FC<Level3ForensicProps> = ({
  gender,
  onCompleteLevel,
  onFailLevel,
  onOpenGlossary
}) => {
  const [step, setStep] = useState<'chat_dilemma' | 'choice_made' | 'scanner' | 'finished'>('chat_dilemma');
  const [selectedChoice, setSelectedChoice] = useState<{
    id: string;
    text: string;
    isToxic: boolean;
    points: number;
    why: string;
    impact: string;
  } | null>(null);

  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannerHotspots] = useState<HotspotItem[]>(INITIAL_HOTSPOTS);

  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  // Strictly cancel speech on unmount, and auto-narrate level 3 instructions if enabled
  useEffect(() => {
    if (speech.isAutoRead()) {
      const timer = setTimeout(() => {
        speech.speak(
          "Atención cadete. Nivel tres: Red de Cadetes y Detector Forense. Un video de Vale se está difundiendo en el chat de la base. Lee con atención las tres opciones y elige cómo responderías tú.",
          { isGalactic: true, prependChime: true, context: 'level_3' }
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
    id: 'clue_forensic',
    name: 'Peritaje Forense del Holofake',
    colloquialName: 'Evidencia Técnica de Manipulación con IA',
    category: 'peritaje_ia',
    icon: 'Search',
    whatItIs: 'Informe pericial que certifica 3 anomalías algorítmicas de renderizado: sombra invertida en el rostro, parpadeo desfasado y la firma residual del modelo generativo de difusión.',
    howItHelpsInCouncil: 'Desmonta por completo la afirmación de Diego de que el video es una grabación verídica.',
    unlocked: true
  };

  const handleChoose = (choice: {
    id: string;
    text: string;
    isToxic: boolean;
    points: number;
    why: string;
    impact: string;
  }) => {
    speech.stop();
    setSelectedChoice(choice);
    setStep('choice_made');

    const decisionLog: DecisionLogEntry = {
      id: `l3-${choice.id}`,
      levelNumber: 3,
      levelTitle: 'Nivel 3: Laboratorio Forense // El Canal de Mensajería',
      situation: 'El video falso se comparte en el chat de la base y los cadetes piden reenviarlo por curiosidad morbosa.',
      chosenComment: choice.text,
      isToxic: choice.isToxic,
      pointsDelta: choice.points,
      whyThisMatters: choice.why,
      realWorldImpact: choice.impact
    };

    if (choice.isToxic) {
      sound.playSignalDown();
      setTimeout(() => {
        speech.stop();
        onFailLevel(decisionLog);
      }, 2000);
    } else {
      sound.playSignalUp();
    }
  };

  const handleScannerSuccess = () => {
    speech.stop();
    sound.playScanSuccess();
    setShowScannerModal(false);
    setStep('finished');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#12122A] border-2 border-[#5E4FA2] rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col my-auto relative">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3 mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-[#4FD1C5]/20 text-[#4FD1C5] font-mono-tech font-bold text-xs rounded-xs">
            NIVEL 3 DE 5
          </span>
          <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA]">
            RED DE COMUNICACIONES // DETECTOR FORENSE DE HOLOFAKES
          </h2>
        </div>

        <button
          onClick={onOpenGlossary}
          className="text-xs text-[#F2B544] hover:text-white flex items-center gap-1 font-mono-tech underline cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>¿Qué es un Holofake / Deepfake y cómo se detecta?</span>
        </button>
      </div>

      {/* Step 1: Chat dilemma */}
      {step === 'chat_dilemma' && (
        <div className="space-y-4">
          
          {/* Simulated Group Chat */}
          <div className="bg-[#0A0A1C] p-3 rounded-xs border border-[#5E4FA2]/50 space-y-2 font-mono-tech">
            <div className="flex items-center justify-between text-[11px] text-[#8F8CA8] border-b border-[#5E4FA2]/30 pb-1.5">
              <span className="flex items-center gap-1.5 text-[#E86AA8]">
                <MessageSquare className="w-3.5 h-3.5" />
                #Tropa_Cadetes_Kuntur (24 conectados)
              </span>
              <span className="text-[#4FD1C5]">Ahora</span>
            </div>

            {/* Chat messages */}
            <div className="space-y-1.5 text-xs">
              <div className="p-2 bg-[#1C0D18] border-l-2 border-[#D7263D] text-[#EDEBFA] rounded-xs">
                <span className="text-[#D7263D] font-bold">[El Eco]:</span> «¡Miren el video prohibido de Vale en el hangar! Descárguenlo antes de que lo borren.»
              </div>
              <div className="p-1.5 bg-[#121226] text-[#A6A2C5] rounded-xs flex items-center justify-between">
                <span><strong className="text-[#F2B544]">Kevin:</strong> «¡Pásenlo al grupo privado para chismear!»</span>
              </div>
              <div className="p-1.5 bg-[#121226] text-[#A6A2C5] rounded-xs flex items-center justify-between">
                <span><strong className="text-[#4FD1C5]">Sofi:</strong> «Oigan... los ojos de Vale se ven raros, parece un filtro.»</span>
              </div>
            </div>
          </div>

          {/* Quick Stakes Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech">
            <div className="bg-[#0C0C22] p-2.5 rounded-xs border-l-4 border-[#D7263D] text-[#EDEBFA] flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span><strong>Peligro:</strong> Video falso hecho con IA (Deepfake).</span>
            </div>
            <div className="bg-[#0C0C22] p-2.5 rounded-xs border-l-4 border-[#4FD1C5] text-[#EDEBFA] flex items-center gap-2">
              <span className="text-base">🎯</span>
              <span><strong>Tu rol:</strong> 24 cadetes están listos para reenviarlo.</span>
            </div>
          </div>

          {/* Galactic Mission Guide for 10-year-olds */}
          <div className="bg-[#0C0C22] p-3 rounded-xs border-l-4 border-[#5E4FA2] flex items-center justify-between flex-wrap gap-2 text-xs font-mono-tech">
            <div className="flex items-center gap-2 text-[#EDEBFA]">
              <span className="text-base">🛰️</span>
              <span><strong>GUÍA GALÁCTICA:</strong> ¡Están reenviando un video de Vale en el chat! Lee las 3 opciones y elige qué responderías tú.</span>
            </div>
            <SpeakerButton 
              onCustomSpeak={() => {
                speech.speak("Atención cadete. Un video de Vale se está difundiendo en el chat de la base. Lee con atención las tres opciones y elige cómo responderías tú.");
              }}
              label="🛰️ Guía Galáctica"
              className="bg-[#5E4FA2]/30 text-[#EDEBFA] border-[#5E4FA2]"
            />
          </div>

          {/* Player decision prompt with 3 non-spoilered options */}
          <div className="bg-[#15152E] p-3.5 border border-[#5E4FA2] rounded-xs space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-bold font-mono-tech text-[#EDEBFA]">
              <div className="flex items-center gap-2">
                <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="neutral" size={24} />
                <span>¿QUÉ ESCRIBES EN EL CHAT?:</span>
              </div>
              <SpeakerButton 
                onCustomSpeak={() => {
                  speech.speak("¿Qué escribes en el chat? Opción A: Paren de reenviarlo! Ese video es un montaje falso hecho con Inteligencia Artificial. Lo voy a escanear ya. Opción B: No sé si sea verdad o mentira, pero mejor yo no digo nada y me salgo del chat. Opción C: Pásenlo al grupo privado para ver bien qué hizo.");
                }}
                label="Leer Pregunta y Opciones"
                className="bg-[#5E4FA2]/30 text-[#EDEBFA] border-[#5E4FA2]"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Option A */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleChoose({
                    id: 'stop_it',
                    text: '«¡Paren de reenviarlo! Ese video es un montaje falso hecho con IA. Lo voy a escanear ya.»',
                    isToxic: false,
                    points: 25,
                    why: 'Frenaste la cadena de burla con valentía y verdad.',
                    impact: 'Cuando alguien pone un alto en el chat, los demás dejan de reenviar.'
                  })}
                  className="flex-1 text-left p-3 bg-[#111126] hover:bg-[#1C1C3D] border border-[#5E4FA2]/60 hover:border-[#4FD1C5]/70 rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-3 group shadow-sm"
                >
                  <span className="w-6 h-6 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                    A
                  </span>
                  <span className="text-xs sm:text-sm text-[#EDEBFA]">
                    «¡Paren de reenviarlo! Ese video es un montaje falso hecho con IA. Lo voy a escanear ya.»
                  </span>
                </button>
                <SpeakerButton 
                  textToSpeak="Opción A: Paren de reenviarlo! Ese video es un montaje falso hecho con Inteligencia Artificial. Lo voy a escanear ya."
                  label=""
                />
              </div>

              {/* Option B */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleChoose({
                    id: 'passive',
                    text: '«No sé si sea verdad o mentira, pero mejor yo no digo nada y me salgo del chat.»',
                    isToxic: false,
                    points: -10,
                    why: 'Quedarte callado no frena el acoso.',
                    impact: 'El silencio y la neutralidad permiten que el agresor siga difundiendo el video sin consecuencias.'
                  })}
                  className="flex-1 text-left p-3 bg-[#111126] hover:bg-[#1C1C3D] border border-[#5E4FA2]/60 hover:border-[#4FD1C5]/70 rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-3 group shadow-sm"
                >
                  <span className="w-6 h-6 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                    B
                  </span>
                  <span className="text-xs sm:text-sm text-[#EDEBFA]">
                    «No sé si sea verdad o mentira, pero mejor yo no digo nada y me salgo del chat.»
                  </span>
                </button>
                <SpeakerButton 
                  textToSpeak="Opción B: No sé si sea verdad o mentira, pero mejor yo no digo nada y me salgo del chat."
                  label=""
                />
              </div>

              {/* Option C */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleChoose({
                    id: 'forward',
                    text: '«Pásenlo al grupo privado para ver bien qué hizo...»',
                    isToxic: true,
                    points: -40,
                    why: 'Pedir el video por curiosidad alimenta el chisme.',
                    impact: 'Reenviar mentiras en privado multiplica el daño a la persona.'
                  })}
                  className="flex-1 text-left p-3 bg-[#111126] hover:bg-[#1C1C3D] border border-[#5E4FA2]/60 hover:border-[#4FD1C5]/70 rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-3 group shadow-sm"
                >
                  <span className="w-6 h-6 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                    C
                  </span>
                  <span className="text-xs sm:text-sm text-[#EDEBFA]">
                    «Pásenlo al grupo privado para ver bien qué hizo...»
                  </span>
                </button>
                <SpeakerButton 
                  textToSpeak="Opción C: Pásenlo al grupo privado para ver bien qué hizo."
                  label=""
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Feedback on decision */}
      {step === 'choice_made' && selectedChoice && (
        <div className="space-y-3">
          <div className={`p-3.5 rounded-xs border-2 ${
            selectedChoice.points > 0
              ? 'bg-[#0E2628] border-[#4FD1C5] text-[#EDEBFA]'
              : selectedChoice.isToxic
              ? 'bg-[#290C16] border-[#D7263D] text-[#EDEBFA]'
              : 'bg-[#292210] border-[#F2B544] text-[#EDEBFA]'
          }`}>
            <div className="flex items-center gap-2 font-mono-tech font-bold text-xs mb-1">
              {selectedChoice.points > 0 ? (
                <span className="text-[#4FD1C5] flex items-center gap-1.5 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  +25 PUNTOS // ¡RESPUESTA POSITIVA! CORTASTE LA VIRALIZACIÓN
                </span>
              ) : selectedChoice.isToxic ? (
                <span className="text-[#D7263D] flex items-center gap-1.5 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {selectedChoice.points} PUNTOS // RESPUESTA NEGATIVA: ALIMENTASTE EL CHISME
                </span>
              ) : (
                <span className="text-[#F2B544] flex items-center gap-1.5 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {selectedChoice.points} PUNTOS // RESPUESTA NEUTRAL: EL SILENCIO NO FRENA EL DAÑO
                </span>
              )}
            </div>
            
            <p className="text-xs sm:text-sm mt-1">
              👉 {selectedChoice.why} <strong>{selectedChoice.impact}</strong>
            </p>

            {/* Explanation for neutral choice */}
            {!selectedChoice.isToxic && selectedChoice.points < 0 && (
              <div className="mt-2 pt-2 border-t border-[#F2B544]/30 text-xs text-[#EDEBFA] bg-[#1A150A] p-2 rounded-xs">
                💡 <strong>¿Por qué la neutralidad resta puntos?:</strong> En casos de acoso escolar y digital, callarse o mirar a otro lado deja sola a la víctima. Quien envía la mentira cree que tiene permiso de todos si nadie se opone. ¡Aún puedes investigar el video y ayudar a Vale!
              </div>
            )}

            {selectedChoice.points > 0 && (
              <div className="mt-2 pt-1.5 border-t border-[#4FD1C5]/30 text-xs font-mono-tech text-[#4FD1C5]">
                ⭐ ¡Alguien habló y el grupo se detuvo! Ahora abre el escáner forense para encontrar las 3 fallas.
              </div>
            )}
          </div>

          {!selectedChoice.isToxic && (
            <button
              onClick={() => {
                sound.playBlip();
                speech.stop();
                setShowScannerModal(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-all self-end"
            >
              <Search className="w-4 h-4" />
              <span>Abrir Analizador Forense y Encontrar las 3 Fallas de la IA (Minijuego)</span>
            </button>
          )}
        </div>
      )}

      {/* Step 3: Finished */}
      {step === 'finished' && selectedChoice && (
        <div className="space-y-4">
          <div className="bg-[#0D2426] border-2 border-[#4FD1C5] p-4 rounded-xs text-center space-y-2">
            <div className="text-[#4FD1C5] font-mono-tech font-bold text-sm tracking-wider flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>¡NIVEL 3 COMPLETADO! // PRUEBA #3 REGISTRADA EN EL DATAPAD</span>
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

          {/* Alarm for Level 4 */}
          <div className="flex items-start gap-4 bg-[#26101E] p-4 rounded-xs border-2 border-[#E86AA8]">
            <CharacterPortrait type="vale" mood="critical" size={64} />
            <div className="space-y-1">
              <div className="text-xs font-mono-tech font-bold text-[#E86AA8]">
                VALE // COMUNICACIÓN DE EMERGENCIA
              </div>
              <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
                «¡{playerName}, El Eco notó que desarticulamos su argumento técnico y está desesperado! Activó un protocolo de retransmisión masiva en las <strong>3 antenas repetidoras</strong> del cinturón de escombros para enviar el video a toda la flota y a la Tierra en 60 segundos. ¡Sube a la nave interceptora y desactiva las antenas antes de que concluya el conteo!»
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              speech.stop();
              const decisionLog: DecisionLogEntry = {
                id: `l3-${selectedChoice.id}`,
                levelNumber: 3,
                levelTitle: 'Nivel 3: Laboratorio Forense // El Canal de Mensajería',
                situation: 'El video falso se comparte en el chat público.',
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
            <span>SUBIR A LA NAVE Y DETENER LA TRANSMISIÓN (NIVEL 4)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Forensic Scanner Modal */}
      {showScannerModal && (
        <HoloScannerModal
          hotspots={scannerHotspots}
          onCompleteScan={handleScannerSuccess}
          onCancelScan={() => {
            speech.stop();
            setShowScannerModal(false);
          }}
        />
      )}

    </div>
  );
};
