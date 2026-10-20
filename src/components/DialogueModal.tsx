import React, { useState, useEffect, useRef } from 'react';
import { CharacterPortrait } from './CharacterPortraits';
import { DialogueStep, DialogueChoice } from '../types/game';
import { sound } from '../services/audio';

interface DialogueModalProps {
  step: DialogueStep;
  choices: DialogueChoice[];
  onSelectChoice: (choice: DialogueChoice) => void;
  onAutoNext?: (nextStepId: string) => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  step,
  choices,
  onSelectChoice,
  onAutoNext
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = step.text;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      index++;
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        if (index % 3 === 0) {
          sound.playTypewriter();
        }
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 16);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step.id, fullText]);

  const handleSkipTyping = () => {
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  };

  return (
    <div 
      className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 bg-[#15152E]/95 border-2 rounded-md p-4 sm:p-5 shadow-2xl z-40 backdrop-blur-md"
      style={{ borderColor: step.speakerColor }}
      onClick={handleSkipTyping}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Character Portrait */}
        <div className="shrink-0 flex sm:flex-col items-center gap-3">
          <CharacterPortrait 
            type={
              step.avatarType === 'ale' ? 'ale_hombre' : 
              step.avatarType === 'ortega' ? 'diego' : 
              step.avatarType
            } 
            mood={step.mood} 
            size={76} 
          />
        </div>

        {/* Content & Options */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span 
                className="font-bold tracking-wider text-sm sm:text-base font-mono-tech"
                style={{ color: step.speakerColor }}
              >
                {step.speaker.toUpperCase()}
              </span>
              <span className="text-[#8F8CA8] text-xs">·</span>
              <span className="text-xs text-[#EDEBFA]/80 italic">
                {step.speakerRole}
              </span>
            </div>

            <p className="text-[#EDEBFA] text-sm sm:text-base leading-relaxed min-h-[48px] whitespace-pre-line font-medium select-text">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-[#4FD1C5] ml-1 animate-pulse" />}
            </p>
          </div>

          {/* Action / Choices */}
          <div className="mt-4 pt-3 border-t border-[#5E4FA2]/30 flex flex-col gap-2">
            {!isTyping && step.autoNextId && choices.length === 0 && (
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playBlip();
                    if (onAutoNext) onAutoNext(step.autoNextId!);
                  }}
                  className="px-4 py-2 bg-[#5E4FA2] hover:bg-[#E86AA8] text-[#EDEBFA] hover:text-[#0B0B1A] font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md"
                >
                  Continuar &gt;
                </button>
              </div>
            )}

            {choices.map((choice) => (
              <button
                key={choice.id}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playBlip();
                  onSelectChoice(choice);
                }}
                className="w-full text-left p-3 rounded-sm border border-[#5E4FA2]/60 bg-[#0E0E22] hover:bg-[#201D3D] hover:border-[#4FD1C5] transition-all flex items-start justify-between gap-3 group"
              >
                <div className="text-xs sm:text-sm text-[#EDEBFA] group-hover:text-[#4FD1C5] font-medium leading-snug">
                  {choice.label}
                </div>

                {/* Consequence Badges */}
                <div className="flex items-center gap-2 shrink-0 font-mono-tech text-[11px] tabular-nums">
                  {choice.deltaSignal !== undefined && choice.deltaSignal !== 0 && (
                    <span className={choice.deltaSignal > 0 ? 'text-[#4FD1C5]' : 'text-[#D7263D]'}>
                      {choice.deltaSignal > 0 ? `+${choice.deltaSignal}` : choice.deltaSignal} Señal
                    </span>
                  )}
                  {choice.deltaRisk !== undefined && choice.deltaRisk !== 0 && (
                    <span className="text-[#F2B544]">
                      +{choice.deltaRisk} Riesgo
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
