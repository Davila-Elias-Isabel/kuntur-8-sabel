import React, { useEffect } from 'react';
import { ClueItem, GameMetrics, PlayerGender } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { sound } from '../services/audio';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lightbulb, 
  ShieldCheck, 
  Rocket, 
  Search, 
  Zap, 
  Gavel,
  Info
} from 'lucide-react';

interface LevelTransitionModalProps {
  completedLevelNumber: number; // 1, 2, 3, 4
  nextLevelNumber: number;      // 2, 3, 4, 5
  gender: PlayerGender;
  earnedClue: ClueItem;
  earnedPoints: number;
  metrics: GameMetrics;
  onContinue: () => void;
  onOpenGlossary: () => void;
}

export const LevelTransitionModal: React.FC<LevelTransitionModalProps> = ({
  completedLevelNumber,
  nextLevelNumber,
  gender,
  earnedClue,
  earnedPoints,
  metrics,
  onContinue,
  onOpenGlossary
}) => {
  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  useEffect(() => {
    sound.playScanSuccess();
    // Modulate procedural music track on alerts
    if (nextLevelNumber >= 2 && nextLevelNumber <= 4) {
      setTimeout(() => {
        sound.switchProceduralTrack(1);
      }, 700);
    }
  }, [nextLevelNumber]);

  // Content customized per transition in clear, balanced Spanish with technical explanations
  const transitionData = (() => {
    if (completedLevelNumber === 1) {
      return {
        completedTitle: 'NIVEL 1 COMPLETADO // COARTADA TÉCNICA ASEGURADA',
        nextTitle: 'NIVEL 2: HANGAR EN GRAVEDAD CERO',
        icon: <Rocket className="w-6 h-6 text-[#E86AA8]" />,
        speaker: 'vale' as const,
        speakerName: 'VALE // JEFA DE INGENIERÍA',
        speakerMood: 'critical' as const,
        dialogue: 
          `«Excelente trabajo, ${playerName}. La calibración del osciloscopio quedó registrada en la bitácora criptográfica con fecha y hora exactas. Pero mira hacia el conducto de ventilación... ¡un microdron espía estaba grabando nuestras labores a escondidas y acaba de escapar hacia el hangar de gravedad cero! ¡Debemos ponernos la mochila propulsora y recuperarlo antes de que borren su memoria interna!»`,
        techExplanation:
          'El osciloscopio dejó sellada la Prueba #1 (Coartada temporal). Ahora debes aplicar la física de inercia en gravedad cero mediante el sistema RCS (Reaction Control System) para interceptar el microdron.',
        nextMissionContext:
          'En gravedad cero te desplazas continuamente por inercia sin fricción. Maniobra la mochila propulsora y acércate a menos de 36 metros para capturar el dron espía.'
      };
    } else if (completedLevelNumber === 2) {
      return {
        completedTitle: 'NIVEL 2 COMPLETADO // DRON ESPÍA INTERCEPTADO',
        nextTitle: 'NIVEL 3: RED DE CADETES & LABORATORIO FORENSE',
        icon: <Search className="w-6 h-6 text-[#4FD1C5]" />,
        speaker: 'eco' as const,
        speakerName: 'ALERTA DE NOTIFICACIÓN // CANAL «EL ECO»',
        speakerMood: 'critical' as const,
        dialogue: 
          `¡BZZZT! Vibra tu terminal de enlace: «Atención tripulación: revisen las imágenes de Vale en el sector técnico; aquí la evidencia de favoritismos». Varios cadetes comienzan a solicitar el reenvío del archivo por mensajería privada. ¡La campaña de difamación se ha puesto en marcha!`,
        techExplanation:
          'La tarjeta del dron contiene la Prueba #2 (Metadatos y fotografías base). En este nivel debes frenar la cadena de reenvío en el chat y utilizar el escáner forense para identificar las pifias de renderizado de la Inteligencia Artificial.',
        nextMissionContext:
          'Ingresa al canal público, rechaza la difusión con argumentos claros y detecta las tres anomalías algorítmicas en la silueta sintética para emitir el peritaje pericial.'
      };
    } else if (completedLevelNumber === 3) {
      return {
        completedTitle: 'NIVEL 3 COMPLETADO // EL HOLOFAKE DESMENTIDO',
        nextTitle: 'NIVEL 4: VUELO ESPACIAL EN NAVE INTERCEPTORA',
        icon: <Zap className="w-6 h-6 text-[#F2B544]" />,
        speaker: 'vale' as const,
        speakerName: 'VALE // POR EL CANAL DE TELECOMUNICACIONES',
        speakerMood: 'firm' as const,
        dialogue: 
          `«¡${playerName}, lograste frenar el reenvío en el grupo con el peritaje técnico! Sin embargo, El Eco está desesperado y activó un protocolo de retransmisión masiva mediante 3 antenas repetidoras en el cinturón de escombros para enviar el video a la Tierra y al Consejo en 60 segundos. ¡Sube a la nave interceptora y destruye los repetidores con pulsos EMP antes de que la difusión se complete!»`,
        techExplanation:
          'Las antenas repetidoras amplifican y viralizan señales digitales a gran distancia. Al inutilizarlas con pulsos electromagnéticos, tu cortafuegos interceptará la Firma de IP privada del remitente.',
        nextMissionContext:
          'Pilota la nave esquivando asteroides y disparando ráfagas a las 3 torres repetidoras para obtener la Prueba #4 (Identidad y dirección IP del agresor).'
      };
    } else {
      return {
        completedTitle: 'NIVEL 4 COMPLETADO // TRANSMISIÓN CORTADA & IP RASTREADA',
        nextTitle: 'NIVEL 5: SALA DEL CONSEJO // EL DUELO DE PRUEBAS',
        icon: <Gavel className="w-6 h-6 text-[#D7263D]" />,
        speaker: 'rosa' as const,
        speakerName: 'COMANDANTE ROSA // ORDEN DE COMPARECENCIA ANTE EL TRIBUNAL',
        speakerMood: 'firm' as const,
        dialogue: 
          `«Cadetes: El cadete Diego ha solicitado formalmente mi presencia en la Sala de Mando para exigir la remoción inmediata de Vale por presuntas irregularidades. Ale, Vale: preséntense de inmediato. Contamos con las cuatro evidencias periciales: es el momento de desmontar cada falsedad ante toda la dotación.»`,
        techExplanation:
          'Dispones de la cadena completa de custodia probatoria: 1) Coartada del osciloscopio, 2) Metadatos del dron, 3) Peritaje de Inteligencia Artificial, y 4) Firma de IP de Diego.',
        nextMissionContext:
          'Diego presentará 4 argumentos falsos. En cada uno, exclama ¡FALSO! y selecciona la prueba pericial exacta que refuta su acusación para ganar el debate procesal.'
      };
    }
  })();

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#15152E] border-2 border-[#4FD1C5] shadow-2xl rounded-sm p-5 sm:p-7 flex flex-col my-auto relative space-y-4">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#4FD1C5]/20 text-[#4FD1C5] font-mono-tech font-bold text-xs rounded-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {transitionData.completedTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono-tech text-xs">
            <span className="text-[#8F8CA8]">PUNTOS DE EMPATÍA OBTENIDOS:</span>
            <span className="text-[#4FD1C5] font-bold">+{earnedPoints} pts</span>
            <span className="text-[#8F8CA8]">|</span>
            <span className="text-[#F2B544] font-bold">TOTAL: {metrics.puntos} pts</span>
          </div>
        </div>

        {/* Clue Unlocked Spotlight Card */}
        <div className="bg-[#0D2426] border-2 border-[#4FD1C5] p-3.5 rounded-xs flex items-start gap-3">
          <div className="p-2.5 bg-[#4FD1C5]/20 text-[#4FD1C5] rounded-xs shrink-0">
            <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech font-bold text-xs text-[#4FD1C5]">
                EVIDENCIA INCORPORADA: {earnedClue.name}
              </span>
              <span className="text-[10px] bg-[#4FD1C5]/20 text-[#EDEBFA] px-1.5 py-0.5 rounded font-mono-tech">
                {earnedClue.colloquialName}
              </span>
            </div>
            <p className="text-[#EDEBFA] text-[11px] leading-relaxed">
              {earnedClue.whatItIs}
            </p>
            <div className="text-[#F2B544] text-[11px] font-mono-tech font-semibold pt-0.5">
              📌 {earnedClue.howItHelpsInCouncil}
            </div>
          </div>
        </div>

        {/* Narrative Dialogue Card */}
        <div className="flex items-start gap-3.5 bg-[#1C1428] p-4 rounded-xs border-l-4 border-[#E86AA8]">
          <CharacterPortrait type={transitionData.speaker} mood={transitionData.speakerMood} size={64} />
          <div className="space-y-1.5 flex-1 text-left">
            <div className="text-xs font-mono-tech font-bold text-[#E86AA8]">
              {transitionData.speakerName}
            </div>
            <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed font-medium">
              {transitionData.dialogue}
            </p>
          </div>
        </div>

        {/* Technical Context Explanation */}
        <div className="bg-[#0A1A24] p-3 rounded-xs border-l-2 border-[#4FD1C5] text-xs text-[#EDEBFA] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#4FD1C5] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[#4FD1C5] font-bold font-mono-tech">Fundamento técnico de la misión: </span>
            <span>{transitionData.techExplanation}</span>
          </div>
        </div>

        {/* Mission Briefing for next level */}
        <div className="bg-[#0A0A1C] p-3 rounded-xs border border-[#5E4FA2]/40 text-xs text-[#A6A2C5] flex items-start gap-2.5">
          <div className="p-1 bg-[#5E4FA2]/30 rounded text-[#4FD1C5] shrink-0 mt-0.5">
            {transitionData.icon}
          </div>
          <div>
            <span className="text-[#4FD1C5] font-bold font-mono-tech">Objetivo del siguiente nivel: </span>
            <span>{transitionData.nextMissionContext}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#5E4FA2]/40">
          <button
            onClick={() => {
              sound.playBlip();
              onOpenGlossary();
            }}
            className="text-xs text-[#F2B544] hover:text-white flex items-center gap-1.5 font-mono-tech underline cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Consultar Glosario Técnico sin Enredos</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              onContinue();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-extrabold font-mono-tech text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <span>INGRESAR A {transitionData.nextTitle}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
