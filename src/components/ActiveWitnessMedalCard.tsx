import React, { useState, useEffect } from 'react';
import { ActiveWitnessMedal } from '../types/game';
import { speech } from '../services/speech';
import { sound } from '../services/audio';
import { 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  Camera, 
  Zap, 
  Rocket, 
  Gavel, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  RotateCcw
} from 'lucide-react';

interface ActiveWitnessMedalCardProps {
  medal: ActiveWitnessMedal;
  autoSpeak?: boolean;
  compact?: boolean;
}

export const ActiveWitnessMedalCard: React.FC<ActiveWitnessMedalCardProps> = ({
  medal,
  autoSpeak = false,
  compact = false
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    const checkSpeaking = () => {
      setIsPlayingVoice(speech.isSpeaking());
    };
    const interval = setInterval(checkSpeaking, 250);

    // If autoSpeak is desired and autoRead is active
    if (autoSpeak && speech.isAutoRead()) {
      const timer = setTimeout(() => {
        handlePlayGalacticAudio();
      }, 500);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
        speech.stop();
      };
    }

    return () => {
      clearInterval(interval);
      speech.stop();
    };
  }, [medal.id, autoSpeak]);

  const handlePlayGalacticAudio = () => {
    if (isPlayingVoice) {
      speech.stop();
      setIsPlayingVoice(false);
      return;
    }

    sound.playBlip();
    setIsPlayingVoice(true);
    speech.speak(medal.galacticCongratulation, {
      isGalactic: true,
      prependChime: true
    });
  };

  const getRankBadgeStyles = () => {
    if (medal.rank === 'oro') {
      return {
        bg: 'bg-gradient-to-r from-[#855B09] via-[#F2B544] to-[#F7D377]',
        text: 'text-[#0B0B1A]',
        border: 'border-[#F2B544]',
        glow: 'shadow-[0_0_20px_rgba(242,181,68,0.35)]',
        accentText: 'text-[#F2B544]'
      };
    } else if (medal.rank === 'plata') {
      return {
        bg: 'bg-gradient-to-r from-[#3B4D61] via-[#A0B8D0] to-[#E2E8F0]',
        text: 'text-[#0B0B1A]',
        border: 'border-[#A0B8D0]',
        glow: 'shadow-[0_0_20px_rgba(160,184,208,0.3)]',
        accentText: 'text-[#A0B8D0]'
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-[#63381B] via-[#CD7F32] to-[#E3A857]',
        text: 'text-[#0B0B1A]',
        border: 'border-[#CD7F32]',
        glow: 'shadow-[0_0_20px_rgba(205,127,50,0.3)]',
        accentText: 'text-[#CD7F32]'
      };
    }
  };

  const rankStyles = getRankBadgeStyles();

  const renderIcon = () => {
    const iconClass = `w-7 h-7 sm:w-8 sm:h-8 ${rankStyles.accentText}`;
    switch (medal.iconName) {
      case 'Camera': return <Camera className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'Rocket': return <Rocket className={iconClass} />;
      case 'Gavel': return <Gavel className={iconClass} />;
      case 'ShieldAlert': return <ShieldAlert className={iconClass} />;
      case 'ShieldCheck':
      default: return <ShieldCheck className={iconClass} />;
    }
  };

  return (
    <div className={`w-full bg-[#12122A] border-2 ${rankStyles.border} ${rankStyles.glow} rounded-sm p-4 sm:p-5 flex flex-col space-y-3.5 relative overflow-hidden transition-all duration-300`}>
      
      {/* Subtle background glow sheen */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#F2B544]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Ribbon */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#5E4FA2]/40 pb-2.5">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 font-mono-tech font-extrabold text-[11px] rounded-xs uppercase tracking-wider ${rankStyles.bg} ${rankStyles.text}`}>
            🏅 {medal.rankLabel}
          </span>
          <span className="text-[11px] font-mono-tech text-[#8F8CA8]">
            {medal.levelTitle}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[#4FD1C5]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4FD1C5]" />
          <span>MEDALLA OTORGADA</span>
        </div>
      </div>

      {/* Center: Medal Title, Icon & Explanation */}
      <div className="flex items-start gap-3.5">
        <div className={`p-3 bg-[#0B0B1A] border-2 ${rankStyles.border} rounded-sm flex items-center justify-center shrink-0 shadow-md relative group`}>
          {renderIcon()}
          <Sparkles className="w-3.5 h-3.5 text-[#F2B544] absolute -top-1 -right-1 animate-pulse" />
        </div>

        <div className="flex-1 space-y-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-mono-tech font-bold text-base sm:text-lg text-[#EDEBFA] tracking-wide">
              {medal.title}
            </h3>
            <span className="text-xs text-[#F2B544] font-mono-tech font-semibold">
              // {medal.subtitle}
            </span>
          </div>

          <p className="text-xs text-[#EDEBFA]/90 leading-relaxed">
            <strong className="text-[#4FD1C5] font-mono-tech">Criterio Ético: </strong>
            {medal.ethicalCriterion}
          </p>

          <div className="text-[11px] bg-[#0A0A1C] p-2 rounded-xs border-l-2 border-[#F2B544] text-[#A6A2C5]">
            <span className="text-[#F2B544] font-mono-tech font-bold">Tu acción como testigo: </span>
            <span className="text-[#EDEBFA] italic">«{medal.decisionTaken}»</span>
          </div>
        </div>
      </div>

      {/* Galactic Voice Congratulation Box */}
      <div className="bg-[#0D1527] border border-[#4FD1C5]/50 p-3 sm:p-3.5 rounded-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#4FD1C5]/20 text-[#4FD1C5] rounded-xs">
              <Radio className={`w-4 h-4 ${isPlayingVoice ? 'animate-pulse text-[#4FD1C5]' : ''}`} />
            </div>
            <div>
              <span className="font-mono-tech font-bold text-xs text-[#4FD1C5] flex items-center gap-1.5">
                🛰️ FELICITACIÓN DE LA VOZ GALÁCTICA
              </span>
              <span className="text-[10px] text-[#8F8CA8] font-mono-tech">
                Transmisión Oficial de la Inteligencia KUNTUR
              </span>
            </div>
          </div>

          {/* Audio Wave Visualizer Bars */}
          <div className="flex items-center gap-1 px-2 py-1 bg-[#090918] rounded-xs border border-[#5E4FA2]/40">
            {[40, 70, 100, 60, 90, 45, 80].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlayingVoice ? 'bg-[#4FD1C5]' : 'bg-[#5E4FA2]/50'
                }`}
                style={{
                  height: isPlayingVoice ? `${Math.max(4, (h * (0.4 + Math.random() * 0.6)) / 5)}px` : '4px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Spoken Quote */}
        <p className="text-xs sm:text-[13px] text-[#EDEBFA] leading-relaxed italic bg-[#090918]/60 p-2.5 rounded-xs border-l-2 border-[#4FD1C5]">
          «{medal.galacticCongratulation}»
        </p>

        {/* Listen / Control button */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={handlePlayGalacticAudio}
            className={`px-3 py-1.5 rounded-xs font-mono-tech text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              isPlayingVoice
                ? 'bg-[#D7263D] hover:bg-[#b01e30] text-white shadow-md'
                : 'bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] shadow-md hover:shadow-cyan-500/20'
            }`}
          >
            {isPlayingVoice ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Pausar Voz Galáctica</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>🔊 Escuchar Felicitación Galáctica</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
