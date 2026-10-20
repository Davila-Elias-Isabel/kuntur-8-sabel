import React, { useState } from 'react';
import { Lock, Unlock, X, FileText, CheckCircle2 } from 'lucide-react';
import { sound } from '../services/audio';

interface TerminalInspectModalProps {
  onSuccess: () => void;
  onClose: () => void;
  alreadyUnlocked: boolean;
}

export const TerminalInspectModal: React.FC<TerminalInspectModalProps> = ({
  onSuccess,
  onClose,
  alreadyUnlocked
}) => {
  const passcode = '2026';
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(alreadyUnlocked);

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    sound.playBlip();

    // Auto check if all 4 digits filled
    if (next.every(d => d !== '')) {
      const entered = next.join('');
      if (entered === passcode) {
        setIsUnlocked(true);
        setErrorMsg(null);
        sound.playScanSuccess();
      } else {
        setErrorMsg('CÓDIGO DE GUARDIA INVÁLIDO. PISTA: REVISA EL AÑO DE LA ORDEN DE GUARDIA (2026)');
        sound.playSignalDown();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#15152E] border-2 border-[#F2B544] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F2B544]/40 pb-3">
          <div className="flex items-center gap-2">
            {isUnlocked ? <Unlock className="w-5 h-5 text-[#4FD1C5]" /> : <Lock className="w-5 h-5 text-[#F2B544]" />}
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#F2B544] font-mono-tech tracking-wider">
                LOCKER 2 DE ENLACE // CADETE DIEGO
              </h2>
              <div className="text-[11px] text-[#8F8CA8]">
                Cerradura biométrica de respaldo con clave numérica de 4 dígitos.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#201D3D] rounded-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lock or Contents */}
        {!isUnlocked ? (
          <div className="flex flex-col items-center gap-4 py-4 bg-[#0A0A1D] border border-[#5E4FA2]/40 rounded-xs p-4">
            <div className="text-xs text-[#EDEBFA] text-center max-w-xs">
              Ingresa el código de ordenanza de la misión espacial de rescate (Año de misión):
            </div>

            <div className="flex gap-2">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  className="w-12 h-14 bg-[#12122A] border-2 border-[#F2B544] text-center text-xl font-bold font-mono-tech text-[#4FD1C5] focus:outline-none focus:border-[#4FD1C5] rounded-xs"
                />
              ))}
            </div>

            {errorMsg && (
              <div className="text-[11px] text-[#D7263D] font-mono-tech text-center">
                {errorMsg}
              </div>
            )}

            <div className="text-[10px] text-[#8F8CA8] font-mono-tech">
              (Pista de ordenanza: Año en curso 2026)
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-2 bg-[#0A0A1D] border border-[#4FD1C5] rounded-xs p-4">
            <div className="flex items-center gap-2 text-[#4FD1C5] font-bold text-xs font-mono-tech">
              <CheckCircle2 className="w-4 h-4" />
              <span>LOCKER DESBLOQUEADO // BORRADOR RECUPERADO</span>
            </div>

            <div className="bg-[#12122A] p-3 border-l-2 border-[#F2B544] text-xs text-[#EDEBFA] leading-relaxed">
              <div className="font-bold text-[#F2B544] mb-1 font-mono-tech">
                [BORRADOR NO ENVIADO DE DIEGO]:
              </div>
              «Sé que el render que compartieron en El Eco es falso; vi los cables de compresión en el archivo. Pero si no digo nada en la guardia, nadie me señalará a mí. No quiero problemas con los veteranos.»
            </div>

            <div className="text-[11px] text-[#8F8CA8]">
              Esta prueba demuestra que Diego no es un agresor malicioso irrevocable, sino un testigo acorralado por el miedo institucional y la presión de grupo.
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-[#5E4FA2] text-xs font-medium rounded-xs text-[#EDEBFA]"
          >
            Cerrar
          </button>
          {isUnlocked && !alreadyUnlocked && (
            <button
              onClick={() => {
                sound.playScanSuccess();
                onSuccess();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#F2B544] hover:bg-[#ffc65a] text-[#0B0B1A] font-bold text-xs uppercase tracking-wider font-mono-tech rounded-xs cursor-pointer shadow-md"
            >
              <FileText className="w-3.5 h-3.5" />
              Guardar Evidencia en Datapad
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
