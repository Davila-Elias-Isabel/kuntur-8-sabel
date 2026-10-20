import React from 'react';
import { PlayerGender, GameMetrics, ClueItem } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { sound } from '../services/audio';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  PhoneCall, 
  Radio, 
  Camera, 
  Search, 
  Zap, 
  Gavel,
  Heart
} from 'lucide-react';

interface LevelMapProps {
  gender: PlayerGender;
  currentLevelNumber: number; // 1 to 5
  metrics: GameMetrics;
  clues: ClueItem[];
  onSelectLevel: (lvl: number) => void;
  onOpenGlossary: () => void;
  onOpenPedagogy: () => void;
  onOpenEmergency: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  gender,
  currentLevelNumber,
  metrics,
  clues,
  onSelectLevel,
  onOpenGlossary,
  onOpenPedagogy,
  onOpenEmergency
}) => {
  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  const levelsData = [
    {
      num: 1,
      title: 'Taller de Mantenimiento // El Osciloscopio',
      desc: 'Calibras la frecuencia a 4.0 Hz con Vale y estableces un límite firme ante los comentarios machistas de Diego.',
      icon: <Radio className="w-5 h-5 text-[#4FD1C5]" />,
      reward: 'Prueba #1: Bitácora del Osciloscopio (Coartada temporal oficial)'
    },
    {
      num: 2,
      title: 'Hangar en Gravedad Cero // Interceptar al Dron Espía',
      desc: 'Empleas la mochila propulsora RCS para capturar al microdron antes de que destruya las fotografías base.',
      icon: <Camera className="w-5 h-5 text-[#E86AA8]" />,
      reward: 'Prueba #2: Tarjeta de memoria con metadatos y fotos sin retocar'
    },
    {
      num: 3,
      title: 'Red de Cadetes // Detector Forense de Holofakes',
      desc: 'Frenas la cadena de reenvío en el canal público y analizas las anomalías visuales generadas por la IA.',
      icon: <Search className="w-5 h-5 text-[#4FD1C5]" />,
      reward: 'Prueba #3: Peritaje Forense del video manipulado'
    },
    {
      num: 4,
      title: 'Vuelo en Nave // Neutralizar Antenas Repetidoras',
      desc: 'Pilotas la nave interceptora esquivando asteroides para apagar las 3 torres y rastrear la IP del agresor.',
      icon: <Zap className="w-5 h-5 text-[#F2B544]" />,
      reward: 'Prueba #4: Firma de IP privada correspondiente a Diego'
    },
    {
      num: 5,
      title: 'Sala del Consejo // El Duelo de Pruebas Periciales',
      desc: 'El debate procesal definitivo: refutas las cuatro mentiras de Diego ante la Comandante Rosa gritando ¡FALSO!.',
      icon: <Gavel className="w-5 h-5 text-[#D7263D]" />,
      reward: 'Resolución favorable y Constelación Ética'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#12122A] border-2 border-[#5E4FA2] rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col my-auto space-y-5">
      
      {/* Top Header with Player Info and Stats */}
      <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CharacterPortrait 
            type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} 
            mood="neutral" 
            size={52} 
          />
          <div>
            <div className="text-[10px] font-mono-tech text-[#4FD1C5] font-bold tracking-widest uppercase">
              CADETE EN SERVICIO // BASE ESPACIAL KUNTUR
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-mono-tech text-[#EDEBFA]">
              {playerName.toUpperCase()} // PROTOCOLO DE TESTIGO ACTIVO
            </h1>
          </div>
        </div>

        {/* Lives and empathy score */}
        <div className="flex items-center gap-4 bg-[#0A0A1C] p-2.5 px-4 rounded-xs border border-[#5E4FA2]/40 font-mono-tech">
          {/* Vidas */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#8F8CA8] font-bold">VIDAS:</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((heartIndex) => (
                <Heart 
                  key={heartIndex} 
                  className={`w-4 h-4 ${
                    heartIndex <= metrics.vidas 
                      ? 'text-[#D7263D] fill-[#D7263D]' 
                      : 'text-[#444054]'
                  }`} 
                />
              ))}
            </div>
          </div>

          <div className="h-5 w-[1px] bg-[#5E4FA2]/40" />

          {/* Puntos de Empatía */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8F8CA8] font-bold">EMPATÍA:</span>
            <span className={`text-sm font-bold ${
              metrics.puntos >= 70 ? 'text-[#4FD1C5]' :
              metrics.puntos >= 40 ? 'text-[#F2B544]' : 'text-[#D7263D]'
            }`}>
              {metrics.puntos} pts
            </span>
          </div>
        </div>
      </div>

      {/* Helpful Quick Links Bar */}
      <div className="flex items-center justify-between bg-[#0E0E24] p-2.5 px-3 rounded-xs border border-[#5E4FA2]/30 flex-wrap gap-2 text-xs font-mono-tech">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playBlip();
              onOpenGlossary();
            }}
            className="px-2.5 py-1 bg-[#4FD1C5]/10 hover:bg-[#4FD1C5]/20 text-[#4FD1C5] border border-[#4FD1C5]/40 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Glosario Técnico sin Enredos</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              onOpenPedagogy();
            }}
            className="px-2.5 py-1 bg-[#5E4FA2]/20 hover:bg-[#5E4FA2]/40 text-[#EDEBFA] border border-[#5E4FA2] rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Matriz 5D (Testigo Activo)</span>
          </button>
        </div>

        <button
          onClick={() => {
            sound.playBlip();
            onOpenEmergency();
          }}
          className="text-[#E86AA8] hover:text-white flex items-center gap-1 underline cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Línea 100 Perú / StopNCII</span>
        </button>
      </div>

      {/* 5 Levels List with Coherence */}
      <div className="space-y-3">
        <div className="text-xs font-mono-tech font-bold text-[#8F8CA8] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#4FD1C5]" />
          <span>PROGRESIÓN DE NIVELES CON CAUSA Y EFECTO:</span>
        </div>

        {levelsData.map((lvl) => {
          const isCompleted = currentLevelNumber > lvl.num;
          const isCurrent = currentLevelNumber === lvl.num;
          const isLocked = currentLevelNumber < lvl.num;

          return (
            <div 
              key={lvl.num}
              className={`p-3.5 rounded-xs border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isCurrent 
                  ? 'bg-[#18183C] border-[#4FD1C5] shadow-[0_0_15px_rgba(79,209,197,0.25)]' 
                  : isCompleted 
                    ? 'bg-[#0E0E22] border-[#5E4FA2]/60 opacity-90' 
                    : 'bg-[#0A0A18] border-[#2A2A44] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xs border ${
                  isCurrent 
                    ? 'bg-[#4FD1C5]/20 border-[#4FD1C5]' 
                    : isCompleted 
                      ? 'bg-[#5E4FA2]/20 border-[#5E4FA2]' 
                      : 'bg-[#151528] border-[#2A2A44]'
                }`}>
                  {lvl.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech font-bold text-xs text-[#EDEBFA]">
                      NIVEL {lvl.num}: {lvl.title}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-mono-tech text-[#4FD1C5] bg-[#4FD1C5]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> COMPLETADO
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-mono-tech text-[#F2B544] bg-[#F2B544]/10 px-1.5 py-0.5 rounded animate-pulse font-bold">
                        MISIÓN EN CURSO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#A6A2C5] max-w-lg">
                    {lvl.desc}
                  </p>
                  <div className="text-[11px] text-[#4FD1C5] font-mono-tech pt-0.5">
                    🎁 {lvl.reward}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isLocked ? (
                  <button 
                    disabled 
                    className="px-3 py-1.5 bg-[#151528] text-[#555B77] border border-[#2A2A44] text-xs font-mono-tech rounded-xs flex items-center gap-1 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" /> Bloqueado
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playBlip();
                      onSelectLevel(lvl.num);
                    }}
                    className={`px-4 py-2 font-mono-tech font-bold text-xs rounded-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent 
                        ? 'bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] shadow-md' 
                        : 'bg-[#181838] hover:bg-[#25254D] text-[#EDEBFA] border border-[#5E4FA2]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCurrent ? 'Ingresar a la Misión' : 'Repetir'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clues gathered preview */}
      <div className="bg-[#0A0A1C] p-3.5 rounded-xs border border-[#5E4FA2]/40 text-xs">
        <div className="font-mono-tech font-bold text-[#EDEBFA] mb-2 flex items-center justify-between">
          <span className="text-[#4FD1C5]">PRUEBAS DISPONIBLES EN EL DATAPAD PARA EL JUICIO:</span>
          <span className="text-[#8F8CA8]">{clues.length} / 4 RECOLECTADAS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {clues.map((c, i) => (
            <div key={i} className="p-2 bg-[#121226] border border-[#4FD1C5]/30 rounded-xs flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4FD1C5] shrink-0" />
              <div>
                <div className="font-bold text-[11px] text-[#EDEBFA]">{c.name}</div>
                <div className="text-[10px] text-[#A6A2C5]">{c.colloquialName}</div>
              </div>
            </div>
          ))}
          {clues.length === 0 && (
            <div className="text-[#555B77] italic text-[11px] col-span-2">
              Aún no cuentas con pruebas registradas. Supera los niveles para incorporarlas a tu Datapad.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
