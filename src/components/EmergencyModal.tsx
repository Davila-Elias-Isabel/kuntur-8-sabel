import React from 'react';
import { X, ShieldAlert, ExternalLink, PhoneCall, Globe2 } from 'lucide-react';

interface EmergencyModalProps {
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#15152E] border-2 border-[#D7263D] shadow-2xl rounded-sm p-5 sm:p-6 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D7263D]/50 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#D7263D]" />
            <h2 className="text-sm sm:text-base font-bold text-[#D7263D] tracking-wider font-mono-tech">
              RUTAS DE AYUDA Y CONTENCIÓN // PUENTE A LA TIERRA
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#201D3D] rounded-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#EDEBFA] mb-4 leading-relaxed">
          Si tú o alguien de tu comunidad estudiantil o laboral está enfrentando acoso digital, difusión no autorizada de imágenes manipuladas (deepfakes) o violencia de género digital, existen canales de soporte confidenciales y gratuitos:
        </p>

        {/* Channels */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="p-3 bg-[#0C0C22] border border-[#5E4FA2]/60 rounded-xs">
            <div className="flex items-center justify-between font-bold text-xs text-[#4FD1C5] mb-1">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" /> StopNCII.org (Internacional)
              </span>
              <a
                href="https://stopncii.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#4FD1C5] hover:underline flex items-center gap-1"
              >
                Acceder <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#8F8CA8] leading-snug">
              Herramienta global para mayores de 18 años. Genera huellas digitales criptográficas (hash) en tu dispositivo sin subir tus fotos o videos a internet, impidiendo su publicación en redes sociales aliadas (Instagram, Facebook, TikTok, etc.).
            </p>
          </div>

          <div className="p-3 bg-[#0C0C22] border border-[#5E4FA2]/60 rounded-xs">
            <div className="flex items-center justify-between font-bold text-xs text-[#F2B544] mb-1">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> Línea 100 y Chat 100 (Perú)
              </span>
              <a
                href="https://www.gob.pe/mimp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#F2B544] hover:underline flex items-center gap-1"
              >
                Portal MIMP <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#8F8CA8] leading-snug">
              Servicio telefónico y virtual gratuito del Ministerio de la Mujer y Poblaciones Vulnerables (MIMP), disponible las 24 horas para orientación legal, apoyo social y contención psicológica especializada.
            </p>
          </div>

          <div className="p-3 bg-[#0C0C22] border border-[#5E4FA2]/60 rounded-xs">
            <div className="flex items-center justify-between font-bold text-xs text-[#E86AA8] mb-1">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" /> Take It Down (NCMEC)
              </span>
              <a
                href="https://takeitdown.ncmec.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#E86AA8] hover:underline flex items-center gap-1"
              >
                Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#8F8CA8] leading-snug">
              Servicio preventivo para menores de 18 años para retirar imágenes o creaciones sintéticas explícitas de internet de manera anónima y segura.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5E4FA2] hover:bg-[#E86AA8] text-[#EDEBFA] hover:text-[#0B0B1A] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors"
          >
            Volver a la estación
          </button>
        </div>

      </div>
    </div>
  );
};
