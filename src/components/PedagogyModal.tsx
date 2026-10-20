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
              GUÍA METODOLÓGICA Y PROTOCOLO EDUCATIVO // UNESCO 2024
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
        <div className="text-xs sm:text-sm text-[#EDEBFA] leading-relaxed mb-4">
          <p className="mb-2">
            <strong>KUNTUR</strong> es una experiencia narrativa gamificada diseñada para jóvenes universitarios (18 a 24 años) y comunidades técnicas. Su objetivo pedagógico es superar el <em>Efecto Espectador Digital</em> y fomentar la transición de testigo pasivo a <strong>testigo activo informado</strong> frente a la Violencia de Género Facilitada por la Tecnología (TFGBV) y el abuso basado en imágenes manipuladas con IA generativa.
          </p>
        </div>

        {/* 4 Steps Protocol */}
        <div className="bg-[#0D0D24] border-l-4 border-[#4FD1C5] p-3.5 mb-5 rounded-xs">
          <h3 className="text-xs font-bold font-mono-tech text-[#4FD1C5] mb-2 uppercase tracking-wide">
            Protocolo de 4 Pasos para Testigos Activos en Entornos Digitales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#EDEBFA]">
            <div className="flex items-start gap-2">
              <span className="font-mono-tech font-bold text-[#4FD1C5] text-sm">1.</span>
              <div>
                <strong>PAUSAR:</strong> Cortar el vector de tráfico. No reenviar a grupos cerrados ni reaccionar con emojis o humor que legitimen la agresión.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono-tech font-bold text-[#4FD1C5] text-sm">2.</span>
              <div>
                <strong>DOCUMENTAR:</strong> Guardar enlaces, hashes y metadatos técnicos periciales sin revictimizar ni archivar material explícito de manera innecesaria.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono-tech font-bold text-[#4FD1C5] text-sm">3.</span>
              <div>
                <strong>CONSULTAR:</strong> Abrir canal privado con la persona afectada: <em>«Estoy al tanto de lo que circula. Tú marcas el ritmo: ¿cómo prefieres que actuemos?»</em>.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono-tech font-bold text-[#4FD1C5] text-sm">4.</span>
              <div>
                <strong>ACTIVAR:</strong> Radicar la denuncia formal ante comités universitarios, unidades de ciberdelitos (DIVINDAT) o herramientas como StopNCII.org.
              </div>
            </div>
          </div>
        </div>

        {/* 5D Model Matrix */}
        <div className="mb-5">
          <h3 className="text-xs font-bold font-mono-tech text-[#F2B544] mb-2 uppercase tracking-wide">
            Matriz de las 5D de Intervención Activa (Adaptación Digital)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#5E4FA2]/40 border-collapse">
              <thead>
                <tr className="bg-[#1C1C3D] text-[#EDEBFA] border-b border-[#5E4FA2]">
                  <th className="p-2 font-mono-tech">Estrategia</th>
                  <th className="p-2 font-mono-tech">Acción en el Juego (KUNTUR)</th>
                  <th className="p-2 font-mono-tech">Aplicación en la Vida Real</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5E4FA2]/30 text-[#8F8CA8]">
                <tr>
                  <td className="p-2 font-bold text-[#4FD1C5]">Directa</td>
                  <td className="p-2 text-[#EDEBFA]">Respaldar a Vale en el Acto 1 frente a Diego.</td>
                  <td className="p-2">Cuestionar comentarios sexistas o rumores en el chat grupal con datos y respeto.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-[#4FD1C5]">Distraer</td>
                  <td className="p-2 text-[#EDEBFA]">Cambiar el foco técnico a la falla del núcleo criogénico.</td>
                  <td className="p-2">Desviar la atención en un hilo tóxico para romper el ritmo de viralización.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-[#4FD1C5]">Delegar</td>
                  <td className="p-2 text-[#EDEBFA]">Elevar el caso ante la Comandante Rosa con informe formal.</td>
                  <td className="p-2">Reportar al delegado docente, defensoría universitaria o moderador del canal.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-[#4FD1C5]">Documentar</td>
                  <td className="p-2 text-[#EDEBFA]">Minijuego del Escáner: análisis forense de 3 anomalías.</td>
                  <td className="p-2">Preservar capturas con fecha, hora, enlaces y números antes de que los borren.</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-[#4FD1C5]">Dilatar / Acompañar</td>
                  <td className="p-2 text-[#EDEBFA]">Mensajería cifrada: escuchar a Vale sin tutelarla.</td>
                  <td className="p-2">Contener a la persona afectada en privado, ofreciendo soporte sin tomar decisiones por ella.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ethical Rule Reminder */}
        <div className="bg-[#090919] border border-[#5E4FA2]/50 p-3 rounded-xs text-[11px] text-[#8F8CA8] leading-normal flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#E86AA8] shrink-0 mt-0.5" />
          <div>
            <strong>Pauta de No Revictimización:</strong> En la prevención de la violencia digital, nunca se debe forzar a la persona agraviada a revisar imágenes denigrantes ni exigirle que sea ella quien demuestre su inocencia. El deber de verificación y freno del canal recae en el entorno de pares y la institucionalidad.
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5E4FA2] hover:bg-[#E86AA8] text-[#EDEBFA] hover:text-[#0B0B1A] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors"
          >
            Entendido, volver a la simulación
          </button>
        </div>

      </div>
    </div>
  );
};
