import React, { useState } from 'react';
import { X, BookOpen, Lightbulb, HelpCircle, ShieldAlert } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { sound } from '../services/audio';

interface GlossaryModalProps {
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = GLOSSARY_TERMS.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.shortDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.teenAnalogy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#12122A] border-2 border-[#4FD1C5] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5E4FA2]/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#4FD1C5]/20 text-[#4FD1C5] rounded-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-mono-tech text-[#EDEBFA] flex items-center gap-2">
                GLOSARIO RÁPIDO // SIN ENREDOS
              </h2>
              <p className="text-[11px] text-[#8F8CA8]">
                Explicación sencilla y en lenguaje cotidiano de cada palabra del juego
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="p-1.5 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#1A1A3A] rounded-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-3">
          <input
            type="text"
            placeholder="Buscar término (ej. osciloscopio, holofake, metadatos)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#090918] border border-[#5E4FA2] rounded-xs px-3 py-2 text-xs text-[#EDEBFA] placeholder-[#555B77] focus:outline-none focus:border-[#4FD1C5]"
          />
        </div>

        {/* List of cards */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-[#181838] border border-[#5E4FA2]/40 rounded-xs p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#4FD1C5] font-mono-tech">
                  {item.term}
                </span>
                <span className="text-[10px] font-mono-tech bg-[#5E4FA2]/30 px-2 py-0.5 rounded text-[#EDEBFA]">
                  CONCEPTO CLAVE
                </span>
              </div>
              
              <p className="text-xs text-[#EDEBFA] font-medium leading-relaxed">
                {item.shortDefinition}
              </p>

              {/* Teen analogy box */}
              <div className="bg-[#0D0D24] p-2.5 rounded-xs border-l-2 border-[#F2B544] text-[11px] text-[#F2B544] flex items-start gap-2">
                <span className="font-bold shrink-0">💡 ¿Cómo imaginarlo?:</span>
                <span>{item.teenAnalogy}</span>
              </div>

              {/* Why it matters in KUNTUR */}
              <div className="text-[11px] text-[#A6A2C5] flex items-start gap-1.5 pt-1">
                <span className="text-[#E86AA8] font-bold shrink-0">En el juego:</span>
                <span>{item.whyItMatters}</span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs text-[#8F8CA8]">
              No se encontraron términos con esa palabra.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#5E4FA2]/40 flex justify-between items-center text-[11px] text-[#8F8CA8]">
          <span>KUNTUR // Educación contra la violencia digital</span>
          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs"
          >
            Entendido, volver al juego
          </button>
        </div>

      </div>
    </div>
  );
};
