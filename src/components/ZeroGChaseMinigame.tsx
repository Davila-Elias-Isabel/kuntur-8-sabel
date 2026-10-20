import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Rocket, ShieldCheck, Timer, Fuel, X, AlertTriangle, Crosshair } from 'lucide-react';
import { sound } from '../services/audio';

interface ZeroGChaseMinigameProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const ZeroGChaseMinigame: React.FC<ZeroGChaseMinigameProps> = ({
  onSuccess,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [fuel, setFuel] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(35);
  const [distanceToDrone, setDistanceToDrone] = useState<number>(280);
  const [gameOver, setGameOver] = useState<'won' | 'lost' | null>(null);

  // Entities
  const playerRef = useRef({
    x: 100,
    y: 360,
    vx: 0,
    vy: 0,
    angle: 0,
    radius: 16
  });

  const droneRef = useRef({
    x: 520,
    y: 120,
    vx: 1.6,
    vy: 1.2,
    radius: 18,
    targetWaypoint: 0
  });

  const obstaclesRef = useRef([
    { x: 260, y: 160, w: 60, h: 60, label: 'CARGA 01' },
    { x: 440, y: 300, w: 70, h: 50, label: 'BOBINA MAG' },
    { x: 220, y: 380, w: 50, h: 50, label: 'REFRIGERANTE' },
    { x: 380, y: 180, w: 40, h: 70, label: 'VIGA ACERO' }
  ]);

  const keysRef = useRef<{ [k: string]: boolean }>({});

  // Physics & Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particleStars: { x: number; y: number; s: number; alpha: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particleStars.push({
        x: Math.random() * 700,
        y: Math.random() * 450,
        s: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setGameOver('lost');
          sound.playSignalDown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const gameLoop = () => {
      const p = playerRef.current;
      const d = droneRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Controls & RCS Thruster Physics
      let isThrusting = false;
      const accel = 0.28;

      if (keysRef.current['arrowup'] || keysRef.current['w']) {
        p.vy -= accel;
        isThrusting = true;
      }
      if (keysRef.current['arrowdown'] || keysRef.current['s']) {
        p.vy += accel;
        isThrusting = true;
      }
      if (keysRef.current['arrowleft'] || keysRef.current['a']) {
        p.vx -= accel;
        isThrusting = true;
      }
      if (keysRef.current['arrowright'] || keysRef.current['d']) {
        p.vx += accel;
        isThrusting = true;
      }
      // Spacebar = Retro-braking stabilizer
      if (keysRef.current[' ']) {
        p.vx *= 0.90;
        p.vy *= 0.90;
        isThrusting = true;
      }

      if (isThrusting) {
        sound.playThruster();
        setFuel(prev => Math.max(0, prev - 0.08));
      }

      // Zero-G Inertia & Low Drag
      p.vx *= 0.985;
      p.vy *= 0.985;

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off hangar perimeter
      if (p.x < 30) { p.x = 30; p.vx *= -0.6; }
      if (p.x > w - 30) { p.x = w - 30; p.vx *= -0.6; }
      if (p.y < 30) { p.y = 30; p.vy *= -0.6; }
      if (p.y > h - 30) { p.y = h - 30; p.vy *= -0.6; }

      // Drone waypoint AI behavior
      const waypoints = [
        { x: 580, y: 100 },
        { x: 180, y: 120 },
        { x: 480, y: 380 },
        { x: 140, y: 260 }
      ];
      const target = waypoints[d.targetWaypoint];
      const dxDrone = target.x - d.x;
      const dyDrone = target.y - d.y;
      const distWaypoint = Math.hypot(dxDrone, dyDrone);

      if (distWaypoint < 30) {
        d.targetWaypoint = (d.targetWaypoint + 1) % waypoints.length;
      } else {
        d.vx += (dxDrone / distWaypoint) * 0.12;
        d.vy += (dyDrone / distWaypoint) * 0.12;
      }
      d.vx = Math.max(-2.4, Math.min(2.4, d.vx * 0.98));
      d.vy = Math.max(-2.4, Math.min(2.4, d.vy * 0.98));
      d.x += d.vx;
      d.y += d.vy;

      // Collision with obstacles for player
      obstaclesRef.current.forEach(obs => {
        if (
          p.x + p.radius > obs.x &&
          p.x - p.radius < obs.x + obs.w &&
          p.y + p.radius > obs.y &&
          p.y - p.radius < obs.y + obs.h
        ) {
          p.vx *= -0.7;
          p.vy *= -0.7;
          sound.playStep();
        }
      });

      // Distance to drone
      const currentDist = Math.hypot(p.x - d.x, p.y - d.y);
      setDistanceToDrone(Math.round(currentDist));

      // Catch check (tackle within 36px)
      if (currentDist < 36 && !gameOver) {
        sound.playScanSuccess();
        setGameOver('won');
        clearInterval(timerInterval);
        return;
      }

      // --- RENDERING ---
      // Space background inside zero-G hangar bay
      ctx.fillStyle = '#080816';
      ctx.fillRect(0, 0, w, h);

      // Star particles through open atmospheric shield
      ctx.fillStyle = '#EDEBFA';
      particleStars.forEach(s => {
        ctx.globalAlpha = s.alpha;
        ctx.fillRect(s.x, s.y, s.s, s.s);
      });
      ctx.globalAlpha = 1;

      // Zero-G magnetic grid
      ctx.strokeStyle = '#1B1B38';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 35) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 35) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Hangar magnetic boundary
      ctx.strokeStyle = '#5E4FA2';
      ctx.lineWidth = 3;
      ctx.strokeRect(15, 15, w - 30, h - 30);

      // Draw floating cargo obstacles
      obstaclesRef.current.forEach(obs => {
        ctx.fillStyle = '#1A1830';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#4FD1C5';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = '#4FD1C5';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(obs.label, obs.x + 6, obs.y + obs.h / 2 + 3);
      });

      // Grapple line indicator if close
      if (currentDist < 90) {
        ctx.strokeStyle = '#4FD1C5';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Rogue Drone (El Eco Clandestine Drone)
      ctx.fillStyle = '#D7263D';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F2B544';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Drone blinking eye
      ctx.fillStyle = '#EDEBFA';
      ctx.beginPath();
      ctx.arc(d.x, d.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Drone rotors / antennae
      ctx.strokeStyle = '#D7263D';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(d.x - 22, d.y); ctx.lineTo(d.x + 22, d.y);
      ctx.moveTo(d.x, d.y - 22); ctx.lineTo(d.x, d.y + 22);
      ctx.stroke();

      ctx.fillStyle = '#D7263D';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText('DRON ECO', d.x - 22, d.y - 24);

      // Draw Player (Ale with EVA Zero-G Thruster Pack)
      // Thruster gas exhaust particles if thrusting
      if (isThrusting) {
        ctx.fillStyle = '#4FD1C5';
        ctx.beginPath();
        ctx.arc(p.x - p.vx * 3 + (Math.random() - 0.5) * 6, p.y - p.vy * 3 + (Math.random() - 0.5) * 6, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ale EVA Helmet & Suit
      ctx.fillStyle = '#5E4FA2';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#EDEBFA';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Visor
      ctx.fillStyle = '#4FD1C5';
      ctx.beginPath();
      ctx.arc(p.x + (p.vx > 0 ? 3 : -3), p.y - 2, 7, 0, Math.PI * 2);
      ctx.fill();

      // Thruster backpack
      ctx.fillStyle = '#1D1D38';
      ctx.fillRect(p.x - 14, p.y + 6, 28, 8);
      ctx.fillStyle = '#E86AA8';
      ctx.fillRect(p.x - 12, p.y + 8, 6, 4);
      ctx.fillRect(p.x + 6, p.y + 8, 6, 4);

      ctx.fillStyle = '#EDEBFA';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText('ALE (RCS)', p.x - 22, p.y - 20);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timerInterval);
    };
  }, [gameOver]);

  // Handle keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
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
      <div className="w-full max-w-3xl bg-[#15152E] border-2 border-[#4FD1C5] shadow-2xl rounded-sm p-4 sm:p-6 flex flex-col gap-3">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#5E4FA2]/50 pb-2">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#4FD1C5] animate-pulse" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#4FD1C5] font-mono-tech tracking-wider uppercase">
                PERSECUCIÓN EN GRAVEDAD CERO // HANGAR ORBITAL 4
              </h2>
              <div className="text-[11px] text-[#8F8CA8]">
                Pilota con propulsores RCS. Inercia pura en gravedad cero. Atrapa al dron espía antes de que escape.
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

        {/* HUD Strip */}
        <div className="flex items-center justify-between bg-[#0C0C22] p-2.5 px-3 border border-[#5E4FA2]/40 rounded-xs text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-[#4FD1C5]">
            <Fuel className="w-4 h-4" />
            <span>COMBUSTIBLE RCS: {Math.round(fuel)}%</span>
          </div>

          <div className="flex items-center gap-2 text-[#F2B544]">
            <Crosshair className="w-4 h-4" />
            <span>DISTANCIA: {distanceToDrone}m</span>
          </div>

          <div className="flex items-center gap-2 text-[#E86AA8] font-bold">
            <Timer className="w-4 h-4" />
            <span>TIEMPO: {timeLeft}s</span>
          </div>
        </div>

        {/* Canvas Arena */}
        <div className="relative border-2 border-[#5E4FA2]/60 rounded-xs overflow-hidden bg-[#080816]">
          <canvas
            ref={canvasRef}
            width={700}
            height={420}
            className="w-full h-auto block select-none"
          />

          {/* Victory Overlay */}
          {gameOver === 'won' && (
            <div className="absolute inset-0 bg-[#0B0B1A]/90 flex flex-col items-center justify-center p-6 text-center z-10">
              <ShieldCheck className="w-12 h-12 text-[#4FD1C5] mb-2 animate-bounce" />
              <h3 className="text-lg sm:text-xl font-bold font-mono-tech text-[#4FD1C5] mb-1">
                ¡DRON INTERCEPTADO Y NEUTRALIZADO!
              </h3>
              <p className="text-xs text-[#EDEBFA] max-w-md mb-4 leading-relaxed">
                Has alcanzado al dron espía en pleno vuelo de gravedad cero y extraído su disco duro. La prueba física de la manipulación ha sido asegurada en tu Datapad.
              </p>
              <button
                onClick={onSuccess}
                className="px-6 py-2.5 bg-[#4FD1C5] hover:bg-[#6fe4d9] text-[#0B0B1A] font-extrabold uppercase font-mono-tech text-xs tracking-wider rounded-xs cursor-pointer shadow-lg"
              >
                Asegurar Disco y Continuar &gt;
              </button>
            </div>
          )}

          {/* Defeat Overlay */}
          {gameOver === 'lost' && (
            <div className="absolute inset-0 bg-[#0B0B1A]/90 flex flex-col items-center justify-center p-6 text-center z-10">
              <AlertTriangle className="w-12 h-12 text-[#D7263D] mb-2" />
              <h3 className="text-lg sm:text-xl font-bold font-mono-tech text-[#D7263D] mb-1">
                EL DRON ESCAPÓ POR LA ESCLUSA
              </h3>
              <p className="text-xs text-[#EDEBFA] max-w-md mb-4 leading-relaxed">
                Se agotó el tiempo de persecución en gravedad cero. No te rindas: aún puedes rastrear la señal y cortar la antena repetidora desde la nave interceptora.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#5E4FA2] hover:bg-[#E86AA8] text-[#EDEBFA] font-bold uppercase font-mono-tech text-xs tracking-wider rounded-xs"
              >
                Reintentar o Salir
              </button>
            </div>
          )}
        </div>

        {/* Controls Instructions */}
        <div className="flex items-center justify-between text-[11px] text-[#8F8CA8] font-mono-tech">
          <span>Controles: [W, A, S, D] / Flechas = Impulso RCS · [Espacio] = Retro-freno estabilizador</span>
          <span className="text-[#4FD1C5]">Atrapa al dron a menos de 36m</span>
        </div>

      </div>
    </div>
  );
};
