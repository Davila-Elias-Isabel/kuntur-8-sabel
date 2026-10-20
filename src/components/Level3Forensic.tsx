import React, { useState } from 'react';
import { CharacterPortrait } from './CharacterPortraits';
import { HoloScannerModal } from './HoloScannerModal';
import { PlayerGender, DecisionLogEntry, ClueItem, HotspotItem } from '../types/game';
import { sound } from '../services/audio';
import { INITIAL_HOTSPOTS } from '../data/narrative';
import { ShieldCheck, ArrowRight, Lightbulb, AlertTriangle, MessageSquare, Search, Info } from 'lucide-react';

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
        onFailLevel(decisionLog);
      }, 2000);
    } else {
      sound.playSignalUp();
    }
  };

  const handleScannerSuccess = () => {
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

          {/* Player decision prompt */}
          <div className="bg-[#15152E] p-3.5 border border-[#5E4FA2] rounded-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold font-mono-tech text-[#EDEBFA]">
              <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="neutral" size={24} />
              <span>¿QUÉ ESCRIBES EN EL CHAT PARA FRENARLO?:</span>
            </div>

            <div className="space-y-2">
              {/* Option A */}
              <button
                onClick={() => handleChoose({
                  id: 'forward',
                  text: '«Pásenlo al grupo privado para ver bien qué hizo.»',
                  isToxic: true,
                  points: -40,
                  why: 'Pedir el video por curiosidad alimenta el chisme.',
                  impact: 'Reenviar contenido falso en privado multiplica el daño.'
                })}
                className="w-full text-left p-2.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-2.5 group shadow-sm"
              >
                <span className="w-5 h-5 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  A
                </span>
                <span>«Pásenlo al grupo privado para ver bien qué hizo.»</span>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleChoose({
                  id: 'victim_blame',
                  text: '«Seguro Vale se lo buscó por creída.»',
                  isToxic: true,
                  points: -45,
                  why: 'Culpaste a la víctima en vez de rechazar al agresor.',
                  impact: 'Culpar a quien atacan le da impunidad al que inventó la mentira.'
                })}
                className="w-full text-left p-2.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-2.5 group shadow-sm"
              >
                <span className="w-5 h-5 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  B
                </span>
                <span>«Seguro Vale se lo buscó por creída.»</span>
              </button>

              {/* Option C */}
              <button
                onClick={() => handleChoose({
                  id: 'stop_it',
                  text: '«¡Paren de reenviarlo! Ese video es falso hecho con IA. Lo voy a escanear ya.»',
                  isToxic: false,
                  points: 25,
                  why: 'Frenaste la cadena viral con firmeza y verdad.',
                  impact: 'Cuando alguien pone un límite público, los demás dejan de reenviar.'
                })}
                className="w-full text-left p-2.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-center gap-2.5 group shadow-sm"
              >
                <span className="w-5 h-5 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  C
                </span>
                <span className="font-medium text-[#4FD1C5]">«¡Paren de reenviarlo! Ese video es falso hecho con IA. Lo voy a escanear ya.»</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Feedback on decision */}
      {step === 'choice_made' && selectedChoice && (
        <div className="space-y-3">
          <div className={`p-3.5 rounded-xs border-2 ${
            selectedChoice.isToxic 
              ? 'bg-[#290C16] border-[#D7263D] text-[#EDEBFA]' 
              : 'bg-[#0E2628] border-[#4FD1C5] text-[#EDEBFA]'
          }`}>
            <div className="flex items-center gap-2 font-mono-tech font-bold text-xs mb-1">
              {selectedChoice.points > 0 ? (
                <span className="text-[#4FD1C5] flex items-center gap-1.5 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  +25 PUNTOS // ¡CORTASTE LA VIRALIZACIÓN DEL CHAT!
                </span>
              ) : (
                <span className="text-[#D7263D] flex items-center gap-1.5 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {selectedChoice.points} PUNTOS // ALIMENTASTE EL CHISME
                </span>
              )}
            </div>
            
            <p className="text-xs sm:text-sm mt-1">
              👉 {selectedChoice.why} <strong>{selectedChoice.impact}</strong>
            </p>

            {selectedChoice.points > 0 && (
              <div className="mt-2 pt-1.5 border-t border-[#4FD1C5]/30 text-xs font-mono-tech text-[#4FD1C5]">
                ⭐ ¡Nadie reenvió el video! Ahora abre el escáner forense para encontrar las 3 fallas.
              </div>
            )}
          </div>

          {!selectedChoice.isToxic && (
            <button
              onClick={() => {
                sound.playBlip();
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
          onCancelScan={() => setShowScannerModal(false)}
        />
      )}

    </div>
  );
};
