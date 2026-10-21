import React, { useState, useEffect } from 'react';
import { ActiveWitnessMedal, PlayerGender } from '../types/game';
import { ActiveWitnessMedalCard } from './ActiveWitnessMedalCard';
import { getAllMedalsTemplate } from '../services/medals';
import { sound } from '../services/audio';
import { speech } from '../services/speech';
import { 
  Award, 
  X, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Volume2
} from 'lucide-react';

interface ActiveWitnessMedalsModalProps {
  gender: PlayerGender;
  unlockedMedals: ActiveWitnessMedal[];
  onClose: () => void;
}

export const ActiveWitnessMedalsModal: React.FC<ActiveWitnessMedalsModalProps> = ({
  gender,
  unlockedMedals,
  onClose
}) => {
  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  useEffect(() => {
    return () => {
      speech.stop();
    };
  }, []);

  const allTemplate = getAllMedalsTemplate(gender);

  // Merge unlocked with template to show all 5 medals with their status
  const medalsWithStatus: ActiveWitnessMedal[] = allTemplate.map(tmpl => {
    const found = unlockedMedals.find(m => m.levelNumber === tmpl.levelNumber);
    if (found) {
      return { ...found, isUnlocked: true };
    }
    return { ...tmpl, isUnlocked: false };
  });

  const unlockedCount = unlockedMedals.length;
  const [selectedMedalId, setSelectedMedalId] = useState<string>(
    unlockedMedals.length > 0 ? unlockedMedals[unlockedMedals.length - 1].id : medalsWithStatus[0].id
  );

  const activeMedal = medalsWithStatus.find(m => m.id === selectedMedalId) || medalsWithStatus[0];

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#15152E] border-2 border-[#F2B544] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col my-auto relative space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F2B544]/20 text-[#F2B544] rounded-xs">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#F2B544]/20 text-[#F2B544] px-2 py-0.5 rounded font-mono-tech font-bold uppercase tracking-wider">
                  SISTEMA DE RECOMPENSAS ÉTICAS
                </span>
                <span className="text-xs text-[#8F8CA8] font-mono-tech">
                  CADETE {playerName.toUpperCase()}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-mono-tech text-[#EDEBFA]">
                MEDALLERO DE TESTIGO ACTIVO (KUNTUR)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono-tech text-xs bg-[#090918] px-3 py-1.5 rounded-xs border border-[#F2B544]/40">
              <span className="text-[#8F8CA8]">DESBLOQUEADAS:</span>
              <span className="text-[#F2B544] font-bold text-sm">{unlockedCount} / 5</span>
            </div>

            <button
              onClick={() => {
                sound.playBlip();
                speech.stop();
                onClose();
              }}
              className="p-1.5 text-[#8F8CA8] hover:text-white rounded-xs hover:bg-[#5E4FA2]/30 transition-colors cursor-pointer"
              title="Cerrar medallero"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informative banner for 10-year-olds */}
        <div className="bg-[#0D1B2A] border-l-4 border-[#4FD1C5] p-3 rounded-xs text-xs text-[#EDEBFA] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4FD1C5] shrink-0" />
            <span>
              <strong>¿Qué son las Medallas de Testigo Activo?</strong> Premios espaciales otorgados por la <strong>Voz Galáctica</strong> cada vez que tomas decisiones éticas, frenas la burla y proteges a tus amigos en la base.
            </span>
          </div>
          <button
            onClick={() => {
              speech.speak(
                `Bienvenido al Medallero de Testigo Activo, ${playerName}. Aquí se registran las medallas espaciales que ganas al defender a tus compañeros, cuidar las pruebas y frenar el ciberacoso. ¡Escucha el mensaje de cada nivel!`,
                { isGalactic: true, prependChime: true }
              );
            }}
            className="text-[11px] font-mono-tech text-[#4FD1C5] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Explicación hablada</span>
          </button>
        </div>

        {/* Horizontal Level Medal Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {medalsWithStatus.map((m) => {
            const isSelected = m.id === selectedMedalId;
            return (
              <button
                key={m.id}
                onClick={() => {
                  sound.playBlip();
                  setSelectedMedalId(m.id);
                }}
                className={`p-2.5 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] ${
                  isSelected
                    ? 'border-[#F2B544] bg-[#F2B544]/15 shadow-md'
                    : m.isUnlocked
                    ? 'border-[#4FD1C5]/50 bg-[#12122A] hover:border-[#4FD1C5]'
                    : 'border-[#5E4FA2]/30 bg-[#0A0A1C]/60 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono-tech">
                  <span className={isSelected ? 'text-[#F2B544] font-bold' : 'text-[#8F8CA8]'}>
                    NIVEL {m.levelNumber}
                  </span>
                  {m.isUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4FD1C5]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#8F8CA8]" />
                  )}
                </div>

                <div className="text-xs font-mono-tech font-bold truncate text-[#EDEBFA] mt-1">
                  {m.title}
                </div>

                <div className="text-[10px] text-[#A6A2C5] truncate">
                  {m.isUnlocked ? `🏅 ${m.rank.toUpperCase()}` : 'Por desbloquear'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Spotlight Medal Card Display */}
        {activeMedal.isUnlocked ? (
          <ActiveWitnessMedalCard medal={activeMedal} autoSpeak={false} />
        ) : (
          <div className="bg-[#0A0A1C] border-2 border-dashed border-[#5E4FA2]/50 rounded-sm p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-[#5E4FA2]/20 rounded-full flex items-center justify-center mx-auto text-[#8F8CA8]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-mono-tech font-bold text-sm text-[#EDEBFA]">
                {activeMedal.title} (Nivel {activeMedal.levelNumber})
              </h3>
              <p className="text-xs text-[#8F8CA8] max-w-md mx-auto mt-1">
                Completa el Nivel {activeMedal.levelNumber} tomando decisiones éticas para desbloquear esta medalla y escuchar la felicitación exclusiva de la Voz Galáctica.
              </p>
            </div>
            <div className="text-xs font-mono-tech text-[#F2B544] bg-[#15152E] inline-block px-3 py-1 rounded-xs border border-[#F2B544]/30">
              Criterio Ético a demostrar: {activeMedal.ethicalCriterion}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#5E4FA2]/40 pt-3 flex-wrap gap-2 text-xs">
          <span className="text-[#8F8CA8] font-mono-tech">
            Estación Espacial KUNTUR // Programa de Ciudadanía Digital y Testigos Activos
          </span>

          <button
            onClick={() => {
              sound.playBlip();
              speech.stop();
              onClose();
            }}
            className="px-4 py-2 bg-[#5E4FA2] hover:bg-[#7262c0] text-[#EDEBFA] font-mono-tech font-bold text-xs rounded-xs cursor-pointer transition-all"
          >
            Volver a la Misión
          </button>
        </div>

      </div>
    </div>
  );
};
