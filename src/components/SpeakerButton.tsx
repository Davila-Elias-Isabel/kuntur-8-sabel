import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';
import { speech } from '../services/speech';

interface SpeakerButtonProps {
  textToSpeak?: string;
  onCustomSpeak?: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  textToSpeak,
  onCustomSpeak,
  label = 'Escuchar',
  size = 'sm',
  className = ''
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = speech.addListener((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      speech.stop();
    } else {
      if (onCustomSpeak) {
        onCustomSpeak();
      } else if (textToSpeak) {
        speech.speak(textToSpeak);
      }
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xs font-mono-tech text-xs transition-all cursor-pointer shadow-sm ${
        isSpeaking
          ? 'bg-[#E86AA8] text-[#0B0B1A] font-bold animate-pulse'
          : 'bg-[#181838] hover:bg-[#25254D] text-[#4FD1C5] border border-[#4FD1C5]/40 hover:border-[#4FD1C5]'
      } ${className}`}
      title={isSpeaking ? 'Detener lectura en voz alta' : 'Escuchar en voz alta'}
    >
      {isSpeaking ? (
        <>
          <VolumeX className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Detener</span>
        </>
      ) : (
        <>
          <Volume2 className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
