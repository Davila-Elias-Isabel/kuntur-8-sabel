import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, RotateCw, AlertTriangle, X, Terminal, Cpu } from 'lucide-react';
import { sound } from '../services/audio';

interface FirewallMinigameProps {
  onSuccess: () => void;
  onClose: () => void;
}

// 0: 0 deg, 1: 90 deg, 2: 180 deg, 3: 270 deg
interface NodeCell {
  id: number;
  type: 'straight' | 'corner' | 'cross' | 't-shape';
  rotation: number; // 0, 1, 2, 3 (each = 90 deg)
  isConnected: boolean;
}

export const FirewallMinigame: React.FC<FirewallMinigameProps> = ({
  onSuccess,
  onClose
}) => {
  // 3x3 Grid of circuit nodes
  const initialNodes: NodeCell[] = [
    { id: 0, type: 'corner', rotation: 1, isConnected: false },
    { id: 1, type: 'straight', rotation: 0, isConnected: false },
    { id: 2, type: 'corner', rotation: 2, isConnected: false },
    { id: 3, type: 'straight', rotation: 1, isConnected: false },
    { id: 4, type: 'corner', rotation: 3, isConnected: false },
    { id: 5, type: 't-shape', rotation: 0, isConnected: false },
    { id: 6, type: 'corner', rotation: 0, isConnected: false },
    { id: 7, type: 'straight', rotation: 1, isConnected: false },
    { id: 8, type: 'corner', rotation: 3, isConnected: false },
  ];

  const [nodes, setNodes] = useState<NodeCell[]>(initialNodes);
  const [isQuarantined, setIsQuarantined] = useState(false);
  const [isolatedPercent, setIsolatedPercent] = useState(15);

  // Check if signal connects from Node 0 (Input from Ale) to Node 8 (Quarantine Terminal of El Eco)
  const checkConnections = (currentNodes: NodeCell[]) => {
    // Helper to get ports for a cell based on type and rotation
    const getPorts = (node: NodeCell) => {
      // 0: Up, 1: Right, 2: Down, 3: Left
      const r = node.rotation;
      switch (node.type) {
        case 'straight':
          return r % 2 === 0 ? [1, 3] : [0, 2]; // horizontal or vertical
        case 'corner':
          if (r === 0) return [0, 1]; // Up & Right
          if (r === 1) return [1, 2]; // Right & Down
          if (r === 2) return [2, 3]; // Down & Left
          return [3, 0];             // Left & Up
        case 't-shape':
          if (r === 0) return [1, 2, 3]; // Right, Down, Left
          if (r === 1) return [2, 3, 0]; // Down, Left, Up
          if (r === 2) return [3, 0, 1]; // Left, Up, Right
          return [0, 1, 2];             // Up, Right, Down
        case 'cross':
          return [0, 1, 2, 3];
      }
    };

    // Breadth-First-Search starting from Node 0 with port 3 (left input)
    const connectedSet = new Set<number>();
    const queue: number[] = [];

    // Node 0 has input from left (port 3)
    const ports0 = getPorts(currentNodes[0]);
    if (ports0.includes(3)) {
      connectedSet.add(0);
      queue.push(0);
    }

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const row = Math.floor(curr / 3);
      const col = curr % 3;
      const currPorts = getPorts(currentNodes[curr]);

      // Neighbor UP (row - 1, col)
      if (currPorts.includes(0) && row > 0) {
        const up = (row - 1) * 3 + col;
        const upPorts = getPorts(currentNodes[up]);
        if (upPorts.includes(2) && !connectedSet.has(up)) {
          connectedSet.add(up);
          queue.push(up);
        }
      }
      // Neighbor RIGHT (row, col + 1)
      if (currPorts.includes(1) && col < 2) {
        const right = row * 3 + (col + 1);
        const rightPorts = getPorts(currentNodes[right]);
        if (rightPorts.includes(3) && !connectedSet.has(right)) {
          connectedSet.add(right);
          queue.push(right);
        }
      }
      // Neighbor DOWN (row + 1, col)
      if (currPorts.includes(2) && row < 2) {
        const down = (row + 1) * 3 + col;
        const downPorts = getPorts(currentNodes[down]);
        if (downPorts.includes(0) && !connectedSet.has(down)) {
          connectedSet.add(down);
          queue.push(down);
        }
      }
      // Neighbor LEFT (row, col - 1)
      if (currPorts.includes(3) && col > 0) {
        const left = row * 3 + (col - 1);
        const leftPorts = getPorts(currentNodes[left]);
        if (leftPorts.includes(1) && !connectedSet.has(left)) {
          connectedSet.add(left);
          queue.push(left);
        }
      }
    }

    // Node 8 connects to quarantine if it has port 1 (right output)
    const node8Connected = connectedSet.has(8) && getPorts(currentNodes[8]).includes(1);

    const updated = currentNodes.map(n => ({
      ...n,
      isConnected: connectedSet.has(n.id)
    }));

    setNodes(updated);
    const count = connectedSet.size;
    const progress = Math.min(100, Math.round((count / 9) * 80 + (node8Connected ? 20 : 0)));
    setIsolatedPercent(progress);

    if (node8Connected && !isQuarantined) {
      setIsQuarantined(true);
      sound.playScanSuccess();
    }
  };

  const handleRotate = (index: number) => {
    sound.playBlip();
    const updated = nodes.map((node, i) => {
      if (i === index) {
        return { ...node, rotation: (node.rotation + 1) % 4 };
      }
      return node;
    });
    checkConnections(updated);
  };

  useEffect(() => {
    checkConnections(nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#15152E] border-2 border-[#D7263D] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D7263D]/50 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#D7263D] animate-pulse" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#D7263D] font-mono-tech tracking-wider">
                ENRUTADOR DE CORTAFUEGOS // AISLAMIENTO DE «EL ECO»
              </h2>
              <div className="text-[11px] text-[#8F8CA8]">
                Haz clic para rotar los nodos y conectar la señal desde la Terminal de Ale hasta el nodo de cuarentena de la transmisión clandestina.
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

        {/* Status Strip */}
        <div className="flex items-center justify-between bg-[#0C0C22] p-2.5 border border-[#5E4FA2]/40 rounded-xs text-xs font-mono-tech">
          <span className="flex items-center gap-1.5 text-[#EDEBFA]">
            <Terminal className="w-3.5 h-3.5 text-[#4FD1C5]" /> ENLACE CRIPTOGRÁFICO:
          </span>
          <span className={`font-bold ${isQuarantined ? 'text-[#4FD1C5]' : 'text-[#F2B544]'}`}>
            {isQuarantined ? '✓ CUARENTENA ACTIVA (100%)' : `AISLAMIENTO: ${isolatedPercent}%`}
          </span>
        </div>

        {/* Puzzle Board with Input/Output indicators */}
        <div className="relative flex items-center justify-center p-4 bg-[#080816] border border-[#5E4FA2]/50 rounded-sm">
          
          {/* Left Input Port (Ale's Console) */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#4FD1C5] animate-ping" />
            <span className="text-[9px] font-mono-tech text-[#4FD1C5] uppercase -rotate-90">Entrada</span>
          </div>

          {/* 3x3 Interactive Matrix */}
          <div className="grid grid-cols-3 gap-2 w-72 h-72">
            {nodes.map((node, i) => (
              <button
                key={node.id}
                onClick={() => handleRotate(i)}
                className={`relative flex items-center justify-center rounded-sm border-2 transition-all cursor-pointer ${
                  node.isConnected 
                    ? 'border-[#4FD1C5] bg-[#4FD1C5]/15 shadow-[0_0_10px_rgba(79,209,197,0.3)]' 
                    : 'border-[#5E4FA2]/60 bg-[#12122A] hover:border-[#E86AA8]'
                }`}
                title="Haz clic para rotar 90°"
                aria-label={`Rotar nodo ${i + 1}`}
              >
                {/* Circuit Lines Rendered in SVG */}
                <svg 
                  viewBox="0 0 60 60" 
                  className="w-14 h-14"
                  style={{ transform: `rotate(${node.rotation * 90}deg)` }}
                >
                  {node.type === 'straight' && (
                    <line 
                      x1="0" y1="30" x2="60" y2="30" 
                      stroke={node.isConnected ? '#4FD1C5' : '#8F8CA8'} 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                    />
                  )}
                  {node.type === 'corner' && (
                    <path 
                      d="M 30,0 L 30,30 L 60,30" 
                      fill="none" 
                      stroke={node.isConnected ? '#4FD1C5' : '#8F8CA8'} 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                    />
                  )}
                  {node.type === 't-shape' && (
                    <g>
                      <line 
                        x1="0" y1="30" x2="60" y2="30" 
                        stroke={node.isConnected ? '#4FD1C5' : '#8F8CA8'} 
                        strokeWidth="6" 
                      />
                      <line 
                        x1="30" y1="30" x2="30" y2="60" 
                        stroke={node.isConnected ? '#4FD1C5' : '#8F8CA8'} 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                      />
                    </g>
                  )}
                </svg>

                {/* Subtle Rotate Icon on Hover */}
                <span className="absolute bottom-1 right-1 opacity-40 text-[9px] font-mono-tech">
                  <RotateCw className="w-2.5 h-2.5" />
                </span>
              </button>
            ))}
          </div>

          {/* Right Output Port (El Eco Quarantine) */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full ${isQuarantined ? 'bg-[#4FD1C5]' : 'bg-[#D7263D] animate-ping'}`} />
            <span className="text-[9px] font-mono-tech text-[#D7263D] uppercase rotate-90">Eco Node</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-[#8F8CA8]">
            {isQuarantined ? (
              <span className="text-[#4FD1C5] font-semibold">
                ✓ Canal clandestino aislado. Se ha capturado la firma hash de la terminal de origen.
              </span>
            ) : (
              <span>Rota los conectores hasta crear una ruta continua de izquierda a derecha.</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-[#5E4FA2] text-xs font-medium rounded-xs text-[#EDEBFA]"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                sound.playScanSuccess();
                onSuccess();
              }}
              disabled={!isQuarantined}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xs font-bold text-xs uppercase tracking-wider font-mono-tech transition-all ${
                isQuarantined
                  ? 'bg-[#D7263D] hover:bg-[#ea3a52] text-white shadow-[0_0_15px_rgba(215,38,61,0.5)] cursor-pointer'
                  : 'bg-[#1C1C36] text-[#555B77] border border-[#2B2B48] cursor-not-allowed'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Bloquear Nodo y Guardar Hash
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
