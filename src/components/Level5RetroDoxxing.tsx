import React, { useState, useEffect, useRef } from 'react';
import { PlayerGender, ClueItem, DecisionLogEntry } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { SpeakerButton } from './SpeakerButton';
import { sound } from '../services/audio';
import { speech } from '../services/speech';
import { Shield, ShieldAlert, CheckCircle2, AlertTriangle, Terminal, Sparkles, HelpCircle, HardDrive, Cpu, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface Level5RetroDoxxingProps {
  gender: PlayerGender;
  onCompleteLevel: (decision: DecisionLogEntry, clue: ClueItem) => void;
  onFailLevel?: () => void;
  onOpenGlossary: () => void;
}

interface DataPacket {
  id: number;
  x: number; // percentage 10 to 90
  y: number; // percentage 0 to 85
  speed: number;
  label: string;
  type: 'doxx_phone' | 'impersonation_profile' | 'private_location' | 'password_leak';
  isNeutralized: boolean;
}

export const Level5RetroDoxxing: React.FC<Level5RetroDoxxingProps> = ({
  gender,
  onCompleteLevel,
  onFailLevel,
  onOpenGlossary
}) => {
  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  // Game phase: 'BRIEFING' -> 'ARCADE_MINIGAME' -> 'ETHICAL_DECISION' -> 'RESOLVED'
  const [phase, setPhase] = useState<'BRIEFING' | 'ARCADE_MINIGAME' | 'ETHICAL_DECISION' | 'RESOLVED'>('BRIEFING');

  // Arcade state
  const [paddleX, setPaddleX] = useState<number>(50); // percentage 10 to 90
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [neutralizedCount, setNeutralizedCount] = useState<number>(0);
  const [laserBeam, setLaserBeam] = useState<{ active: boolean; x: number } | null>(null);
  const [arcadeScore, setArcadeScore] = useState<number>(1984);
  const [integrityPercent, setIntegrityPercent] = useState<number>(100);

  // Decision state
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Spawn packets for the minigame
  useEffect(() => {
    if (phase === 'ARCADE_MINIGAME') {
      sound.playRetroCoin();
      const initialPackets: DataPacket[] = [
        { id: 1, x: 22, y: 10, speed: 0.35, label: 'WHATSAPP_PRIVADO.DAT', type: 'doxx_phone', isNeutralized: false },
        { id: 2, x: 75, y: 5, speed: 0.45, label: 'PERFIL_FALSO_VALE.EXE', type: 'impersonation_profile', isNeutralized: false },
        { id: 3, x: 45, y: -10, speed: 0.38, label: 'CAMAROTE_UBICACION.LOG', type: 'private_location', isNeutralized: false },
        { id: 4, x: 30, y: -25, speed: 0.42, label: 'PASSWORDS_LEAK.HEX', type: 'password_leak', isNeutralized: false },
        { id: 5, x: 65, y: -40, speed: 0.4, label: 'NUMERO_FAMILIARES.RAW', type: 'doxx_phone', isNeutralized: false },
        { id: 6, x: 50, y: -55, speed: 0.48, label: 'CUENTA_IMPOSTORA_2.NET', type: 'impersonation_profile', isNeutralized: false }
      ];
      setPackets(initialPackets);
      setNeutralizedCount(0);
      setIntegrityPercent(100);
    }
  }, [phase]);

  // Main arcade animation loop
  useEffect(() => {
    if (phase !== 'ARCADE_MINIGAME') return;

    const interval = setInterval(() => {
      setPackets(prev => {
        let missedPacket = false;
        const next = prev.map(p => {
          if (p.isNeutralized) return p;
          const nextY = p.y + p.speed;
          if (nextY >= 82) {
            // Leaked to public network
            missedPacket = true;
            return { ...p, y: 82, isNeutralized: true };
          }
          return { ...p, y: nextY };
        });

        if (missedPacket) {
          sound.playSignalDown();
          setIntegrityPercent(prevInt => Math.max(20, prevInt - 15));
        }

        // Check if all are handled
        const allProcessed = next.every(p => p.isNeutralized);
        if (allProcessed && next.length > 0) {
          setTimeout(() => {
            sound.playRetroPowerUp();
            setPhase('ETHICAL_DECISION');
          }, 600);
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [phase]);

  // Keyboard controls for arcade
  useEffect(() => {
    if (phase !== 'ARCADE_MINIGAME') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        movePaddle(-8);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        movePaddle(8);
      } else if (e.key === ' ' || e.key === 'Enter') {
        fire2FAShield();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, paddleX, packets]);

  const movePaddle = (delta: number) => {
    setPaddleX(prev => Math.max(12, Math.min(88, prev + delta)));
  };

  const fire2FAShield = () => {
    sound.playRetroLaser();
    setLaserBeam({ active: true, x: paddleX });
    setTimeout(() => setLaserBeam(null), 180);

    // Check hit on active packet
    setPackets(prev => {
      return prev.map(p => {
        if (!p.isNeutralized && Math.abs(p.x - paddleX) < 14 && p.y > 10 && p.y < 80) {
          sound.playRetroExplosion();
          setArcadeScore(s => s + 250);
          setNeutralizedCount(c => c + 1);
          return { ...p, isNeutralized: true };
        }
        return p;
      });
    });
  };

  // Clue item for Level 5
  const clueDoxxing: ClueItem = {
    id: 'clue_doxxing',
    name: 'Token Forense de Suplantación & Doxxing',
    colloquialName: 'Registro de Perfil Falso y Datos Filtrados',
    category: 'identidad_digital',
    icon: 'Terminal',
    whatItIs: 'Certificado criptográfico de la terminal de Diego que demuestra la creación de un perfil impostor y la publicación no consentida de los datos personales de Vale.',
    howItHelpsInCouncil: 'Demuestra dolo premeditado de doxxing y hostigamiento sistemático para expulsar a Vale de la estación.',
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
      id: 'decision_lvl_5',
      levelNumber: 5,
      levelTitle: 'Nivel 5: Terminal Arcade 1984 // Doxxing & Suplantación',
      situation: 'Filtración masiva de datos privados (doxxing) y cuenta impostora para dañar la reputación de Vale.',
      chosenComment: isOptionA
        ? '«Activamos el protocolo 2FA, reportamos formalmente la cuenta clonada y alertamos a los cadetes sin viralizar los datos íntimos filtrados.»'
        : '«Compartir la captura en todos los canales de la nave para "preguntar a los amigos si es verdad".»',
      isToxic: !isOptionA,
      pointsDelta: isOptionA ? 15 : -15,
      whyThisMatters: isOptionA
        ? 'Frenaste la cadena de doxxing en seco, protegiendo la privacidad de la víctima y aislando al perfil falso.'
        : 'Reenviar capturas de doxxing multiplica el alcance del agresor y revictimiza a la persona afectada.',
      realWorldImpact: 'El doxxing y la suplantación de identidad son formas graves de violencia digital tipificadas por la ley peruana e internacional.'
    };

    onCompleteLevel(decision, clueDoxxing);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-auto p-3 sm:p-5 flex flex-col justify-center font-mono-tech select-none">
      
      {/* 80s CRT Arcade Cabinet Shell */}
      <div className="bg-[#121020] border-4 border-[#4FD1C5] rounded-sm shadow-[0_0_35px_rgba(79,209,197,0.35)] p-3 sm:p-5 relative overflow-hidden">
        
        {/* Retro Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#4FD1C5]/60 pb-2 mb-3 text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#E86AA8] text-[#0B0B1A] font-extrabold px-2 py-0.5 rounded-xs tracking-widest text-[11px] animate-pulse">
              ARCADE 1984
            </span>
            <span className="text-[#4FD1C5] font-bold text-xs sm:text-sm tracking-wider">
              NIVEL 5 // PROTOCOLO ANTI-DOXXING &amp; SUPLANTACIÓN
            </span>
          </div>
          <div className="flex items-center gap-3 text-[#EDEBFA] text-[11px]">
            <span>1UP <strong className="text-[#F2B544]">{arcadeScore}</strong></span>
            <span>HIGH <strong className="text-[#4FD1C5]">99990</strong></span>
            <span>SHIELD <strong className={integrityPercent > 50 ? 'text-[#4FD1C5]' : 'text-[#D7263D]'}>{integrityPercent}%</strong></span>
          </div>
        </div>

        {/* Phase 1: BRIEFING */}
        {phase === 'BRIEFING' && (
          <div className="bg-[#0A0A16] border border-[#5E4FA2]/60 p-4 sm:p-5 rounded-xs space-y-4">
            <div className="flex items-start gap-3">
              <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="concerned" size={54} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4FD1C5]">CADETE {playerName.toUpperCase()} // ALERTA DE SEGURIDAD EN RED:</span>
                  <SpeakerButton 
                    textToSpeak={`Alerta en la estación KUNTUR, cadete ${playerName}. El agresor ha cruzado una línea crítica: creó un perfil falso de Vale en la red comunitaria y filtró su número telefónico privado y su camarote. Esto se llama Doxxing y Suplantación de Identidad. Entra a la consola arcade de 1984 para interceptar la filtración.`}
                    size="sm"
                    label="Escuchar"
                  />
                </div>
                <p className="text-xs sm:text-sm text-[#EDEBFA] mt-1 leading-relaxed">
                  «El agresor ha pasado de los comentarios al <strong>ataque deliberado a la intimidad</strong>: creó un perfil falso con la foto de Vale emitiendo insultos inventados y publicó su número telefónico y la ubicación de su camarote en foros públicos. Esto es <strong>Doxxing y Suplantación de Identidad Digital</strong>.»
                </p>
              </div>
            </div>

            {/* Didactic Concept Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#14122C] p-3 rounded-xs border border-[#4FD1C5]/40 text-xs">
              <div className="space-y-1">
                <span className="text-[#E86AA8] font-bold block flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  ¿QUÉ ES EL DOXXING?
                </span>
                <p className="text-[#A6A2C5] text-[11px] leading-snug">
                  Filtrar intencionalmente datos privados (teléfono, domicilio, fotos no consentidas) para incitar a que desconocidos acosen a la víctima en el mundo real.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[#4FD1C5] font-bold block flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  ¿QUÉ ES LA SUPLANTACIÓN?
                </span>
                <p className="text-[#A6A2C5] text-[11px] leading-snug">
                  Crear perfiles clonados para dañar la reputación social de una persona o engañar a sus contactos haciéndose pasar por ella.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  sound.playBlip();
                  setPhase('ARCADE_MINIGAME');
                }}
                className="px-6 py-2.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-extrabold text-xs sm:text-sm rounded-xs tracking-wider cursor-pointer shadow-[0_0_15px_rgba(79,209,197,0.4)] transition-all inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>INICIAR CONSOLA RETRO 1984 // INSERT COIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: ARCADE MINIGAME (CRT SCREEN) */}
        {phase === 'ARCADE_MINIGAME' && (
          <div className="space-y-3">
            {/* Instruction bar */}
            <div className="flex items-center justify-between bg-[#0E0E28] px-3 py-1.5 border border-[#4FD1C5]/40 rounded-xs text-xs">
              <span className="text-[#EDEBFA] font-bold text-[11px]">
                🎯 MUEVE EL ESCUDO Y DISPARA PULSOS DE CIFRADO 2FA
              </span>
              <span className="text-[#4FD1C5] text-[11px]">
                INTERCEPTADOS: {neutralizedCount} / 6
              </span>
            </div>

            {/* CRT Monitor Viewport */}
            <div className="w-full h-72 sm:h-80 bg-[#060614] border-2 border-[#4FD1C5] rounded-xs relative overflow-hidden shadow-inner flex flex-col justify-between">
              
              {/* Scanline CRT overlay effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,38,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

              {/* CRT top label */}
              <div className="p-2 flex justify-between items-center text-[10px] text-[#4FD1C5]/70 z-20">
                <span>SECTOR DE RED: COMUNICACIONES_PUB</span>
                <span>MODO DEFENSA: FILTRADO ACTIVO</span>
              </div>

              {/* Falling Leaking Data Packets */}
              <div className="absolute inset-0 overflow-hidden">
                {packets.map(p => {
                  if (p.isNeutralized) return null;
                  return (
                    <div
                      key={p.id}
                      className="absolute px-2 py-1 bg-[#24101A] border border-[#E86AA8] text-[#E86AA8] text-[9px] sm:text-[10px] font-bold rounded-xs shadow-[0_0_8px_rgba(232,106,168,0.5)] transform -translate-x-1/2 flex items-center gap-1 transition-all"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    >
                      <AlertTriangle className="w-2.5 h-2.5 text-[#E86AA8]" />
                      <span>{p.label}</span>
                    </div>
                  );
                })}

                {/* Laser beam render */}
                {laserBeam && (
                  <div
                    className="absolute bottom-10 w-2 bg-[#4FD1C5] shadow-[0_0_12px_#4FD1C5] transform -translate-x-1/2 z-10"
                    style={{ left: `${laserBeam.x}%`, top: '10%', height: '80%' }}
                  />
                )}

                {/* Player Paddle / Terminal Shield */}
                <div
                  className="absolute bottom-3 transform -translate-x-1/2 flex flex-col items-center z-20"
                  style={{ left: `${paddleX}%` }}
                >
                  <div className="w-16 sm:w-20 h-5 bg-[#4FD1C5] rounded-xs border border-white shadow-[0_0_15px_#4FD1C5] flex items-center justify-center text-[9px] font-bold text-[#0B0B1A]">
                    ESCUDO 2FA
                  </div>
                  <div className="w-4 h-2 bg-[#E86AA8] rounded-b-xs" />
                </div>
              </div>

              {/* CRT Bottom Grid line */}
              <div className="border-t border-[#4FD1C5]/30 p-1 text-center text-[10px] text-[#8F8CA8] z-20">
                RED DE CADETES // PREVENCIÓN DE DOXXING
              </div>
            </div>

            {/* Touch / Screen Controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={() => movePaddle(-12)}
                  className="px-4 py-2 bg-[#1A1A3A] hover:bg-[#282856] text-[#4FD1C5] border border-[#4FD1C5]/60 rounded-xs font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>IZQ</span>
                </button>
                <button
                  onClick={() => movePaddle(12)}
                  className="px-4 py-2 bg-[#1A1A3A] hover:bg-[#282856] text-[#4FD1C5] border border-[#4FD1C5]/60 rounded-xs font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>DER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={fire2FAShield}
                className="flex-1 py-2 bg-[#E86AA8] hover:bg-[#f085ba] text-[#0B0B1A] font-extrabold text-xs sm:text-sm rounded-xs tracking-wider cursor-pointer shadow-[0_0_12px_rgba(232,106,168,0.5)] flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>DISPARAR PULSO 2FA (ESPACIO)</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: ETHICAL DECISION (AMI & DIGITAL GENDER VIOLENCE) */}
        {phase === 'ETHICAL_DECISION' && (
          <div className="space-y-4 bg-[#0A0A16] border border-[#5E4FA2]/60 p-4 sm:p-5 rounded-xs">
            <div className="border-b border-[#5E4FA2]/40 pb-2">
              <span className="text-[10px] bg-[#F2B544]/20 text-[#F2B544] px-2 py-0.5 rounded font-bold">
                DILEMA ÉTICO DE ALFABETIZACIÓN MEDIÁTICA (AMI)
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#EDEBFA] mt-1">
                La cuenta falsa sigue activa y el número de Vale circula en el chat
              </h3>
              <p className="text-xs text-[#A6A2C5] mt-1 leading-snug">
                El cadete Kevin pregunta en el foro central: <em>«Oigan, me llegó este link al perfil de Vale donde dice que ella odia a la tripulación, y viene con su teléfono. ¿Lo reenviamos al grupo general para que todos opinen?»</em>
              </p>
            </div>

            {/* Neutral Choice Cards */}
            <div className="space-y-2.5">
              {/* Option A */}
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
                  <span className="text-[#4FD1C5]">Protocolo de Identidad y Verificación</span>
                </div>
                <p className="text-xs text-[#A6A2C5] mt-0.5">
                  «No lo reenvíes. Eso es doxxing y suplantación. Vamos a reportar la cuenta falsa al administrador del sistema, activar la verificación 2FA y aclarar en el canal que Vale jamás escribió eso, sin compartir sus datos privados.»
                </p>
              </button>

              {/* Option B */}
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
                  <span className="text-[#8F8CA8]">Reenvío para "advertir a los demás"</span>
                </div>
                <p className="text-xs text-[#A6A2C5] mt-0.5">
                  «Reenviar la captura del perfil falso con su teléfono a todos los canales para "advertirles a los amigos y preguntarles si creen que Vale es capaz de hacer eso".»
                </p>
              </button>
            </div>

            {/* Explanation Post-Decision */}
            {showExplanation && (
              <div className="p-3 bg-[#0C1226] border border-[#4FD1C5]/50 rounded-xs space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  {selectedChoice === 'A' ? (
                    <span className="text-[#4FD1C5] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      ¡DECISIÓN ÉTICA ACERTADA! (+15 PUNTOS DE EMPATÍA)
                    </span>
                  ) : (
                    <span className="text-[#D7263D] font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      ERROR FORMATIVO: REENVIAR AMPLIFICA EL DAÑO (-15 PUNTOS)
                    </span>
                  )}
                </div>
                <p className="text-[#EDEBFA] text-[11px] leading-relaxed">
                  {selectedChoice === 'A'
                    ? 'Excelente criterio AMI. Reenviar un perfil impostor o datos filtrados (aunque sea con buena intención de "advertir") solo ayuda al agresor a viralizar el acoso. La respuesta correcta siempre es reportar la cuenta falsa, activar la autenticación de doble factor y brindar soporte directo a la víctima.'
                    : 'Atención: Reenviar capturas con datos filtrados convierte al testigo en un repetidor involuntario de la violencia digital. Nunca compartas datos privados ajenos.'}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleAdvanceToNext}
                    className="px-5 py-2 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-extrabold text-xs rounded-xs cursor-pointer shadow-md transition-colors"
                  >
                    CONTINUAR Y REGISTRAR PRUEBA #5 ➔
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
