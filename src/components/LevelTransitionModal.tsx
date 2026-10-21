import React, { useEffect } from 'react';
import { ClueItem, GameMetrics, PlayerGender, ActiveWitnessMedal } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { ActiveWitnessMedalCard } from './ActiveWitnessMedalCard';
import { sound } from '../services/audio';
import { speech } from '../services/speech';
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
  Info,
  Award
} from 'lucide-react';

interface LevelTransitionModalProps {
  completedLevelNumber: number; // 1, 2, 3, 4
  nextLevelNumber: number;      // 2, 3, 4, 5
  gender: PlayerGender;
  earnedClue: ClueItem;
  earnedPoints: number;
  earnedMedal?: ActiveWitnessMedal;
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
  earnedMedal,
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
    return () => {
      speech.stop();
    };
  }, [nextLevelNumber]);

  // Content customized per transition in clear, energetic Spanish for young players
  const transitionData = (() => {
    if (completedLevelNumber === 1) {
      return {
        completedTitle: '¡NIVEL 1 SUPERADO! // HORA DEL OSCILOSCOPIO ASEGURADA',
        nextTitle: 'NIVEL 2: PERSECUCIÓN EN GRAVEDAD CERO',
        icon: <Rocket className="w-6 h-6 text-[#E86AA8]" />,
        speaker: 'vale' as const,
        speakerName: 'VALE // JEFA DE INGENIERÍA',
        speakerMood: 'critical' as const,
        dialogue: 
          `«¡Excelente trabajo, ${playerName}! Dejamos grabada la hora exacta en el osciloscopio. Pero mira hacia el conducto... ¡un microdron con cámara nos estuvo grabando a escondidas y huye hacia el hangar! ¡Ponte la mochila propulsora y atrápalo antes de que escape al espacio!»`,
        techExplanation:
          'Aseguraste la Prueba #1 (La hora oficial). Ahora debes usar los propulsores para perseguir al dron en gravedad cero.',
        nextMissionContext:
          'En gravedad cero flotas sin parar. Muévete con WASD o Flechas, frena con [Espacio] y acércate a menos de 36 metros para atraparlo.'
      };
    } else if (completedLevelNumber === 2) {
      return {
        completedTitle: '¡NIVEL 2 SUPERADO! // DRON ESPÍA ATRAPADO',
        nextTitle: 'NIVEL 3: CHAT DE CADETES & DETECTOR DE IA',
        icon: <Search className="w-6 h-6 text-[#4FD1C5]" />,
        speaker: 'eco' as const,
        speakerName: 'ALERTA DE NOTIFICACIÓN // CANAL «EL ECO»',
        speakerMood: 'critical' as const,
        dialogue: 
          `¡BZZZT! Vibra tu reloj: «¡Miren el video prohibido de Vale en el hangar!». En el chat grupal 24 compañeros están a punto de compartirlo por puro chisme. ¡Alguien usó IA para fabricar un video falso y destruir a tu amiga!`,
        techExplanation:
          'Guardaste la Prueba #2 (Las fotos reales del dron). En este nivel debes frenar la difusión en el chat y usar el escáner forense para encontrar las fallas de la IA.',
        nextMissionContext:
          'Entra al chat grupal, frena la viralización con una respuesta firme y luego detecta las 3 fallas de luz y parpadeo en el escáner.'
      };
    } else if (completedLevelNumber === 3) {
      return {
        completedTitle: '¡NIVEL 3 SUPERADO! // MONTAJE DE IA AL DESCUBIERTO',
        nextTitle: 'NIVEL 4: CARRERA EN NAVE ESPACIAL',
        icon: <Zap className="w-6 h-6 text-[#F2B544]" />,
        speaker: 'vale' as const,
        speakerName: 'VALE // POR RADIO DE COMUNICACIÓN',
        speakerMood: 'firm' as const,
        dialogue: 
          `«¡${playerName}, lograste frenar el chisme en el grupo! Pero el agresor está desesperado y conectó 3 antenas espaciales para mandar el video a todos los celulares del planeta en 60 segundos. ¡Sube a la nave KUNTUR y destruye las antenas con pulsos láser antes de que termine la subida!»`,
        techExplanation:
          'Al derribar las 3 antenas repetidoras, el sistema rastreará la dirección IP (la matrícula digital) que demostrará quién envió el mensaje.',
        nextMissionContext:
          'Pilota la nave con W/S (o Flechas), esquiva los asteroides y dispara con [Espacio] a las 3 antenas para capturar la Prueba #4 (IP de Diego).'
      };
    } else {
      return {
        completedTitle: '¡NIVEL 4 SUPERADO! // SEÑAL CORTADA & IP ATRAPADA',
        nextTitle: 'NIVEL 5: SALA DEL CONSEJO // ¡EL JUICIO FINAL!',
        icon: <Gavel className="w-6 h-6 text-[#D7263D]" />,
        speaker: 'rosa' as const,
        speakerName: 'COMANDANTE ROSA // CONVOCATORIA URGENTE',
        speakerMood: 'firm' as const,
        dialogue: 
          `«¡Atención tripulación! El cadete Diego ha convocado al Consejo exigiendo quitarle el puesto a Vale con mentiras. ${playerName}, Vale: preséntense de inmediato en el tribunal. Tenemos las 4 pruebas periciales: ¡es momento de hacer justicia y desarmar cada engaño!»`,
        techExplanation:
          'Tienes las 4 pruebas en tu datapad: 1) Hora del osciloscopio, 2) Fotos del dron, 3) Fallas de IA, y 4) Dirección IP de Diego.',
        nextMissionContext:
          'Diego lanzará 4 acusaciones falsas. En cada una, grita ¡FALSO! y elige la prueba exacta que desmonta su mentira.'
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

        {/* Active Witness Medal Showcase (with Galactic Voice Audio) */}
        {earnedMedal && (
          <div className="w-full">
            <ActiveWitnessMedalCard medal={earnedMedal} autoSpeak={true} />
          </div>
        )}

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
              speech.stop();
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
