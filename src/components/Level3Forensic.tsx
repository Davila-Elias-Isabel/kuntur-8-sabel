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
          <div className="bg-[#0A0A1C] p-4 rounded-xs border border-[#5E4FA2]/50 space-y-3 font-mono-tech">
            <div className="flex items-center justify-between text-[11px] text-[#8F8CA8] border-b border-[#5E4FA2]/30 pb-2">
              <span className="flex items-center gap-1.5 text-[#E86AA8]">
                <MessageSquare className="w-3.5 h-3.5" />
                CANAL PÚBLICO: #Tropa_Cadetes_Kuntur (24 integrantes activos)
              </span>
              <span>Hace un instante</span>
            </div>

            {/* Chat messages */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#1C0D18] border-l-2 border-[#D7263D] text-[#EDEBFA] rounded-xs">
                <span className="text-[#D7263D] font-bold">[El Eco - Remitente Anónimo]:</span> «Atención a todos: miren lo que llegó al buzón del escuadrón. La líder Vale negociando favoritismos en el hangar. Descárguenlo antes de que el mando lo censure: vale_comprometida.holo»
              </div>
              <div className="p-2 bg-[#121226] text-[#A6A2C5] rounded-xs">
                <span className="text-[#F2B544] font-bold">Kevin_Cadete:</span> «¿Será cierto? Que alguien lo reenvíe al grupo de mensajería privada para revisarlo.»
              </div>
              <div className="p-2 bg-[#121226] text-[#A6A2C5] rounded-xs">
                <span className="text-[#8F8CA8] font-bold">Sofi_Logística:</span> «Un momento... la iluminación en el rostro de Vale se ve extraña, como si no correspondiera al hangar.»
              </div>
            </div>
          </div>

          {/* Technical Explanation on Deepfakes */}
          <div className="bg-[#0C0C22] p-3 rounded-xs border-l-4 border-[#4FD1C5] text-xs text-[#EDEBFA] space-y-1">
            <div className="text-[#4FD1C5] font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#4FD1C5]" />
              ¿Qué es un Holofake / Deepfake y cuál es el dilema pedagógico?:
            </div>
            <p>
              Un <strong>holofake</strong> es un archivo audiovisual generado con Inteligencia Artificial que transfiere el rostro de una persona a otro cuerpo. La investigación de la <strong>UNESCO (2024)</strong> subraya que el daño de estas agresiones no proviene solo de su creador, sino de los <strong>testigos pasivos</strong> que eligen reenviar o comentar con morbo en vez de frenar la difusión.
            </p>
          </div>

          {/* Player decision prompt */}
          <div className="bg-[#15152E] p-4 border border-[#5E4FA2] rounded-xs space-y-3">
            <div className="text-xs font-bold font-mono-tech text-[#EDEBFA] flex items-center gap-2">
              <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="neutral" size={28} />
              <span>¿QUÉ MENSAJE DECIDES PUBLICAR EN EL CANAL PÚBLICO?:</span>
            </div>

            <div className="space-y-2.5">
              {/* Option A: Neutral style */}
              <button
                onClick={() => handleChoose({
                  id: 'forward',
                  text: 'Reenvíen el archivo por privado para analizarlo con el resto del grupo y ver si es real.',
                  isToxic: true,
                  points: -40,
                  why: 'Solicitar o reenviar contenido difamatorio amplifica el alcance de la agresión y te convierte en difusor activo.',
                  impact: 'La viralización descontrolada provoca estrés agudo y aislamiento en la persona afectada en cuestión de minutos.'
                })}
                className="w-full text-left p-3.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-start gap-3 group shadow-sm"
              >
                <span className="w-6 h-6 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  A
                </span>
                <span className="leading-relaxed">
                  «Reenvíen el archivo por privado para analizarlo con el resto del grupo y ver si es real.»
                </span>
              </button>

              {/* Option B: Neutral style */}
              <button
                onClick={() => handleChoose({
                  id: 'victim_blame',
                  text: 'De seguro Vale se lo buscó por su actitud reservada desde que asumió el cargo.',
                  isToxic: true,
                  points: -45,
                  why: 'Culpabilizar a la víctima justifica la violencia digital y exime de responsabilidad al agresor.',
                  impact: 'Inhibe a las víctimas de denunciar por temor al señalamiento social y la descalificación de su entorno.'
                })}
                className="w-full text-left p-3.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-start gap-3 group shadow-sm"
              >
                <span className="w-6 h-6 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  B
                </span>
                <span className="leading-relaxed">
                  «De seguro Vale se lo buscó por su actitud reservada desde que asumió el cargo.»
                </span>
              </button>

              {/* Option C: Neutral style */}
              <button
                onClick={() => handleChoose({
                  id: 'stop_it',
                  text: 'Detengan la difusión de inmediato. Difundir montajes personales es una forma grave de violencia digital. Este video es una falsificación creada con IA; someteré el archivo al escáner pericial ahora mismo para probar las anomalías.',
                  isToxic: false,
                  points: 25,
                  why: 'Establece un límite público claro, advierte sobre la ilicitud del acto y propone una verificación técnica sustentada.',
                  impact: 'Corta la cadena de retransmisión: cuando un miembro del grupo interviene con firmeza, la viralización se desacelera de inmediato.'
                })}
                className="w-full text-left p-3.5 bg-[#161632] hover:bg-[#202046] border border-[#5E4FA2]/50 hover:border-[#8F8CA8] rounded-xs text-xs sm:text-sm text-[#EDEBFA] transition-all cursor-pointer flex items-start gap-3 group shadow-sm"
              >
                <span className="w-6 h-6 rounded-xs bg-[#25254D] group-hover:bg-[#34346B] text-[#EDEBFA] font-mono-tech font-bold text-xs flex items-center justify-center shrink-0 border border-[#5E4FA2]/40">
                  C
                </span>
                <span className="leading-relaxed">
                  «Detengan la difusión de inmediato. Difundir montajes personales es una forma grave de violencia digital. Este video es una falsificación creada con IA; someteré el archivo al escáner pericial ahora mismo para probar las anomalías.»
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Feedback on decision */}
      {step === 'choice_made' && selectedChoice && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xs border-2 ${
            selectedChoice.isToxic 
              ? 'bg-[#290C16] border-[#D7263D] text-[#EDEBFA]' 
              : 'bg-[#0E2628] border-[#4FD1C5] text-[#EDEBFA]'
          }`}>
            <div className="flex items-center gap-2 font-mono-tech font-bold text-xs mb-1">
              {selectedChoice.points > 0 ? (
                <span className="text-[#4FD1C5] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  +25 PUNTOS DE EMPATÍA // INTERVENCIÓN COMO TESTIGO ACTIVO
                </span>
              ) : (
                <span className="text-[#D7263D] flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  -40 PUNTOS // COMPLICIDAD CON LA DIFAMACIÓN DIGITAL
                </span>
              )}
            </div>
            
            <p className="text-xs sm:text-sm mt-2">
              {selectedChoice.why}
            </p>
            <p className="text-[11px] text-[#A6A2C5] mt-1 italic">
              Impacto en la vida real: {selectedChoice.impact}
            </p>
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
              <span>Abrir Analizador Forense y Detectar las Fallas de la IA (Minijuego)</span>
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
