import React from 'react';
import { X, BookOpen, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';

interface PedagogyModalProps {
  onClose: () => void;
}

export const PedagogyModal: React.FC<PedagogyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#15152E] border-2 border-[#E86AA8] shadow-2xl rounded-sm p-5 sm:p-6 my-auto text-left max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#5E4FA2] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E86AA8]" />
            <h2 className="text-sm sm:text-base font-bold text-[#E86AA8] tracking-wider font-mono-tech">
              GUÍA METODOLÓGICA Y PROTOCOLO EDUCATIVO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#201D3D] rounded-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Introduction */}
        <div className="text-xs sm:text-sm text-[#EDEBFA] leading-snug mb-3.5 bg-[#0C0C22] p-3 rounded-xs border border-[#5E4FA2]/50">
          <p>
            <strong>KUNTUR</strong> enseña a niños y adolescentes a no quedarse callados frente al <strong>ciberacoso escolar y la manipulación digital</strong>. Ayuda a pasar de ser un testigo pasivo a un <strong>compañero activo</strong> que frena el daño con empatía y pruebas.
          </p>
        </div>

        {/* 4 Steps Protocol */}
        <div className="bg-[#0D0D24] border-l-4 border-[#4FD1C5] p-3 mb-4 rounded-xs">
          <h3 className="text-xs font-bold font-mono-tech text-[#4FD1C5] mb-2 uppercase tracking-wide">
            Protocolo de 4 Pasos: ¿Cómo actuar si ves ciberacoso?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#EDEBFA]">
            <div className="bg-[#14122E] p-2 rounded-xs border border-[#5E4FA2]/30">
              <span className="font-mono-tech font-bold text-[#4FD1C5]">1. PAUSAR:</span> No compartas el mensaje ni te rías. Si no reenvías, el chisme se apaga.
            </div>
            <div className="bg-[#14122E] p-2 rounded-xs border border-[#5E4FA2]/30">
              <span className="font-mono-tech font-bold text-[#4FD1C5]">2. DOCUMENTAR:</span> Toma captura de pantalla con hora y remitente para guardar la prueba.
            </div>
            <div className="bg-[#14122E] p-2 rounded-xs border border-[#5E4FA2]/30">
              <span className="font-mono-tech font-bold text-[#4FD1C5]">3. APOYAR:</span> Escríbele a la víctima en privado: <em>«Sé que es falso, estoy contigo»</em>.
            </div>
            <div className="bg-[#14122E] p-2 rounded-xs border border-[#5E4FA2]/30">
              <span className="font-mono-tech font-bold text-[#4FD1C5]">4. AVISAR:</span> Pide ayuda a profesores, tutores escolares o autoridades de confianza.
            </div>
          </div>
        </div>

        {/* 5D Model Matrix - Condensed and clear */}
        <div className="mb-4">
          <h3 className="text-xs font-bold font-mono-tech text-[#F2B544] mb-2 uppercase tracking-wide">
            Estrategia de las 5D del Testigo Activo (Adaptada para Escolares)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-[#181838] p-2.5 rounded-xs border-l-3 border-[#4FD1C5]">
              <strong className="text-[#4FD1C5] font-mono-tech">1. DIRECTA:</strong> Decirle con calma al acosador: <em>«Oye, deja de molestarla»</em>.
            </div>
            <div className="bg-[#181838] p-2.5 rounded-xs border-l-3 border-[#4FD1C5]">
              <strong className="text-[#4FD1C5] font-mono-tech">2. DISTRAER:</strong> Cambiar de tema en el chat para romper la burla.
            </div>
            <div className="bg-[#181838] p-2.5 rounded-xs border-l-3 border-[#4FD1C5]">
              <strong className="text-[#4FD1C5] font-mono-tech">3. DELEGAR:</strong> Avisar al profesor, tutor o moderador del grupo.
            </div>
            <div className="bg-[#181838] p-2.5 rounded-xs border-l-3 border-[#4FD1C5]">
              <strong className="text-[#4FD1C5] font-mono-tech">4. DOCUMENTAR:</strong> Guardar las capturas de pantalla de la agresión.
            </div>
            <div className="bg-[#181838] p-2.5 rounded-xs border-l-3 border-[#4FD1C5] sm:col-span-2">
              <strong className="text-[#4FD1C5] font-mono-tech">5. DAR APOYO:</strong> Escuchar a tu compañero/a afectado/a sin juzgarlo.
            </div>
          </div>
        </div>

        {/* Ethical Rule Reminder */}
        <div className="bg-[#090919] border border-[#5E4FA2]/50 p-2.5 rounded-xs text-[11px] text-[#A6A2C5] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#E86AA8] shrink-0" />
          <span><strong>Regla de oro:</strong> Nunca culpes a la víctima ni le exijas que demuestre su inocencia.</span>
        </div>

        {/* Author / Credits Box */}
        <div className="mt-3 bg-[#0C0C22] border border-[#4FD1C5]/40 p-3 rounded-xs text-[11px] text-[#A6A2C5] space-y-1">
          <div className="font-bold text-[#4FD1C5] font-mono-tech flex items-center gap-1.5 text-xs">
            <span>👩‍🚀 AUTORÍA Y DIRECCIÓN DEL PROYECTO:</span>
          </div>
          <p className="text-[#EDEBFA] leading-relaxed">
            <strong>Rocío Dávila Elías</strong> — Administradora técnica titulada, ingeniera empresarial y de sistemas en formación y voluntaria en UNESCO Perú en temas de Alfabetización Mediática e Informacional (AMI), género y prevención de la violencia digital. Proyecto desarrollado de forma independiente como Recurso Educativo Abierto (REA) para empoderar a comunidades escolares.
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
          >
            Entendido, volver al juego
          </button>
        </div>

      </div>
    </div>
  );
};
