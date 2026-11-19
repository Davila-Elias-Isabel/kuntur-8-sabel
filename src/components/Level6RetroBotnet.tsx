import React, { useState, useEffect } from 'react';
import { PlayerGender, ClueItem, DecisionLogEntry } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { SpeakerButton } from './SpeakerButton';
import { sound } from '../services/audio';
import { speech } from '../services/speech';
import { Shield, ShieldAlert, CheckCircle2, AlertTriangle, Users, Bot, Zap, ArrowLeft, ArrowRight, Play } from 'lucide-react';

interface Level6RetroBotnetProps {
  gender: PlayerGender;
  onCompleteLevel: (decision: DecisionLogEntry, clue: ClueItem) => void;
  onFailLevel?: () => void;
  onOpenGlossary: () => void;
}

interface BotInvader {
  id: number;
  x: number; // percentage
  y: number; // percentage
  isDestroyed: boolean;
  type: 'troll_bot' | 'hate_amplifier' | 'spammer';
}

export const Level6RetroBotnet: React.FC<Level6RetroBotnetProps> = ({
  gender,
  onCompleteLevel,
  onFailLevel,
  onOpenGlossary
}) => {
  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  const [phase, setPhase] = useState<'BRIEFING' | 'ARCADE_MINIGAME' | 'ETHICAL_DECISION'>('BRIEFING');

  // Space Invaders Arcade State
  const [playerX, setPlayerX] = useState<number>(50); // percentage 10 to 90
  const [bots, setBots] = useState<BotInvader[]>([]);
  const [waveDirection, setWaveDirection] = useState<number>(1); // 1 = right, -1 = left
  const [waveStepY, setWaveStepY] = useState<number>(15);
  const [arcadeScore, setArcadeScore] = useState<number>(1985);
  const [activeProjectiles, setActiveProjectiles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [laserPulse, setLaserPulse] = useState<{ active: boolean; x: number } | null>(null);

  // Decision State
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Initialize bot formation
  useEffect(() => {
    if (phase === 'ARCADE_MINIGAME') {
      sound.playRetroCoin();
      const initialBots: BotInvader[] = [];
      let id = 1;
      // 2 rows of 4 bots = 8 bots
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          initialBots.push({
            id: id++,
            x: 20 + c * 18,
            y: 18 + r * 16,
            isDestroyed: false,
            type: r === 0 ? 'troll_bot' : 'hate_amplifier'
          });
        }
      }
      setBots(initialBots);
      setWaveDirection(1);
      setWaveStepY(15);
    }
  }, [phase]);

  // Invaders oscillation loop
  useEffect(() => {
    if (phase !== 'ARCADE_MINIGAME') return;

    const interval = setInterval(() => {
      setBots(prev => {
        let shouldBounce = false;
        const next = prev.map(b => {
          if (b.isDestroyed) return b;
          const nextX = b.x + waveDirection * 1.5;
          if (nextX > 82 || nextX < 12) {
            shouldBounce = true;
          }
          return { ...b, x: nextX };
        });

        if (shouldBounce) {
          setWaveDirection(d => -d);
          sound.playTone(180, 'square', 0.05, 0.04);
        }

        // Check if all bots are eliminated
        const remaining = next.filter(b => !b.isDestroyed);
        if (remaining.length === 0 && prev.length > 0) {
          setTimeout(() => {
            sound.playRetroPowerUp();
            setPhase('ETHICAL_DECISION');
          }, 500);
        }

        return next;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [phase, waveDirection]);

  // Keyboard controls
  useEffect(() => {
    if (phase !== 'ARCADE_MINIGAME') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        movePlayer(-8);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        movePlayer(8);
      } else if (e.key === ' ' || e.key === 'Enter') {
        fireFactCheckBeam();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, playerX, bots]);

  const movePlayer = (delta: number) => {
    setPlayerX(prev => Math.max(12, Math.min(88, prev + delta)));
  };

  const fireFactCheckBeam = () => {
    sound.playRetroLaser();
    setLaserPulse({ active: true, x: playerX });
    setTimeout(() => setLaserPulse(null), 160);

    // Hit test with active bots
    setBots(prev => {
      let hit = false;
      const next = prev.map(b => {
        if (!b.isDestroyed && Math.abs(b.x - playerX) < 10) {
          hit = true;
          return { ...b, isDestroyed: true };
        }
        return b;
      });

      if (hit) {
        sound.playRetroExplosion();
        setArcadeScore(s => s + 300);
      }

      return next;
    });
  };

  // Clue Item for Level 6
  const clueBotnet: ClueItem = {
    id: 'clue_botnet',
    name: 'Registro de Red de Bots & Script Automatizado',
    colloquialName: 'Código de Ataque Masivo y Cuentas Falsas',
    category: 'red_bots',
    icon: 'Bot',
    whatItIs: 'Archivo script.sh extraído del servidor comando que prueba cómo Diego programó decenas de bots para generar acoso coordinado (dogpiling) contra Vale.',
    howItHelpsInCouncil: 'Demuestra que los ataques masivos no fueron opiniones espontáneas de la tripulación, sino un linchamiento digital planificado por Diego.',
    unlocked: true
  };

  const handleConfirmDecision = (choice: 'A' | 'B') => {
    setSelectedChoice(choice);
    setShowExplanation(true);
    speech.stop();

    if (choice === 'A') {
      sound.playSignalUp();
      sound.playRetroCoin();
    } else {
      sound.playSignalDown();
    }
  };

  const handleAdvanceToNext = () => {
    const isOptionA = selectedChoice === 'A';
    const decision: DecisionLogEntry = {
      id: 'decision_lvl_6',
      levelNumber: 6,
      levelTitle: 'Nivel 6: Matriz de Bots 1985 // Dogpiling & Acoso Masivo',
      situation: 'Linchamiento digital masivo (dogpiling) con decenas de bots atacando a Vale.',
      chosenComment: isOptionA
        ? '«No alimentamos al troll ni caemos en la trampa del algoritmo: aislamos la red de bots, documentamos el script y publicamos contranarrativas visibles de respaldo a Vale.»'
        : '«Responder con furia a cada bot e insultarlos en el canal público.»',
      isToxic: !isOptionA,
      pointsDelta: isOptionA ? 15 : -15,
      whyThisMatters: isOptionA
        ? 'Aplicaste la regla de oro de AMI: el linchamiento digital se combate con moderación comunitaria y respaldo visible a la víctima, no con peleas que alimentan al algoritmo.'
        : 'Pelear con bots o trolls desgasta a la comunidad y premia a los algoritmos que potencian el odio digital.',
      realWorldImpact: 'El acoso coordinado (dogpiling) busca silenciar y aislar a mujeres en entornos digitales; romper el aislamiento con solidaridad comunitaria es el antídoto clave.'
    };

    onCompleteLevel(decision, clueBotnet);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-auto p-3 sm:p-5 flex flex-col justify-center font-mono-tech select-none">
      
      {/* 80s Arcade Synthwave Frame */}
      <div className="bg-[#100C1E] border-4 border-[#E86AA8] rounded-sm shadow-[0_0_35px_rgba(232,106,168,0.35)] p-3 sm:p-5 relative overflow-hidden">
        
        {/* Retro Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#E86AA8]/60 pb-2 mb-3 text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#4FD1C5] text-[#0B0B1A] font-extrabold px-2 py-0.5 rounded-xs tracking-widest text-[11px] animate-pulse">
              ARCADE 1985
            </span>
            <span className="text-[#E86AA8] font-bold text-xs sm:text-sm tracking-wider">
              NIVEL 6 // MATRIZ DE BOTS: CONTENCIÓN DE DOGPILING
            </span>
          </div>
          <div className="flex items-center gap-3 text-[#EDEBFA] text-[11px]">
            <span>1UP <strong className="text-[#4FD1C5]">{arcadeScore}</strong></span>
            <span>WAVE <strong className="text-[#F2B544]">01/01</strong></span>
            <span>TARGETS <strong className="text-[#E86AA8]">{bots.filter(b => !b.isDestroyed).length} BOTS</strong></span>
          </div>
        </div>

        {/* Phase 1: BRIEFING */}
        {phase === 'BRIEFING' && (
          <div className="bg-[#0A0A16] border border-[#5E4FA2]/60 p-4 sm:p-5 rounded-xs space-y-4">
            <div className="flex items-start gap-3">
              <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="firm" size={54} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E86AA8]">CADETE {playerName.toUpperCase()} // INFORME DE INTELIGENCIA MEDIÁTICA:</span>
                  <SpeakerButton 
                    textToSpeak={`Atención Alex. No se trata de usuarios reales indignados. Diego ha liberado una granja automatizada de bots programados para ejecutar un ataque coordinado o dogpiling contra Vale. El objetivo es hostigarla en masa para que renuncie por agotamiento. Entra a la consola arcade de 1985 para neutralizar los enjambres de bots.`}
                    size="sm"
                    label="Escuchar"
                  />
                </div>
                <p className="text-xs sm:text-sm text-[#EDEBFA] mt-1 leading-relaxed">
                  «No son opiniones espontáneas: Diego programó una <strong>red automatizada de cuentas falsas (bots)</strong> para disparar cientos de mensajes hostiles al mismo tiempo contra Vale. En alfabetización mediática esto se llama <strong>Dogpiling (Acoso en jauría)</strong> y busca provocar el <em>chilling effect</em>: silenciar a la víctima por agotamiento psicológico.»
                </p>
              </div>
            </div>

            {/* AMI Concept Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#151028] p-3 rounded-xs border border-[#E86AA8]/40 text-xs">
              <div className="space-y-1">
                <span className="text-[#F2B544] font-bold block flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  ¿QUÉ ES EL DOGPILING?
                </span>
                <p className="text-[#A6A2C5] text-[11px] leading-snug">
                  Un ataque masivo y coordinado donde grupos de usuarios o bots bombardean con hostigamiento a una persona para aplastarla y sacarla de las redes.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[#4FD1C5] font-bold block flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  REGLA DE ORO DE LA UNESCO (AMI)
                </span>
                <p className="text-[#A6A2C5] text-[11px] leading-snug">
                  <em>«No alimentes al troll»</em>. Pelear con bots premia a los algoritmos de odio. Lo efectivo es aislar la red, documentar el script y dar apoyo visible a la víctima.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  sound.playBlip();
                  setPhase('ARCADE_MINIGAME');
                }}
                className="px-6 py-2.5 bg-[#E86AA8] hover:bg-[#f085ba] text-[#0B0B1A] font-extrabold text-xs sm:text-sm rounded-xs tracking-wider cursor-pointer shadow-[0_0_15px_rgba(232,106,168,0.4)] transition-all inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>INICIAR BOT INVADERS 1985 // INSERT COIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: ARCADE SPACE INVADERS MINIGAME */}
        {phase === 'ARCADE_MINIGAME' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#150E28] px-3 py-1.5 border border-[#E86AA8]/40 rounded-xs text-xs">
              <span className="text-[#EDEBFA] font-bold text-[11px]">
                👾 DESARTICULA EL ENJAMBRE CON EL HAZ DE CONTRANARRATIVA
              </span>
              <span className="text-[#E86AA8] text-[11px]">
                RESTANTES: {bots.filter(b => !b.isDestroyed).length} BOTS
              </span>
            </div>

            {/* CRT Screen Frame */}
            <div className="w-full h-72 sm:h-80 bg-[#080512] border-2 border-[#E86AA8] rounded-xs relative overflow-hidden shadow-inner flex flex-col justify-between">
              
              {/* Scanline CRT overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(232,106,168,0)_50%,rgba(0,0,0,0.45)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

              {/* Bot formation */}
              <div className="absolute inset-0 overflow-hidden">
                {bots.map(b => {
                  if (b.isDestroyed) return null;
                  return (
                    <div
                      key={b.id}
                      className="absolute transform -translate-x-1/2 flex flex-col items-center transition-all"
                      style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    >
                      <div className="p-1 px-2 bg-[#280D1E] border border-[#E86AA8] text-[#E86AA8] rounded-xs text-[10px] flex items-center gap-1 shadow-[0_0_8px_rgba(232,106,168,0.6)] animate-pulse">
                        <Bot className="w-3.5 h-3.5" />
                        <span className="font-bold text-[9px]">BOT #{b.id}</span>
                      </div>
                      <span className="text-[8px] text-[#A6A2C5] mt-0.5 font-mono-tech">«FUERA VALE»</span>
                    </div>
                  );
                })}

                {/* Laser beam render */}
                {laserPulse && (
                  <div
                    className="absolute bottom-10 w-2.5 bg-[#4FD1C5] shadow-[0_0_15px_#4FD1C5] transform -translate-x-1/2 z-10"
                    style={{ left: `${laserPulse.x}%`, top: '15%', height: '75%' }}
                  />
                )}

                {/* Player Cannon */}
                <div
                  className="absolute bottom-3 transform -translate-x-1/2 flex flex-col items-center z-20"
                  style={{ left: `${playerX}%` }}
                >
                  <div className="w-12 h-6 bg-[#4FD1C5] rounded-t-xs border border-white shadow-[0_0_15px_#4FD1C5] flex items-center justify-center text-[9px] font-bold text-[#0B0B1A]">
                    K-85
                  </div>
                  <div className="w-20 h-2 bg-[#E86AA8] rounded-b-xs" />
                </div>
              </div>

              {/* Bottom retro label */}
              <div className="border-t border-[#E86AA8]/30 p-1 text-center text-[10px] text-[#8F8CA8] z-20">
                MODERACIÓN COMUNITARIA Y BLOQUEO MASIVO DE SCRIPTS
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={() => movePlayer(-12)}
                  className="px-4 py-2 bg-[#1E1232] hover:bg-[#2C1848] text-[#E86AA8] border border-[#E86AA8]/60 rounded-xs font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>IZQ</span>
                </button>
                <button
                  onClick={() => movePlayer(12)}
                  className="px-4 py-2 bg-[#1E1232] hover:bg-[#2C1848] text-[#E86AA8] border border-[#E86AA8]/60 rounded-xs font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>DER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={fireFactCheckBeam}
                className="flex-1 py-2 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-extrabold text-xs sm:text-sm rounded-xs tracking-wider cursor-pointer shadow-[0_0_12px_rgba(79,209,197,0.5)] flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>DISPARAR HAZ SOLIDARIO (ESPACIO)</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: ETHICAL DECISION */}
        {phase === 'ETHICAL_DECISION' && (
          <div className="space-y-4 bg-[#0A0A16] border border-[#5E4FA2]/60 p-4 sm:p-5 rounded-xs">
            <div className="border-b border-[#5E4FA2]/40 pb-2">
              <span className="text-[10px] bg-[#E86AA8]/20 text-[#E86AA8] px-2 py-0.5 rounded font-bold">
                DILEMA ÉTICO ANTE EL ACOSO MASIVO (DOGPILING)
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#EDEBFA] mt-1">
                ¿Cómo frenar un linchamiento digital organizado?
              </h3>
              <p className="text-xs text-[#A6A2C5] mt-1 leading-snug">
                El canal oficial de Vale está recibiendo más de 200 comentarios idénticos por minuto exigiendo que renuncie. Vale se siente angustiada y piensa apagar su cuenta para siempre.
              </p>
            </div>

            {/* Neutral Choices */}
            <div className="space-y-2.5">
              <button
                onClick={() => handleConfirmDecision('A')}
                className={`w-full p-3 rounded-xs border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  selectedChoice === 'A'
                    ? 'bg-[#182638] border-[#4FD1C5]'
                    : 'bg-[#141228] border-[#5E4FA2]/60 hover:border-[#4FD1C5]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#EDEBFA]">
                  <span className="px-1.5 py-0.5 bg-[#202048] border border-[#5E4FA2] rounded text-[10px] text-[#A6A2C5]">
                    OPCIÓN A
                  </span>
                  <span className="text-[#4FD1C5]">Aislar los bots y activar contranarrativa solidaria</span>
                </div>
                <p className="text-xs text-[#A6A2C5] mt-0.5">
                  «No pelear con los bots ni alimentar el algoritmo. Aplicar el bloqueo masivo del script de Diego, documentar la IP del ataque y llenar el canal con mensajes públicos y visibles de respaldo al trabajo de Vale.»
                </p>
              </button>

              <button
                onClick={() => handleConfirmDecision('B')}
                className={`w-full p-3 rounded-xs border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  selectedChoice === 'B'
                    ? 'bg-[#182638] border-[#4FD1C5]'
                    : 'bg-[#141228] border-[#5E4FA2]/60 hover:border-[#4FD1C5]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#EDEBFA]">
                  <span className="px-1.5 py-0.5 bg-[#202048] border border-[#5E4FA2] rounded text-[10px] text-[#A6A2C5]">
                    OPCIÓN B
                  </span>
                  <span className="text-[#8F8CA8]">Pelear insulto por insulto con cada bot</span>
                </div>
                <p className="text-xs text-[#A6A2C5] mt-0.5">
                  «Entrar a contestar uno por uno a los 200 bots con rabia e insultos para demostrarles que no les tenemos miedo en el chat.»
                </p>
              </button>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="p-3 bg-[#0C1226] border border-[#4FD1C5]/50 rounded-xs space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  {selectedChoice === 'A' ? (
                    <span className="text-[#4FD1C5] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      ¡RESPUESTA ESTRATÉGICA AMI! (+15 PUNTOS DE EMPATÍA)
                    </span>
                  ) : (
                    <span className="text-[#D7263D] font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      ERROR FORMATIVO: CAÍSTE EN LA TRAMPA DEL TROLL (-15 PUNTOS)
                    </span>
                  )}
                </div>
                <p className="text-[#EDEBFA] text-[11px] leading-relaxed">
                  {selectedChoice === 'A'
                    ? 'Exacto. Los ataques de bots y dogpiling están programados para desgastar a la persona hasta silenciarla. Responderles solo amplifica la visibilidad del odio en los algoritmos. La estrategia validada por UNESCO (AMI) consiste en silenciar la granja de bots, extraer el script como evidencia judicial y crear un cerco solidario de apoyo humano.'
                    : 'Atención: Contestar a granjas de bots es una trampa. No tienen sentimientos ni argumentos: cada respuesta tuya le da más alcance al ataque algorítmico y agota a la víctima. No alimentes al troll.'}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleAdvanceToNext}
                    className="px-5 py-2 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-extrabold text-xs rounded-xs cursor-pointer shadow-md transition-colors"
                  >
                    CONTINUAR Y REGISTRAR PRUEBA #6 ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
