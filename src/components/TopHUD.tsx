import React from 'react';
import { Volume2, VolumeX, BookOpen, ShieldAlert, Heart, Lightbulb, Map, Award, Download } from 'lucide-react';
import { GameMetrics, PlayerGender } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { speech } from '../services/speech';
import { downloadStandaloneHtml } from '../services/downloadHtml';
import { sound } from '../services/audio';

interface TopHUDProps {
  gender: PlayerGender;
  metrics: GameMetrics;
  currentLevelTitle: string;
  isMuted: boolean;
  medalsCount?: number;
  onToggleMute: () => void;
  onOpenGlossary: () => void;
  onOpenPedagogy: () => void;
  onOpenEmergency: () => void;
  onOpenLevelMap: () => void;
  onOpenReflectionNotes?: () => void;
  onOpenMedals?: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  gender,
  metrics,
  currentLevelTitle,
  isMuted,
  medalsCount = 0,
  onToggleMute,
  onOpenGlossary,
  onOpenPedagogy,
  onOpenEmergency,
  onOpenLevelMap,
  onOpenReflectionNotes,
  onOpenMedals
}) => {
  const puntosPercent = Math.max(0, Math.min(100, metrics.puntos));
  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  return (
    <header className="w-full bg-[#0E0E22]/95 border-b border-[#5E4FA2]/50 px-3 sm:px-4 py-2.5 backdrop-blur-md z-30 flex flex-wrap items-center justify-between gap-3 text-xs">
      
      {/* Player identity & Current Level */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenLevelMap}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
          title="Ver mapa de misiones y niveles"
        >
          <CharacterPortrait 
            type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} 
            mood="neutral" 
            size={36} 
          />
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#EDEBFA] font-mono-tech group-hover:text-[#4FD1C5]">
                {playerName.toUpperCase()}
              </span>
              <span className="text-[10px] bg-[#5E4FA2]/30 px-1 py-0.2 rounded text-[#4FD1C5] font-mono-tech">
                LIMA
              </span>
            </div>
            <div className="text-[11px] text-[#A6A2C5] max-w-[180px] sm:max-w-none truncate font-medium">
              {currentLevelTitle}
            </div>
          </div>
        </button>
      </div>

      {/* Lives & Empathy bar */}
      <div className="flex items-center gap-4 sm:gap-6 font-mono-tech">
        {/* Vidas / Corazones */}
        <div className="flex items-center gap-1.5 bg-[#090918] px-2.5 py-1 rounded-xs border border-[#5E4FA2]/30">
          <span className="text-[10px] text-[#8F8CA8] font-bold">VIDAS:</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((heartIndex) => (
              <Heart 
                key={heartIndex} 
                className={`w-3.5 h-3.5 ${
                  heartIndex <= metrics.vidas 
                    ? 'text-[#D7263D] fill-[#D7263D]' 
                    : 'text-[#3E384D]'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Puntos de Empatía */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#4FD1C5] font-bold hidden sm:inline">
            EMPATÍA:
          </span>
          <div className="w-20 sm:w-28 h-2.5 bg-[#1B1B36] border border-[#4FD1C5]/40 rounded-xs overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                puntosPercent >= 70 ? 'bg-gradient-to-r from-[#299E94] to-[#4FD1C5]' :
                puntosPercent >= 40 ? 'bg-gradient-to-r from-[#C28825] to-[#F2B544]' :
                'bg-gradient-to-r from-[#8B1A28] to-[#D7263D]'
              }`}
              style={{ width: `${puntosPercent}%` }}
            />
          </div>
          <span className={`font-bold tabular-nums ${
            puntosPercent >= 70 ? 'text-[#4FD1C5]' :
            puntosPercent >= 40 ? 'text-[#F2B544]' : 'text-[#D7263D]'
          }`}>
            {metrics.puntos} pts
          </span>
        </div>
      </div>

      {/* Action / Help Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Map Hub Button */}
        <button
          onClick={onOpenLevelMap}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xs border border-[#5E4FA2] bg-[#15152E] text-[#EDEBFA] hover:border-[#4FD1C5] hover:text-[#4FD1C5] font-mono-tech text-[11px] cursor-pointer transition-colors"
          title="Ver mapa de misiones y niveles"
        >
          <Map className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Misiones</span>
        </button>

        {/* Active Witness Medals Button */}
        {onOpenMedals && (
          <button
            onClick={onOpenMedals}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xs border border-[#F2B544]/60 bg-[#F2B544]/15 text-[#F2B544] hover:bg-[#F2B544] hover:text-[#0B0B1A] font-mono-tech text-[11px] font-bold cursor-pointer transition-colors shadow-sm"
            title="Ver Medallero de Testigo Activo y felicitaciones de la Voz Galáctica"
          >
            <Award className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Medallas ({medalsCount}/5)</span>
            <span className="sm:hidden font-mono-tech">🏅{medalsCount}</span>
          </button>
        )}

        {/* Reflection Notes Button */}
        {onOpenReflectionNotes && (
          <button
            onClick={onOpenReflectionNotes}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xs border border-[#F2B544]/60 bg-[#F2B544]/10 text-[#F2B544] hover:bg-[#F2B544] hover:text-[#0B0B1A] font-mono-tech text-[11px] font-bold cursor-pointer transition-colors"
            title="Notitas Pedagógicas: ¿Qué provocamos al apoyar o rechazar el acoso?"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notitas</span>
          </button>
        )}

        {/* Glossary Button */}
        <button
          onClick={onOpenGlossary}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xs border border-[#4FD1C5]/50 bg-[#4FD1C5]/10 text-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-[#0B0B1A] font-mono-tech text-[11px] font-bold cursor-pointer transition-colors"
          title="Ver glosario sin enredos"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Glosario</span>
        </button>

        {/* 5D Pedagogy Button */}
        <button
          onClick={onOpenPedagogy}
          className="p-1.5 rounded-xs border border-[#5E4FA2] bg-[#15152E] text-[#8F8CA8] hover:text-[#EDEBFA] hover:border-[#EDEBFA] transition-colors cursor-pointer"
          title="Guía didáctica y protocolo de intervención (5D)"
        >
          <BookOpen className="w-3.5 h-3.5" />
        </button>

        {/* Línea 100 / Emergency */}
        <button
          onClick={onOpenEmergency}
          className="p-1.5 rounded-xs border border-[#D7263D]/60 bg-[#D7263D]/10 text-[#D7263D] hover:bg-[#D7263D] hover:text-white transition-colors cursor-pointer"
          title="Líneas de ayuda reales (Línea 100 Perú, StopNCII)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
        </button>

        {/* Download Standalone HTML */}
        <button
          onClick={() => {
            sound.playSignalUp();
            downloadStandaloneHtml();
          }}
          className="p-1.5 rounded-xs border border-[#4FD1C5]/60 bg-[#4FD1C5]/10 text-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-[#0B0B1A] transition-colors cursor-pointer flex items-center justify-center"
          title="Descargar este juego en un solo archivo .html para jugar sin internet (Offline)"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Voice Narrator toggle with Galactic Voice */}
        <button
          onClick={() => {
            const next = speech.toggleAutoRead();
            if (next) {
              speech.speak('Voz Galáctica KUNTUR activada. Lista para guiarte en tu misión.');
            }
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs border text-[11px] font-mono-tech cursor-pointer transition-all ${
            speech.isAutoRead()
              ? 'border-[#4FD1C5] bg-[#4FD1C5]/20 text-[#4FD1C5] font-bold shadow-[0_0_10px_rgba(79,209,197,0.3)]'
              : 'border-[#5E4FA2] bg-[#15152E] text-[#8F8CA8] hover:text-white'
          }`}
          title={speech.isAutoRead() ? 'Voz Galáctica activa (Clic para apagar)' : 'Activar Voz Galáctica KUNTUR'}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">🛰️ Voz Galáctica</span>
        </button>

        {/* Mute toggle */}
        <button
          onClick={() => {
            onToggleMute();
            if (!isMuted) speech.stop();
          }}
          className="p-1.5 rounded-xs border border-[#5E4FA2] bg-[#15152E] text-[#8F8CA8] hover:text-[#4FD1C5] transition-colors cursor-pointer"
          title={isMuted ? 'Activar música y efectos' : 'Silenciar audio'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

    </header>
  );
};
