import React, { useState, useEffect } from 'react';
import { PlayerGender } from '../types/game';
import { CharacterPortrait } from './CharacterPortraits';
import { sound } from '../services/audio';
import { speech } from '../services/speech';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Gamepad2, 
  MousePointerClick, 
  ShieldCheck, 
  Sparkles,
  Bot
} from 'lucide-react';

interface GalacticIntroSequenceProps {
  gender: PlayerGender;
  onStartLevel: () => void;
}

export const GalacticIntroSequence: React.FC<GalacticIntroSequenceProps> = ({
  gender,
  onStartLevel
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const playerName = gender === 'hombre' ? 'Alex' : 'Alexia';

  const introSpeechText = `¡Hola, cadete ${playerName}! Te doy la bienvenida a la estación espacial KUNTUR. Soy la Voz Galáctica, tu asistente de a bordo. En esta aventura, tu rol es ser el compañero leal de Vale: deberás investigar pistas, tomar buenas decisiones y frenar el ciberacoso para proteger a tu amiga. Los controles son muy fáciles: solo haz clic o toca los botones en pantalla para responder, pulsa los altavoces morados para escuchar las preguntas con mi voz, y usa tu ratón o las flechas del teclado en los minijuegos. ¡Cada buena acción suma puntos y consigue pruebas reales! ¿Todo listo? ¡Vamos al taller!`;

  useEffect(() => {
    // Listen to speech narrator state
    const unsubscribe = speech.addListener((speaking) => {
      setIsSpeaking(speaking);
    });

    // Auto-narrate intro after a brief delay if auto-read is active
    const timer = setTimeout(() => {
      if (speech.isAutoRead()) {
        speech.speak(introSpeechText);
        setHasStartedAudio(true);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      speech.stop();
    };
  }, [gender, introSpeechText]);

  const handleToggleAudio = () => {
    if (isSpeaking) {
      speech.stop();
    } else {
      sound.playBlip();
      speech.speak(introSpeechText);
      setHasStartedAudio(true);
    }
  };

  const handleStart = () => {
    sound.playBlip();
    speech.stop();
    onStartLevel();
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0F0F26] border-2 border-[#4FD1C5] rounded-sm p-4 sm:p-6 shadow-[0_0_30px_rgba(79,209,197,0.25)] flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* Background cyber grid & scanline aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(#4FD1C5_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4FD1C5] to-transparent animate-pulse" />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-[#5E4FA2]/60 pb-3 mb-4 flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xs bg-[#4FD1C5]/20 border border-[#4FD1C5] flex items-center justify-center text-[#4FD1C5] animate-pulse">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono-tech tracking-widest text-[#4FD1C5] uppercase font-bold flex items-center gap-1.5">
              <span>● ENLACE CUÁNTICO ACTIVO</span>
              <span className="text-[#F2B544]">// TRANSMISIÓN INTRANET KUNTUR</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA]">
              SECUENCIA INTRODUCTORIA // VOZ GALÁCTICA
            </h2>
          </div>
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={handleToggleAudio}
          className={`px-3 py-1.5 rounded-xs font-mono-tech text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border ${
            isSpeaking 
              ? 'bg-[#E86AA8] text-[#0B0B1A] border-[#E86AA8] shadow-[0_0_12px_rgba(232,106,168,0.5)] animate-pulse' 
              : 'bg-[#1F1836] hover:bg-[#2C224D] text-[#EDEBFA] border-[#5E4FA2]'
          }`}
          title="Escuchar explicación con Voz Galáctica"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Pausar Voz Galáctica</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#4FD1C5]" />
              <span>{hasStartedAudio ? 'Repetir Audio' : 'Escuchar Voz Galáctica'}</span>
            </>
          )}
        </button>
      </div>

      {/* Futuristic Hologram Waveform & Identity Card */}
      <div className="bg-[#151532] border border-[#5E4FA2] rounded-xs p-3.5 mb-4 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          {/* AI Holo Avatar */}
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="w-16 h-16 rounded-xs bg-[#09091A] border-2 border-[#4FD1C5] flex flex-col items-center justify-center text-[#4FD1C5] shadow-[0_0_15px_rgba(79,209,197,0.3)]">
              <Bot className="w-8 h-8 animate-bounce duration-1000" />
              <span className="text-[9px] font-mono-tech font-bold text-[#EDEBFA] mt-0.5">IA KUNTUR</span>
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#4FD1C5] rounded-full animate-ping" />
            )}
          </div>

          {/* Sound Wave Bars Animation */}
          <div className="flex-1 space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs font-mono-tech font-bold text-[#4FD1C5] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
                <span>COMUNICADOR ESPACIAL KUNTUR // VOZ ACTIVA</span>
              </div>
              <div className="flex items-center gap-1 h-3 mx-auto sm:mx-0">
                {[40, 80, 60, 100, 75, 45, 90, 65, 30, 85, 50].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isSpeaking ? 'bg-[#4FD1C5]' : 'bg-[#5E4FA2]/50'
                    }`}
                    style={{
                      height: isSpeaking ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : '25%',
                      transitionDelay: `${i * 30}ms`
                    }}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed">
              «¡Hola, <strong>{playerName}</strong>! Te doy la bienvenida a la estación espacial. Soy tu <strong>Voz Galáctica</strong>. Aquí tienes todo lo que necesitas saber para tu primera misión:»
            </p>
          </div>

          {/* Player Portrait */}
          <div className="hidden sm:flex flex-col items-center bg-[#0C0C20] p-2 rounded-xs border border-[#5E4FA2]/50 shrink-0">
            <CharacterPortrait type={gender === 'hombre' ? 'ale_hombre' : 'ale_mujer'} mood="firm" size={52} />
            <span className="text-[10px] font-mono-tech text-[#4FD1C5] font-bold mt-1">
              CADETE {playerName.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Two Explanatory Blocks for 10-Year-Olds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 relative z-10">
        
        {/* Block 1: Player's Role */}
        <div className="bg-[#12122A] border-2 border-[#5E4FA2] p-3.5 rounded-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech font-bold text-[#E86AA8]">
              <ShieldCheck className="w-4 h-4 text-[#E86AA8]" />
              <span>1. TU ROL EN LA ESTACIÓN ESPACIAL</span>
            </div>
            <ul className="text-xs text-[#EDEBFA] space-y-2 mt-2 leading-snug">
              <li className="flex items-start gap-2">
                <span className="text-sm">🤝</span>
                <span><strong>El mejor amigo de Vale:</strong> Eres su compañero de turno en el taller y su apoyo principal ante cualquier problema.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">🔍</span>
                <span><strong>Investigador de la verdad:</strong> Reunirás 5 pruebas reales (coartadas, metadatos y grabaciones) para desmontar el video falso.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">🛡️</span>
                <span><strong>Protector contra el ciberacoso:</strong> Aprenderás que nunca se debe reenviar ni reírse de burlas, sino poner un alto firme.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1F142B] p-2 rounded-xs border border-[#E86AA8]/30 text-[11px] text-[#F2B544] font-mono-tech">
            ⭐ <strong>Recuerda:</strong> Defender a un compañero siempre suma puntos y protege al equipo.
          </div>
        </div>

        {/* Block 2: Controls & How to Play */}
        <div className="bg-[#12122A] border-2 border-[#4FD1C5] p-3.5 rounded-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech font-bold text-[#4FD1C5]">
              <Gamepad2 className="w-4 h-4 text-[#4FD1C5]" />
              <span>2. CÓMO JUGAR // CONTROLES SENCILLOS</span>
            </div>
            <ul className="text-xs text-[#EDEBFA] space-y-2 mt-2 leading-snug">
              <li className="flex items-start gap-2">
                <MousePointerClick className="w-4 h-4 text-[#4FD1C5] shrink-0 mt-0.5" />
                <span><strong>Toca o haz clic:</strong> Elige tus respuestas en pantalla haciendo clic en las opciones A, B o C.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">🔊</span>
                <span><strong>Escucha con Voz Galáctica:</strong> Cada diálogo y pregunta tiene su parlante para que no tengas que leer mucho si prefieres escuchar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm">🕹️</span>
                <span><strong>Minijuegos en cada nivel:</strong> Calibra frecuencias, vuela con mochila en gravedad cero, escanea fotos y pilota la nave KUNTUR.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0C1E20] p-2 rounded-xs border border-[#4FD1C5]/30 text-[11px] text-[#4FD1C5] font-mono-tech">
            🎮 <strong>Controles de minijuegos:</strong> Usa las <strong>flechas del teclado</strong> o los botones táctiles en pantalla.
          </div>
        </div>

      </div>

      {/* Start Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#5E4FA2]/50 relative z-10">
        <div className="text-xs text-[#EDEBFA]/80 font-mono-tech text-center sm:text-left flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4FD1C5] animate-ping" />
          <span>¡Todo listo para entrar al Taller de Mantenimiento!</span>
        </div>

        <button
          onClick={handleStart}
          className="w-full sm:w-auto px-6 py-3 bg-[#4FD1C5] hover:bg-[#6EE4D9] text-[#0B0B1A] font-extrabold font-mono-tech text-xs sm:text-sm rounded-xs flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_20px_rgba(79,209,197,0.4)] hover:shadow-[0_0_30px_rgba(79,209,197,0.6)] transition-all transform hover:-translate-y-0.5"
        >
          <span>¡ENTENDIDO! EMPEZAR MISIÓN CON VALE</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
