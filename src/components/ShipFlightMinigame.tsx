import React, { useRef, useEffect, useState } from 'react';
import { Radio, Shield, Zap, X, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { sound } from '../services/audio';

interface ShipFlightMinigameProps {
  onSuccess: () => void;
  onClose: () => void;
}

interface Projectile {
  x: number;
  y: number;
  speed: number;
}

interface Obstacle {
  x: number;
  y: number;
  vx: number;
  radius: number;
  type: 'asteroid' | 'relay';
  hp: number;
}

export const ShipFlightMinigame: React.FC<ShipFlightMinigameProps> = ({
  onSuccess,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [shield, setShield] = useState(100);
  const [broadcastProgress, setBroadcastProgress] = useState(20);
  const [relaysDestroyed, setRelaysDestroyed] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  // Ship position
  const shipRef = useRef({
    x: 80,
    y: 200,
    w: 40,
    h: 24,
    speed: 4.5
  });

  const keysRef = useRef<{ [k: string]: boolean }>({});
  const projectilesRef = useRef<Projectile[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);

  // Spawn obstacles & relays periodically
  useEffect(() => {
    if (gameState !== 'playing') return;

    let spawnTimer = 0;
    const interval = setInterval(() => {
      spawnTimer++;

      // Broadcast rises slowly
      setBroadcastProgress(prev => {
        if (prev >= 100) {
          setGameState('lost');
          sound.playSignalDown();
          return 100;
        }
        return prev + 1.2;
      });

      // Spawn asteroid or relay
      if (spawnTimer % 2 === 0) {
        // Normal asteroid
        obstaclesRef.current.push({
          x: 720,
          y: Math.random() * 320 + 40,
          vx: Math.random() * 2 + 3,
          radius: Math.random() * 10 + 12,
          type: 'asteroid',
          hp: 1
        });
      }

      // Spawn relay tower every ~5 seconds
      if (spawnTimer % 5 === 0) {
        obstaclesRef.current.push({
          x: 740,
          y: Math.random() * 280 + 60,
          vx: 1.8,
          radius: 24,
          type: 'relay',
          hp: 3
        });
      }
    }, 700);

    return () => clearInterval(interval);
  }, [gameState]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Starfield particles
    const stars: { x: number; y: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * 700,
        y: Math.random() * 400,
        speed: Math.random() * 3 + 1,
        size: Math.random() * 2 + 1
      });
    }

    const loop = () => {
      const ship = shipRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Controls
      if (keysRef.current['arrowup'] || keysRef.current['w']) ship.y -= ship.speed;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) ship.y += ship.speed;
      if (keysRef.current['arrowleft'] || keysRef.current['a']) ship.x -= ship.speed;
      if (keysRef.current['arrowright'] || keysRef.current['d']) ship.x += ship.speed;

      ship.x = Math.max(20, Math.min(w - 60, ship.x));
      ship.y = Math.max(30, Math.min(h - 40, ship.y));

      // 2. Clear background & move stars
      ctx.fillStyle = '#070714';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#EDEBFA';
      stars.forEach(s => {
        s.x -= s.speed;
        if (s.x < 0) s.x = w;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      // 3. Move & Draw Projectiles
      ctx.fillStyle = '#4FD1C5';
      projectilesRef.current.forEach((proj, idx) => {
        proj.x += proj.speed;

        // Draw laser bolt
        ctx.fillRect(proj.x, proj.y, 16, 4);
        ctx.shadowColor = '#4FD1C5';
        ctx.shadowBlur = 8;
        ctx.fillRect(proj.x + 2, proj.y - 1, 12, 6);
        ctx.shadowBlur = 0;

        // Collision with obstacles
        obstaclesRef.current.forEach(obs => {
          const dist = Math.hypot(proj.x - obs.x, proj.y - obs.y);
          if (dist < obs.radius + 6) {
            obs.hp -= 1;
            proj.x = 9999; // mark for deletion
            sound.playScanHotspot(true);
            if (obs.type === 'relay' && obs.hp <= 0) {
              sound.playScanSuccess();
              setRelaysDestroyed(prev => {
                const next = prev + 1;
                if (next >= 3) {
                  setGameState('won');
                }
                return next;
              });
              setBroadcastProgress(b => Math.max(0, b - 25));
            }
          }
        });
      });
      projectilesRef.current = projectilesRef.current.filter(p => p.x < w + 20);

      // 4. Move & Draw Obstacles
      obstaclesRef.current.forEach(obs => {
        obs.x -= obs.vx;

        if (obs.type === 'relay') {
          // Pirate Broadcast Antenna
          ctx.fillStyle = '#1D1328';
          ctx.strokeStyle = '#D7263D';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Antenna dish and pulse wave
          ctx.strokeStyle = '#E86AA8';
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius + 6, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();

          ctx.fillStyle = '#EDEBFA';
          ctx.font = 'bold 8px "JetBrains Mono", monospace';
          ctx.fillText(`RELAY [${obs.hp} HP]`, obs.x - 22, obs.y - obs.radius - 4);
        } else {
          // Asteroid shard
          ctx.fillStyle = '#26243A';
          ctx.strokeStyle = '#5E4FA2';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Collision with ship
        const distToShip = Math.hypot(obs.x - ship.x, obs.y - ship.y);
        if (distToShip < obs.radius + 14) {
          obs.x = -999; // destroy
          setShield(s => {
            const next = Math.max(0, s - 20);
            if (next <= 0) {
              setGameState('lost');
              sound.playSignalDown();
            }
            return next;
          });
          sound.playStep();
        }
      });
      obstaclesRef.current = obstaclesRef.current.filter(o => o.x > -50 && o.hp > 0);

      // 5. Draw Ship (Ale's Interceptor)
      // Thruster flame
      ctx.fillStyle = '#E86AA8';
      ctx.beginPath();
      ctx.moveTo(ship.x - 4, ship.y + 6);
      ctx.lineTo(ship.x - 14 - Math.random() * 6, ship.y + 12);
      ctx.lineTo(ship.x - 4, ship.y + 18);
      ctx.fill();

      // Ship hull
      ctx.fillStyle = '#EDEBFA';
      ctx.beginPath();
      ctx.moveTo(ship.x + 36, ship.y + 12); // nose
      ctx.lineTo(ship.x, ship.y);
      ctx.lineTo(ship.x + 6, ship.y + 12);
      ctx.lineTo(ship.x, ship.y + 24);
      ctx.closePath();
      ctx.fill();

      // Wings with cyan livery
      ctx.fillStyle = '#4FD1C5';
      ctx.fillRect(ship.x + 6, ship.y + 10, 16, 4);

      // Canopy
      ctx.fillStyle = '#5E4FA2';
      ctx.beginPath();
      ctx.arc(ship.x + 20, ship.y + 12, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  // Handle ship shooting
  const fireLaser = () => {
    sound.playLaser();
    projectilesRef.current.push({
      x: shipRef.current.x + 36,
      y: shipRef.current.y + 10,
      speed: 9
    });
  };

  // Keyboard controls
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      if (k === ' ') {
        e.preventDefault();
        fireLaser();
      }
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        e.preventDefault();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0B0B1A]/95 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#15152E] border-2 border-[#D7263D] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col gap-3">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D7263D]/50 pb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#D7263D] animate-pulse" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#D7263D] font-mono-tech tracking-wider uppercase">
                CARRERA EN NAVE // CORTAR TRANSMISIÓN DEL ECO
              </h2>
              <div className="text-[11px] text-[#8F8CA8]">
                Pilota el interceptor espacial de KUNTUR. Dispara el Rayo Inhibidor para destruir las 3 antenas repetidoras.
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

        {/* HUD Bars */}
        <div className="grid grid-cols-3 gap-2 bg-[#0C0C22] p-2.5 px-3 border border-[#5E4FA2]/40 rounded-xs text-xs font-mono-tech">
          {/* Shields */}
          <div className="flex items-center gap-2 text-[#4FD1C5]">
            <Shield className="w-4 h-4" />
            <span>ESCUDO: {shield}%</span>
          </div>

          {/* Relays Destroyed */}
          <div className="flex items-center justify-center gap-2 text-[#E86AA8] font-bold">
            <Zap className="w-4 h-4" />
            <span>ANTENAS DESTRUIDAS: {relaysDestroyed}/3</span>
          </div>

          {/* Broadcast Progress */}
          <div className="flex items-center justify-end gap-2 text-[#D7263D]">
            <span>DIFUSIÓN PIRATA: {Math.round(broadcastProgress)}%</span>
          </div>
        </div>

        {/* Arcade Canvas */}
        <div className="relative border-2 border-[#5E4FA2]/60 rounded-xs overflow-hidden bg-[#070714]">
          <canvas
            ref={canvasRef}
            width={700}
            height={400}
            className="w-full h-auto block select-none"
          />

          {/* Victory Overlay */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-[#0B0B1A]/90 flex flex-col items-center justify-center p-6 text-center z-10">
              <CheckCircle2 className="w-12 h-12 text-[#4FD1C5] mb-2 animate-bounce" />
              <h3 className="text-lg sm:text-xl font-bold font-mono-tech text-[#4FD1C5] mb-1">
                ¡TRANSMISIÓN DE «EL ECO» INTERRUMPIDA CON ÉXITO!
              </h3>
              <p className="text-xs text-[#EDEBFA] max-w-md mb-4 leading-relaxed">
                Has destruido las antenas repetidoras clandestinas con el Rayo Inhibidor. La señal fue cortada antes de llegar a la flota y has asegurado la llave criptográfica exterior.
              </p>
              <button
                onClick={onSuccess}
                className="px-6 py-2.5 bg-[#4FD1C5] hover:bg-[#6fe4d9] text-[#0B0B1A] font-extrabold uppercase font-mono-tech text-xs tracking-wider rounded-xs cursor-pointer shadow-lg"
              >
                Recoger Llave y Continuar &gt;
              </button>
            </div>
          )}

          {/* Defeat Overlay */}
          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-[#0B0B1A]/90 flex flex-col items-center justify-center p-6 text-center z-10">
              <AlertOctagon className="w-12 h-12 text-[#D7263D] mb-2" />
              <h3 className="text-lg sm:text-xl font-bold font-mono-tech text-[#D7263D] mb-1">
                LA DIFUSIÓN ALCANZÓ EL 100%
              </h3>
              <p className="text-xs text-[#EDEBFA] max-w-md mb-4 leading-relaxed">
                El archivo falso se propagó a los canales exteriores. Pero no te desanimes: aún puedes refutar la mentira directamente en la Mesa de Auditoría del Consejo.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#5E4FA2] hover:bg-[#E86AA8] text-[#EDEBFA] font-bold uppercase font-mono-tech text-xs tracking-wider rounded-xs"
              >
                Reintentar Vuelo o Salir
              </button>
            </div>
          )}
        </div>

        {/* Controls Instructions & Shoot Button */}
        <div className="flex items-center justify-between text-[11px] text-[#8F8CA8] font-mono-tech">
          <span>Nave: [WASD] / Flechas para maniobrar · [Espacio] = Disparar Rayo Inhibidor</span>
          <button
            onClick={fireLaser}
            className="px-4 py-1.5 bg-[#4FD1C5] text-[#0B0B1A] font-bold uppercase rounded-xs cursor-pointer active:scale-95 sm:hidden"
          >
            DISPARAR RAYO
          </button>
        </div>

      </div>
    </div>
  );
};
