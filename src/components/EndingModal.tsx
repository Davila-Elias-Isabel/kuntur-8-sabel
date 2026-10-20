import React from 'react';
import { RotateCcw, ExternalLink, ShieldCheck, AlertOctagon, HelpCircle, CheckCircle2, Lightbulb, BookOpen } from 'lucide-react';
import { GameMetrics, DecisionLogEntry, PlayerGender } from '../types/game';
import { sound } from '../services/audio';

interface EndingModalProps {
  metrics: GameMetrics;
  gender: PlayerGender;
  decisionLog: DecisionLogEntry[];
  onRestart: () => void;
  onOpenPedagogy: () => void;
  onOpenReflectionNotes: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  metrics,
  decisionLog,
  onRestart,
  onOpenPedagogy,
  onOpenReflectionNotes
}) => {
  const puntos = metrics.puntos;

  const outcome = (() => {
    if (puntos < 40) {
      return {
        badge: 'ESTADO CRÍTICO // COHESIÓN FRACTURADA',
        badgeColor: 'border-[#D7263D] text-[#D7263D]',
        title: 'FINAL: APAGÓN',
        titleColor: 'text-[#D7263D]',
        subtitle: 'Vale tuvo que renunciar porque nadie la apoyó frente a las burlas',
        icon: <AlertOctagon className="w-8 h-8 text-[#D7263D]" />,
        narrative: 
          'El chisme creció en el chat grupal porque muchos se rieron o lo reenviaron. Al sentirse sola y sin respaldo de sus compañeros, Vale pidió su traslado lejos de la base espacial. KUNTUR perdió a su mejor ingeniera. 💡 Recuerda: quedarte callado o reírte no es inofensivo; ayuda a que el acoso crezca.'
      };
    } else if (puntos <= 75) {
      return {
        badge: 'ESTADO INCIERTO // RESOLUCIÓN PARCIAL',
        badgeColor: 'border-[#F2B544] text-[#F2B544]',
        title: 'FINAL: INTERFERENCIA',
        titleColor: 'text-[#F2B544]',
        subtitle: 'El video se borró, pero quedó la desconfianza en el equipo',
        icon: <HelpCircle className="w-8 h-8 text-[#F2B544]" />,
        narrative: 
          'El video falso fue eliminado de los canales, pero no todos aprendieron la lección. Vale conserva su puesto, pero aún siente tristeza porque el grupo no habló con empatía. 💡 Recuerda: para cuidar a tu equipo, no basta con borrar el archivo; hay que escuchar y respaldar a quien fue lastimado.'
      };
    } else {
      return {
        badge: 'MISIÓN CUMPLIDA // TESTIGO ACTIVO EJEMPLAR',
        badgeColor: 'border-[#4FD1C5] text-[#4FD1C5]',
        title: 'FINAL: CONSTELACIÓN ÉTICA',
        titleColor: 'text-[#4FD1C5]',
        subtitle: '¡Frenaste el ciberacoso y demostraste la verdad con pruebas!',
        icon: <ShieldCheck className="w-8 h-8 text-[#4FD1C5]" />,
        narrative: 
          '¡Misión cumplida! Pusiste un alto a los comentarios tóxicos, reuniste las 4 pruebas de la verdad y apoyaste a Vale ante el Consejo. La Comandante Rosa ratificó a Vale como líder técnica y Diego enfrentará un proceso formativo. ¡Demostraste que ser un buen compañero cambia todo!'
      };
    }
  })();

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#15152E] border-2 border-[#5E4FA2] shadow-2xl rounded-sm p-5 sm:p-7 flex flex-col items-center my-auto">
        
        {/* Outcome Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className={`px-3 py-1 border rounded-xs font-mono-tech text-xs font-bold tracking-widest mb-2 ${outcome.badgeColor}`}>
            {outcome.badge}
          </div>
          <div className="flex items-center gap-3">
            {outcome.icon}
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-wider font-mono-tech ${outcome.titleColor}`}>
              {outcome.title}
            </h1>
          </div>
          <h2 className="text-xs sm:text-sm text-[#EDEBFA]/80 mt-1 font-medium">
            {outcome.subtitle}
          </h2>
        </div>

        {/* Narrative Box */}
        <div className="w-full bg-[#0D0D24] border-l-4 border-[#5E4FA2] p-4 text-xs sm:text-sm text-[#EDEBFA] leading-relaxed mb-4 font-medium">
          {outcome.narrative}
        </div>

        {/* Prominent Reflection Notes Banner Button */}
        <div className="w-full mb-5 bg-[#0B2124] border-2 border-[#4FD1C5] p-3.5 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-[#4FD1C5]/20 text-[#4FD1C5] rounded-xs shrink-0 mt-0.5 sm:mt-0">
              <Lightbulb className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#4FD1C5] font-mono-tech">
                NOTITAS PEDAGÓGICAS // ¿QUÉ PROVOCAMOS AL APOYAR O RECHAZAR EL ACOSO?
              </div>
              <p className="text-[11px] text-[#EDEBFA]/90">
                Aclaración de dudas conceptuales (deepfakes, metadatos, IP), claves de la narrativa y protocolo de acción real.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              onOpenReflectionNotes();
            }}
            className="px-4 py-2 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md transition-all shrink-0"
          >
            <span>Ver Notitas y Dudas</span>
            <Lightbulb className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Complete Decisions Breakdown: Why did comments add or subtract points? */}
        <div className="w-full bg-[#101026] border border-[#5E4FA2]/50 p-4 rounded-xs mb-5 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-[#5E4FA2]/30 pb-2">
            <span className="text-xs font-bold font-mono-tech text-[#4FD1C5] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              DESGLOSE PEDAGÓGICO DE DECISIONES // EVALUACIÓN DE RESPUESTAS
            </span>
            <span className="text-xs font-mono-tech font-bold text-[#F2B544]">
              PUNTAJE FINAL: {puntos} / 100
            </span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {decisionLog.map((log, idx) => (
              <div key={idx} className={`p-3 rounded-xs border text-xs space-y-1 ${
                log.pointsDelta > 0 
                  ? 'bg-[#0B1E22] border-[#4FD1C5]/40 text-[#EDEBFA]' 
                  : 'bg-[#210D16] border-[#D7263D]/40 text-[#EDEBFA]'
              }`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#8F8CA8]">{log.levelTitle}</span>
                  <span className={`font-mono-tech font-bold ${log.pointsDelta > 0 ? 'text-[#4FD1C5]' : 'text-[#D7263D]'}`}>
                    {log.pointsDelta > 0 ? `+${log.pointsDelta}` : log.pointsDelta} pts
                  </span>
                </div>
                <div className="italic text-[#EDEBFA]/90">
                  Tu respuesta elegida: «{log.chosenComment}»
                </div>
                <div className={`text-[11px] pt-1 ${log.pointsDelta > 0 ? 'text-[#4FD1C5]' : 'text-[#F2B544]'}`}>
                  {log.pointsDelta > 0 ? '✓ Justificación formativa:' : '⚠️ Motivo de la penalización:'} {log.whyThisMatters}
                </div>
                <div className="text-[10px] text-[#A6A2C5]">
                  Impacto en la vida real: {log.realWorldImpact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PUENTE A LA TIERRA // Real-World UNESCO Data & Peru Helplines */}
        <section className="w-full bg-[#E86AA8]/10 border border-[#E86AA8] rounded-xs p-4 sm:p-5 mb-5 text-left">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono-tech font-bold text-[#E86AA8] tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E86AA8] animate-ping" />
              PUENTE A LA TIERRA // EVIDENCIA CIENTÍFICA (UNESCO 2024 & PERÚ)
            </span>
            <button
              onClick={onOpenPedagogy}
              className="text-[11px] text-[#4FD1C5] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              Ver Matriz de las 5D del Testigo Activo &gt;
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed mb-3 italic">
            «La violencia de género facilitada por la tecnología (TFGBV) se ha recrudecido con la Inteligencia Artificial generativa. Los deepfakes y contenidos sintéticos se instrumentalizan desproporcionadamente para deslegitimar, hostigar y desplazar a mujeres en el ámbito académico, científico, laboral y político.»
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0A0A1C] p-3 border border-[#5E4FA2]/40 rounded-xs mb-3 text-xs">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-[#E86AA8] font-mono-tech">96%</span>
              <span className="text-[#A6A2C5] text-[11px]">de los deepfakes no consentidos en plataformas digitales atacan a mujeres (UNESCO).</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-[#4FD1C5] font-mono-tech">LÍNEA 100</span>
              <span className="text-[#A6A2C5] text-[11px]">Servicio gratuito y confidencial 24/7 en Perú (MIMP) y Chat 100 ante casos de acoso y violencia digital.</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href="https://stopncii.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#15152E] hover:bg-[#1C1838] border border-[#5E4FA2] rounded-xs text-[#4FD1C5] flex items-center gap-1 text-[11px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              StopNCII.org (Bloqueo preventivo de imágenes íntimas sin subir archivos a la nube)
            </a>
            <a
              href="https://takeitdown.ncmec.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#15152E] hover:bg-[#1C1838] border border-[#5E4FA2] rounded-xs text-[#E86AA8] flex items-center gap-1 text-[11px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Take It Down (Remoción para menores de 18 años)
            </a>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="w-full flex items-center justify-between gap-3 pt-2 border-t border-[#5E4FA2]/40">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPedagogy}
              className="text-xs text-[#8F8CA8] hover:text-[#4FD1C5] underline font-mono-tech cursor-pointer"
            >
              Matriz 5D
            </button>
            <button
              onClick={onOpenReflectionNotes}
              className="text-xs text-[#4FD1C5] hover:underline font-mono-tech cursor-pointer flex items-center gap-1 font-semibold"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Notitas de Reflexión</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              onRestart();
            }}
            className="px-6 py-2.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-extrabold font-mono-tech text-xs rounded-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar Experiencia
          </button>
        </div>

      </div>
    </div>
  );
};
