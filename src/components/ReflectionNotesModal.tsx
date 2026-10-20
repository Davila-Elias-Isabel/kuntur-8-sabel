import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  HeartHandshake, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  ExternalLink,
  PhoneCall,
  Scale
} from 'lucide-react';
import { sound } from '../services/audio';

interface ReflectionNotesModalProps {
  onClose: () => void;
}

type TabType = 'consequences' | 'concepts' | 'narrative' | 'resources';

export const ReflectionNotesModal: React.FC<ReflectionNotesModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('consequences');

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#12122A] border-2 border-[#4FD1C5] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5E4FA2]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#4FD1C5]/20 text-[#4FD1C5] rounded-xs">
              <Lightbulb className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-mono-tech text-[#EDEBFA] flex items-center gap-2">
                NOTITAS PEDAGÓGICAS // REFLEXIONES Y CONCEPTOS CLAVE
              </h2>
              <p className="text-[11px] text-[#A6A2C5]">
                ¿Qué provocamos al apoyar o rechazar el acoso digital? Aclaraciones conceptuales y narrativas
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="p-1.5 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#1A1A3A] rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#5E4FA2]/40 py-2 overflow-x-auto text-xs font-mono-tech">
          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('consequences');
            }}
            className={`px-3 py-1.5 rounded-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'consequences'
                ? 'bg-[#4FD1C5] text-[#0B0B1A] font-bold shadow-md'
                : 'bg-[#181838] text-[#A6A2C5] hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>1. ¿Qué provocas?</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('concepts');
            }}
            className={`px-3 py-1.5 rounded-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'concepts'
                ? 'bg-[#4FD1C5] text-[#0B0B1A] font-bold shadow-md'
                : 'bg-[#181838] text-[#A6A2C5] hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>2. Dudas Rápidas</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('narrative');
            }}
            className={`px-3 py-1.5 rounded-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'narrative'
                ? 'bg-[#4FD1C5] text-[#0B0B1A] font-bold shadow-md'
                : 'bg-[#181838] text-[#A6A2C5] hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>3. Las 4 Pruebas</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('resources');
            }}
            className={`px-3 py-1.5 rounded-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'bg-[#4FD1C5] text-[#0B0B1A] font-bold shadow-md'
                : 'bg-[#181838] text-[#A6A2C5] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Ayuda Real</span>
          </button>
        </div>

        {/* Tab Content Area - Didactic, short, and emphatic cards */}
        <div className="overflow-y-auto space-y-3 pr-1 py-3 flex-1 text-xs leading-relaxed">
          
          {/* TAB 1: Consecuencias de apoyar vs rechazar */}
          {activeTab === 'consequences' && (
            <div className="space-y-3">
              {/* Card 1: Reírse o reenviar */}
              <div className="bg-[#210D16] border-l-4 border-[#D7263D] p-3 rounded-xs space-y-1">
                <div className="font-bold text-xs sm:text-sm text-[#D7263D] font-mono-tech flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>❌ SI TE RÍES O REENVÍAS EL VIDEO:</span>
                </div>
                <p className="text-[#EDEBFA]/90 text-xs">
                  Te conviertes en cómplice. Haces que tu compañera sienta vergüenza y miedo, mientras el agresor siente que todos lo celebran y sigue atacando.
                </p>
              </div>

              {/* Card 2: Quedarse callado */}
              <div className="bg-[#241A10] border-l-4 border-[#F2B544] p-3 rounded-xs space-y-1">
                <div className="font-bold text-xs sm:text-sm text-[#F2B544] font-mono-tech flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>🤐 SI TE QUEDAS CALLADO:</span>
                </div>
                <p className="text-[#EDEBFA]/90 text-xs">
                  El silencio parece aprobación. Tu compañera se siente completamente sola frente al grupo y el chisme se vuelve imparable.
                </p>
              </div>

              {/* Card 3: Poner un alto */}
              <div className="bg-[#0B2124] border-l-4 border-[#4FD1C5] p-3 rounded-xs space-y-1">
                <div className="font-bold text-xs sm:text-sm text-[#4FD1C5] font-mono-tech flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>✅ SI PONES UN ALTO EN EL GRUPO:</span>
                </div>
                <p className="text-[#EDEBFA]/90 text-xs">
                  ¡Frenas el acoso al instante! Cuando un compañero dice <em>«¡basta, esto está mal!»</em>, el agresor pierde fuerza y proteges la dignidad de tu amiga.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Aclaración de Conceptos */}
          {activeTab === 'concepts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#181838] border border-[#5E4FA2]/50 p-3 rounded-xs space-y-1">
                <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech flex items-center gap-1.5">
                  <span>🎭</span> ¿Un meme o un Deepfake?
                </div>
                <p className="text-[#EDEBFA]/90 text-xs">
                  Un meme hace reír a todos sanamente. Un <strong>Deepfake</strong> es un video inventado con IA para dañar la reputación de alguien sin su consentimiento.
                </p>
              </div>

              <div className="bg-[#181838] border border-[#5E4FA2]/50 p-3 rounded-xs space-y-1">
                <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech flex items-center gap-1.5">
                  <span>🔍</span> ¿Existe el anonimato total?
                </div>
                <p className="text-[#EDEBFA]/90 text-xs">
                  ¡No! Todo mensaje o foto enviado deja una huella digital: <strong>dirección IP</strong> y registros del teléfono o computadora que lo envió.
                </p>
              </div>

              <div className="bg-[#181838] border border-[#5E4FA2]/50 p-3 rounded-xs space-y-1">
                <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech flex items-center gap-1.5">
                  <span>⚖️</span> ¿Por qué Diego atacó a Vale?
                </div>
                <p className="text-[#EDEBFA]/90 text-xs">
                  Por envidia al no ganar el puesto. En vez de esforzarse, usó prejuicios machistas y falsificaciones para intentar bajarla de rango.
                </p>
              </div>

              <div className="bg-[#181838] border border-[#5E4FA2]/50 p-3 rounded-xs space-y-1">
                <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech flex items-center gap-1.5">
                  <span>🤝</span> ¿Cómo apoyar a la víctima?
                </div>
                <p className="text-[#EDEBFA]/90 text-xs">
                  Escríbele en privado: <em>«Sé que es mentira, estoy contigo»</em>. No la juzgues ni hables por ella sin preguntarle primero.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Las 4 Pruebas */}
          {activeTab === 'narrative' && (
            <div className="space-y-2.5">
              <div className="bg-[#14122E] border border-[#4FD1C5]/50 p-2.5 rounded-xs flex items-center gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech">1. REGISTRO DEL OSCILOSCOPIO</div>
                  <div className="text-[#EDEBFA]/90 text-xs">Demuestra con fecha y hora que Vale estaba trabajando en el taller, no donde decía el rumor.</div>
                </div>
              </div>

              <div className="bg-[#14122E] border border-[#4FD1C5]/50 p-2.5 rounded-xs flex items-center gap-3">
                <span className="text-xl">💾</span>
                <div>
                  <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech">2. MEMORIA DEL MICRODRON</div>
                  <div className="text-[#EDEBFA]/90 text-xs">Contiene las fotos originales sin editar que Diego robó para crear el montaje.</div>
                </div>
              </div>

              <div className="bg-[#14122E] border border-[#4FD1C5]/50 p-2.5 rounded-xs flex items-center gap-3">
                <span className="text-xl">🔬</span>
                <div>
                  <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech">3. INFORME DEL ESCÁNER DE IA</div>
                  <div className="text-[#EDEBFA]/90 text-xs">Comprueba las 3 fallas visuales de la IA: parpadeo raro, borde borroso y sombra falsa.</div>
                </div>
              </div>

              <div className="bg-[#14122E] border border-[#4FD1C5]/50 p-2.5 rounded-xs flex items-center gap-3">
                <span className="text-xl">📡</span>
                <div>
                  <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech">4. RASTREO DE DIRECCIÓN IP</div>
                  <div className="text-[#EDEBFA]/90 text-xs">Identifica que el archivo se subió desde el datapad personal de Diego.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Acción en la Vida Real */}
          {activeTab === 'resources' && (
            <div className="space-y-3">
              <div className="bg-[#0A1A24] border border-[#4FD1C5]/50 p-3 rounded-xs space-y-1.5">
                <div className="font-bold text-xs sm:text-sm text-[#4FD1C5] font-mono-tech flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3 PASOS EN LA VIDA REAL ANTE EL CIBERACOSO:</span>
                </div>
                <div className="space-y-1 text-xs text-[#EDEBFA]">
                  <p><strong>1. No reenvíes ni te rías:</strong> Detén la cadena. Cada me gusta alimenta la burla.</p>
                  <p><strong>2. Toma captura como prueba:</strong> Guarda la evidencia antes de que borren los mensajes.</p>
                  <p><strong>3. Cuéntaselo a un adulto de confianza:</strong> Avisa a profesores, directores o tus padres.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-[#1A1024] p-2.5 border border-[#E86AA8]/50 rounded-xs space-y-1">
                  <div className="font-bold text-[#E86AA8] font-mono-tech flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5" /> Línea 100
                  </div>
                  <p className="text-[11px] text-[#A6A2C5]">Gratis 24h en todo el Perú para apoyo y orientación ante violencia.</p>
                </div>

                <div className="bg-[#1A1024] p-2.5 border border-[#F2B544]/50 rounded-xs space-y-1">
                  <div className="font-bold text-[#F2B544] font-mono-tech flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> SíseVe (Minedu)
                  </div>
                  <p className="text-[11px] text-[#A6A2C5]">Plataforma escolar oficial en Perú para reportar acoso y ciberbullying.</p>
                </div>

                <div className="bg-[#1A1024] p-2.5 border border-[#4FD1C5]/50 rounded-xs space-y-1">
                  <div className="font-bold text-[#4FD1C5] font-mono-tech flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" /> StopNCII.org
                  </div>
                  <p className="text-[11px] text-[#A6A2C5]">Herramienta segura para bloquear fotos o videos sin subirlos a internet.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t border-[#5E4FA2]/40 flex justify-between items-center text-[11px] text-[#8F8CA8]">
          <span>KUNTUR // Tu señal importa</span>
          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="px-3.5 py-1.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs cursor-pointer transition-all"
          >
            Entendido, volver al juego
          </button>
        </div>

      </div>
    </div>
  );
};
