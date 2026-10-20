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
        <div className="flex items-center gap-2 border-b border-[#5E4FA2]/40 py-2.5 overflow-x-auto text-xs font-mono-tech">
          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('consequences');
            }}
            className={`px-3 py-1.5 rounded-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'consequences'
                ? 'bg-[#4FD1C5] text-[#0B0B1A] font-bold shadow-md'
                : 'bg-[#181838] text-[#A6A2C5] hover:text-white hover:bg-[#25254D]'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>1. Apoyar vs. Rechazar</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('concepts');
            }}
            className={`px-3 py-1.5 rounded-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'concepts'
                ? 'bg-[#4FD1C5] text-[#0B0B1A] font-bold shadow-md'
                : 'bg-[#181838] text-[#A6A2C5] hover:text-white hover:bg-[#25254D]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>2. Aclaración de Conceptos</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('narrative');
            }}
            className={`px-3 py-1.5 rounded-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'narrative'
                ? 'bg-[#4FD1C5] text-[#0B0B1A] font-bold shadow-md'
                : 'bg-[#181838] text-[#A6A2C5] hover:text-white hover:bg-[#25254D]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>3. Claves de la Narrativa</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('resources');
            }}
            className={`px-3 py-1.5 rounded-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'bg-[#4FD1C5] text-[#0B0B1A] font-bold shadow-md'
                : 'bg-[#181838] text-[#A6A2C5] hover:text-white hover:bg-[#25254D]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Acción en la Vida Real</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="overflow-y-auto space-y-4 pr-1 py-3 flex-1 text-xs leading-relaxed">
          
          {/* TAB 1: Consecuencias de apoyar vs rechazar */}
          {activeTab === 'consequences' && (
            <div className="space-y-3.5">
              <div className="bg-[#1C101A] border-l-4 border-[#D7263D] p-3.5 rounded-xs space-y-2">
                <div className="font-bold text-sm text-[#D7263D] font-mono-tech flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  ¿QUÉ PROVOCAMOS AL APOYAR O GUARDAR SILENCIO FRENTE AL ACOSO?
                </div>
                <ul className="space-y-2 text-[#EDEBFA]/90 list-disc list-inside">
                  <li>
                    <strong className="text-white">Silenciamiento y culpa en la víctima:</strong> Al reírse de un chiste machista o decir <em>«por algo será»</em>, se transmite a la persona afectada que su entorno la juzgará. Esto provoca vergüenza profunda e impide que busque apoyo institucional o legal.
                  </li>
                  <li>
                    <strong className="text-white">Aislamiento y deserción:</strong> Según informes globales de la <strong>UNESCO (2024)</strong>, 1 de cada 3 mujeres víctimas de montajes íntimos o acoso digital en espacios universitarios o profesionales termina abandonando cargos de liderazgo, renunciando a proyectos o aislándose de sus redes sociales.
                  </li>
                  <li>
                    <strong className="text-white">Validación e impunidad del agresor:</strong> Cuando nadie pone un límite en el chat grupal, el agresor siente que cuenta con la aprobación tácita del grupo y escala sus conductas a niveles más lesivos.
                  </li>
                </ul>
              </div>

              <div className="bg-[#0B2124] border-l-4 border-[#4FD1C5] p-3.5 rounded-xs space-y-2">
                <div className="font-bold text-sm text-[#4FD1C5] font-mono-tech flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  ¿QUÉ LOGRAMOS AL RECHAZAR Y ACTUAR COMO TESTIGO ACTIVO?
                </div>
                <ul className="space-y-2 text-[#EDEBFA]/90 list-disc list-inside">
                  <li>
                    <strong className="text-white">Freno en seco a la viralización:</strong> Los estudios demuestran que el 80% de las agresiones digitales se detienen en menos de 10 segundos cuando un compañero interviene de forma asertiva en el canal público.
                  </li>
                  <li>
                    <strong className="text-white">Restitución de la seguridad:</strong> Le demuestras a la persona vulnerada que su dignidad y méritos son respetados, brindándole el respaldo necesario para no sentirse aislada.
                  </li>
                  <li>
                    <strong className="text-white">Transformación comunitaria:</strong> Desarmas la idea de que la difamación es un «contenido humorístico inofensivo», sentando un precedente ético para todo el grupo.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Aclaración de Conceptos */}
          {activeTab === 'concepts' && (
            <div className="space-y-3">
              <div className="bg-[#181838] border border-[#5E4FA2]/40 p-3.5 rounded-xs space-y-1.5">
                <div className="font-bold text-sm text-[#4FD1C5] font-mono-tech">
                  ¿Por qué un Deepfake / Holofake no es «solo un meme»?
                </div>
                <p className="text-[#EDEBFA]">
                  Un meme común satiriza una situación pública con conocimiento general. Un <strong>deepfake no consentido</strong> vulnera directamente el derecho a la propia imagen, la intimidad y el consentimiento. Cuando se utiliza para simular conductas indebidas o contenido sexualizado sin autorización, constituye una agresión tipificada que genera secuelas psicológicas reales y medibles.
                </p>
              </div>

              <div className="bg-[#181838] border border-[#5E4FA2]/40 p-3.5 rounded-xs space-y-1.5">
                <div className="font-bold text-sm text-[#4FD1C5] font-mono-tech">
                  ¿Cuál es la diferencia entre una crítica técnica y la Violencia de Género Digital (TFGBV)?
                </div>
                <p className="text-[#EDEBFA]">
                  La crítica profesional evalúa datos objetivos: si un informe técnico tiene errores o si un procedimiento falló. La <strong>Violencia de Género Facilitada por la Tecnología</strong> no evalúa el trabajo: descalifica a la persona utilizando estereotipos de género (<em>«seguro ascendió por favores personales»</em>, <em>«a las mujeres no les da la cabeza para esto»</em>) y recurre a la humillación personal para desplazarla.
                </p>
              </div>

              <div className="bg-[#181838] border border-[#5E4FA2]/40 p-3.5 rounded-xs space-y-1.5">
                <div className="font-bold text-sm text-[#4FD1C5] font-mono-tech">
                  ¿Por qué el anonimato digital es una ilusión técnica?
                </div>
                <p className="text-[#EDEBFA]">
                  Crear un usuario anónimo como «El Eco» no borra las huellas de red. Cada archivo generado conserva <strong>metadatos</strong> de edición, y cada transmisión viaja a través de protocolos de internet con una <strong>dirección IP de origen</strong> y números de serie de hardware (direcciones MAC). En procesos periciales forenses, estos registros vinculan de manera inequívoca el dispositivo físico del autor con la difusión del contenido.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Claves de la Narrativa KUNTUR */}
          {activeTab === 'narrative' && (
            <div className="space-y-3">
              <div className="bg-[#181838] border border-[#5E4FA2]/40 p-3.5 rounded-xs space-y-1.5">
                <div className="font-bold text-sm text-[#E86AA8] font-mono-tech">
                  ¿Por qué Diego no es un villano de caricatura, sino un reflejo cotidiano?
                </div>
                <p className="text-[#EDEBFA]">
                  Diego no es un monstruo de ficción: es un estudiante o colega que sintió frustración porque no obtuvo el ascenso. En lugar de competir con base en sus capacidades, recurrió a prejuicios machistas arraigados y a herramientas tecnológicas accesibles para socavar a Vale. Refleja cómo personas comunes pueden causar un daño desmedido cuando normalizan el ciberacoso como un «chiste» o una revancha fácil.
                </p>
              </div>

              <div className="bg-[#181838] border border-[#5E4FA2]/40 p-3.5 rounded-xs space-y-1.5">
                <div className="font-bold text-sm text-[#4FD1C5] font-mono-tech">
                  ¿Por qué Ale acompaña a Vale en vez de «rescatarla»?
                </div>
                <p className="text-[#EDEBFA]">
                  Uno de los pilares éticos de <strong>KUNTUR</strong> es evitar el estereotipo paternalista del salvador. Vale es una ingeniera brillante, autónoma y capaz que ejerce su propia defensa técnica. Ale no habla por ella ni toma decisiones en su lugar: interviene como testigo activo para neutralizar el cargamontón, reunir las pruebas periciales y respaldar su voz ante el Consejo.
                </p>
              </div>

              <div className="bg-[#181838] border border-[#5E4FA2]/40 p-3.5 rounded-xs space-y-1.5">
                <div className="font-bold text-sm text-[#F2B544] font-mono-tech">
                  ¿Por qué la Comandante Rosa exige rigor pericial?
                </div>
                <p className="text-[#EDEBFA]">
                  En una institución con debido proceso, las decisiones no se basan en rumores de pasillo ni en la indignación de redes. La Comandante Rosa representa la autoridad ecuánime: ante acusaciones difamatorias, exige la cadena de custodia probatoria (la bitácora del osciloscopio, el peritaje de la IA y el rastreo de IP). Demuestra que las pruebas científicas son el mejor antídoto contra la desinformación.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Acción en la Vida Real */}
          {activeTab === 'resources' && (
            <div className="space-y-3.5">
              <div className="bg-[#0A1A24] border border-[#4FD1C5]/50 p-3.5 rounded-xs space-y-2">
                <div className="font-bold text-sm text-[#4FD1C5] font-mono-tech flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  PROTOCOLO DE 3 PASOS ANTE UN CASO DE ACOSO DIGITAL EN TU ENTORNO:
                </div>
                <div className="space-y-1.5 text-[#EDEBFA]">
                  <p><strong>1. No reenviar ni reaccionar con morbo:</strong> Si un video o imagen difamatoria llega a tu grupo, no lo compartas ni alimentes la conversación con risas. Cada reacción multiplica el algoritmo de difusión.</p>
                  <p><strong>2. Documentar sin alterar:</strong> Toma capturas de pantalla donde se aprecie claramente el remitente, fecha, hora y enlace/número de teléfono. No borres los mensajes si la persona afectada desea presentar una denuncia formal.</p>
                  <p><strong>3. Acompañar en privado con empatía:</strong> Escríbele a la persona afectada sin juzgarla: <em>«Vi lo que publicaron, sé que es una falsificación y cuentas conmigo si necesitas apoyo para denunciar o reportar»</em>.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#1A1024] p-3 border border-[#E86AA8]/50 rounded-xs space-y-1">
                  <div className="font-bold text-xs text-[#E86AA8] font-mono-tech flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                    LÍNEA 100 / CHAT 100 (PERÚ)
                  </div>
                  <p className="text-[11px] text-[#A6A2C5]">
                    Servicio público gratuito, confidencial y disponible las 24 horas del Ministerio de la Mujer y Poblaciones Vulnerables (MIMP) para orientación y soporte ante violencia de género y ciberacoso.
                  </p>
                </div>

                <div className="bg-[#1A1024] p-3 border border-[#4FD1C5]/50 rounded-xs space-y-1">
                  <div className="font-bold text-xs text-[#4FD1C5] font-mono-tech flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    STOPNCII.ORG
                  </div>
                  <p className="text-[11px] text-[#A6A2C5]">
                    Plataforma tecnológica global desarrollada con apoyo internacional que genera un identificador digital único (hash) en tu propio dispositivo para bloquear la difusión de imágenes íntimas sin subir el archivo a internet.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#5E4FA2]/40 flex justify-between items-center text-[11px] text-[#8F8CA8]">
          <span>KUNTUR // Tu señal importa</span>
          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#4FD1C5] hover:bg-[#6ee4d9] text-[#0B0B1A] font-bold font-mono-tech text-xs rounded-xs cursor-pointer transition-all"
          >
            Entendido, volver a la pantalla principal
          </button>
        </div>

      </div>
    </div>
  );
};
