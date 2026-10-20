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

        <p className="text-xs text-[#EDEBFA] mb-3.5 leading-snug">
          Si tú, un amigo o compañera de clase está sufriendo ciberacoso o difusión de fotos sin permiso, no estás solo. Estos canales son <strong>gratuitos y confidenciales</strong>:
        </p>

        {/* Channels */}
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="p-3 bg-[#0C0C22] border border-[#F2B544]/60 rounded-xs">
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
            <p className="text-[11px] text-[#EDEBFA]/80 leading-snug">
              Llama gratis al <strong>100</strong> desde cualquier teléfono las 24 horas. Profesionales te escucharán y te orientarán sin juzgarte.
            </p>
          </div>

          <div className="p-3 bg-[#0C0C22] border border-[#4FD1C5]/60 rounded-xs">
            <div className="flex items-center justify-between font-bold text-xs text-[#4FD1C5] mb-1">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" /> SíseVe - Minedu (Perú)
              </span>
              <a
                href="http://www.siseve.pe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#4FD1C5] hover:underline flex items-center gap-1"
              >
                siseve.pe <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#EDEBFA]/80 leading-snug">
              Canal oficial del Ministerio de Educación de Perú para reportar casos de violencia escolar o ciberacoso entre compañeros.
            </p>
          </div>

          <div className="p-3 bg-[#0C0C22] border border-[#E86AA8]/60 rounded-xs">
            <div className="flex items-center justify-between font-bold text-xs text-[#E86AA8] mb-1">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" /> Take It Down / StopNCII
              </span>
              <a
                href="https://takeitdown.ncmec.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#E86AA8] hover:underline flex items-center gap-1"
              >
                takeitdown.ncmec.org <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#EDEBFA]/80 leading-snug">
              Herramienta gratuita para menores de 18 años para retirar fotos o videos íntimos de internet sin subirlos a la web.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
          >
            Volver al juego
          </button>
        </div>

      </div>
    </div>
  );
};
