import React, { useState } from 'react';
import { Tablet, X, FileText, MessageSquare, MapPin, ShieldCheck, Key, Cpu, Waves } from 'lucide-react';
import { InventoryItem, LiveChatMessage } from '../types/game';
import { sound } from '../services/audio';

interface DatapadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  chatFeed: LiveChatMessage[];
  currentAct: string;
}

export const DatapadDrawer: React.FC<DatapadDrawerProps> = ({
  isOpen,
  onClose,
  inventory,
  chatFeed,
  currentAct
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'chat' | 'map'>('inventory');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/80 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#15152E] border-2 border-[#5E4FA2] shadow-2xl rounded-sm flex flex-col h-[85vh] max-h-[700px] overflow-hidden">
        
        {/* Top Bar of Datapad */}
        <div className="bg-[#0C0C22] border-b border-[#5E4FA2] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tablet className="w-4 h-4 text-[#4FD1C5]" />
            <span className="font-mono-tech font-bold text-xs sm:text-sm text-[#EDEBFA] tracking-wider">
              DATAPAD PERSONAL DE ALE // OS_KUNTUR v4.2
            </span>
          </div>

          <button
            onClick={() => {
              sound.playBlip();
              onClose();
            }}
            className="p-1 text-[#8F8CA8] hover:text-[#EDEBFA] hover:bg-[#201D3D] rounded-xs"
            title="Cerrar Datapad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#5E4FA2]/50 bg-[#0E0E26] text-xs font-mono-tech">
          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('inventory');
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 border-b-2 font-medium transition-colors ${
              activeTab === 'inventory' 
                ? 'border-[#4FD1C5] text-[#4FD1C5] bg-[#15152E]' 
                : 'border-transparent text-[#8F8CA8] hover:text-[#EDEBFA]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>EVIDENCIAS ({inventory.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('chat');
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 border-b-2 font-medium transition-colors ${
              activeTab === 'chat' 
                ? 'border-[#E86AA8] text-[#E86AA8] bg-[#15152E]' 
                : 'border-transparent text-[#8F8CA8] hover:text-[#EDEBFA]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>RED DE TROPA (EN VIVO)</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              setActiveTab('map');
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 border-b-2 font-medium transition-colors ${
              activeTab === 'map' 
                ? 'border-[#F2B544] text-[#F2B544] bg-[#15152E]' 
                : 'border-transparent text-[#8F8CA8] hover:text-[#EDEBFA]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>MAPA TÁCTICO</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0A0A1D]">
          
          {/* TAB 1: INVENTARIO DE EVIDENCIAS */}
          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Item List */}
              <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                <div className="text-xs font-mono-tech text-[#8F8CA8] mb-1">
                  ITEMS Y PRUEBAS RECOLECTADAS ({inventory.length}/4):
                </div>

                {inventory.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#8F8CA8] border border-dashed border-[#5E4FA2]/40 rounded-xs">
                    No has recolectado evidencia aún. Explora las consolas del hangar, pasillo y red central.
                  </div>
                ) : (
                  inventory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        sound.playBlip();
                        setSelectedItem(item);
                      }}
                      className={`p-3 rounded-xs border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        selectedItem?.id === item.id 
                          ? 'border-[#4FD1C5] bg-[#4FD1C5]/10 shadow-[0_0_8px_rgba(79,209,197,0.3)]' 
                          : 'border-[#5E4FA2]/50 bg-[#12122A] hover:border-[#E86AA8]'
                      }`}
                    >
                      <div className="p-2 bg-[#0C0C22] border border-[#5E4FA2]/40 rounded-xs text-[#4FD1C5]">
                        {item.iconType === 'waveform' && <Waves className="w-4 h-4" />}
                        {item.iconType === 'chip' && <Cpu className="w-4 h-4" />}
                        {item.iconType === 'file' && <FileText className="w-4 h-4" />}
                        {item.iconType === 'key' && <Key className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#EDEBFA] truncate font-mono-tech">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#8F8CA8] line-clamp-1">
                          {item.description}
                        </div>
                        <div className="text-[10px] text-[#4FD1C5] font-mono-tech mt-1">
                          Hora: {item.acquiredAt} · {item.category.toUpperCase()}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Item Inspector */}
              <div className="bg-[#12122A] border border-[#5E4FA2]/60 rounded-xs p-4 flex flex-col justify-between">
                {selectedItem ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 border-b border-[#5E4FA2]/40 pb-2">
                      <ShieldCheck className="w-4 h-4 text-[#4FD1C5]" />
                      <span className="text-xs font-bold text-[#4FD1C5] font-mono-tech">
                        INSPECTOR FORENSE // REGISTRO SERIALIZADO
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#EDEBFA] font-mono-tech">
                        {selectedItem.name}
                      </h3>
                      <span className="text-[10px] text-[#E86AA8] font-mono-tech">
                        CATEGORÍA: {selectedItem.category.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-[#EDEBFA]/90 leading-relaxed bg-[#0C0C20] p-3 border-l-2 border-[#4FD1C5] rounded-xs">
                      {selectedItem.description}
                    </div>

                    <div className="text-[11px] text-[#8F8CA8] leading-relaxed">
                      <strong>Detalle pericial:</strong> {selectedItem.loreDetail}
                    </div>

                    <div className="mt-auto pt-3 border-t border-[#5E4FA2]/30 text-[10px] text-[#8F8CA8] font-mono-tech">
                      HASH INTEGRITY: SHA256-OK · VERIFICADO EN RED
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#8F8CA8] text-center p-4">
                    Selecciona una evidencia de la lista para inspeccionar sus metadatos forenses.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RED DE TROPA (FEED EN VIVO) */}
          {activeTab === 'chat' && (
            <div className="flex flex-col gap-2 h-full">
              <div className="text-xs font-mono-tech text-[#8F8CA8] flex items-center justify-between pb-1 border-b border-[#5E4FA2]/30">
                <span>CANAL PÚBLICO: #ESTACIÓN-KUNTUR-GENERAL</span>
                <span className="text-[#4FD1C5] font-bold">● {chatFeed.length} MENSAJES</span>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
                {chatFeed.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`p-2.5 rounded-xs border text-xs leading-relaxed ${
                      msg.isMalicious 
                        ? 'border-[#D7263D]/80 bg-[#350F18]/40' 
                        : 'border-[#5E4FA2]/30 bg-[#0E0E24]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold font-mono-tech">
                        <span style={{ color: msg.authorColor }}>{msg.author}</span>
                        <span className="text-[10px] text-[#8F8CA8]">[{msg.authorRole}]</span>
                      </div>
                      <span className="text-[10px] text-[#8F8CA8] font-mono-tech">{msg.timestamp}</span>
                    </div>
                    <div className="text-[#EDEBFA] select-text">
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MAPA TÁCTICO */}
          {activeTab === 'map' && (
            <div className="flex flex-col gap-3 h-full text-xs font-mono-tech">
              <div className="text-[#8F8CA8]">
                DISTRIBUCIÓN DE TERMINALES DE LA ESTACIÓN KUNTUR:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#111126] border border-[#4FD1C5]/60 rounded-xs">
                  <div className="text-[#4FD1C5] font-bold mb-1">BAHÍA 4 (INGENIERÍA)</div>
                  <p className="text-[11px] text-[#8F8CA8]">
                    Ubicación de Vale y del núcleo criogénico. Contiene el osciloscopio de calibración y la bitácora de soporte vital.
                  </p>
                </div>

                <div className="p-3 bg-[#111126] border border-[#D7263D]/60 rounded-xs">
                  <div className="text-[#D7263D] font-bold mb-1">CONSOLA CENTRAL DE RED</div>
                  <p className="text-[11px] text-[#8F8CA8]">
                    Punto de emisión de «El Eco». Permite ejecutar el escáner forense y el cortafuegos para aislar la transmisión.
                  </p>
                </div>

                <div className="p-3 bg-[#111126] border border-[#E86AA8]/60 rounded-xs">
                  <div className="text-[#E86AA8] font-bold mb-1">DESPACHO COMANDANCIA</div>
                  <p className="text-[11px] text-[#8F8CA8]">
                    Sede de la Mesa de Auditoría con la Comandante Rosa y el Sargento Ortega. Presentación de evidencia.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#0C0C22] border border-[#5E4FA2]/50 rounded-xs text-[#EDEBFA]">
                <div className="font-bold text-[#F2B544] mb-1">OBJETIVO ACTUAL:</div>
                <div>{currentAct}</div>
              </div>
            </div>
          )}

        </div>

        {/* Footer of Datapad */}
        <div className="bg-[#0C0C22] border-t border-[#5E4FA2] p-2.5 px-4 flex items-center justify-between text-[11px] text-[#8F8CA8] font-mono-tech">
          <span>ATRIBUCIÓN DE TESTIGO ACTIVO: HABILITADA</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#5E4FA2] hover:bg-[#E86AA8] text-[#EDEBFA] hover:text-[#0B0B1A] font-bold rounded-xs transition-colors"
          >
            Volver a la Base
          </button>
        </div>

      </div>
    </div>
  );
};
