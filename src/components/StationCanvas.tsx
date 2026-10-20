import React, { useRef, useEffect } from 'react';
import { sound } from '../services/audio';

interface StationCanvasProps {
  alePos: { x: number; y: number };
  onMoveAle: (dx: number, dy: number) => void;
  canInteractWith: string | null;
  act1Done: boolean;
  act2Done: boolean;
  act3Ready: boolean;
  hasCryoLog: boolean;
  hasDiegoDraft: boolean;
  hasFirewallHash: boolean;
  currentAct: string;
  onCanvasObjectClick: (objectId: string) => void;
}

export const StationCanvas: React.FC<StationCanvasProps> = ({
  alePos,
  canInteractWith,
  act1Done,
  act2Done,
  hasCryoLog,
  hasDiegoDraft,
  hasFirewallHash,
  onCanvasObjectClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pulseTime = 0;

    const render = () => {
      pulseTime += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background (Deep space blue)
      ctx.fillStyle = '#0B0B1A';
      ctx.fillRect(0, 0, width, height);

      // 2. Base Grid / Floor Tiles
      ctx.strokeStyle = '#15152E';
      ctx.lineWidth = 1;
      const tileSize = 32;
      for (let x = 0; x < width; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Room Partitions & Walls
      ctx.strokeStyle = '#5E4FA2';
      ctx.lineWidth = 3;

      // Bahía de Mantenimiento 4 (Izquierda)
      ctx.fillStyle = '#101026';
      ctx.fillRect(40, 50, 220, 240);
      ctx.strokeRect(40, 50, 220, 240);

      // Consola Central de Telecomunicaciones (Centro Superior)
      ctx.fillStyle = '#12122A';
      ctx.fillRect(300, 50, 220, 150);
      ctx.strokeRect(300, 50, 220, 150);

      // Despacho de Comandancia / Auditoría (Derecha)
      ctx.fillStyle = '#101028';
      ctx.fillRect(560, 50, 220, 240);
      ctx.strokeRect(560, 50, 220, 240);

      // Pasillo Conector Inferior
      ctx.fillStyle = '#0D0D22';
      ctx.fillRect(40, 320, 740, 160);
      ctx.strokeRect(40, 320, 740, 160);

      // Puertas
      ctx.fillStyle = '#0D0D22';
      ctx.fillRect(120, 288, 60, 34); // Puerta Hangar
      ctx.fillRect(380, 198, 60, 124); // Pasillo Telecomunicaciones
      ctx.fillRect(640, 288, 60, 34); // Puerta Comandancia

      // 4. Room Label Titles
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#4FD1C5';
      ctx.fillText('BAHÍA 4 // NÚCLEO CRIOGÉNICO', 50, 70);

      const isEcoActive = act1Done && !act2Done;
      ctx.fillStyle = isEcoActive ? '#D7263D' : '#EDEBFA';
      ctx.fillText('CONSOLA RED // NODO CENTRAL', 310, 70);

      ctx.fillStyle = '#E86AA8';
      ctx.fillText('DESPACHO DE COMANDANCIA', 570, 70);

      ctx.fillStyle = '#8F8CA8';
      ctx.fillText('PASILLO DE ENLACE DE CADETES', 50, 340);

      // 5. Interactive Physical Objects
      // A) Núcleo Criogénico & Osciloscopio (Bahía 4)
      ctx.fillStyle = '#1B2C44';
      ctx.fillRect(60, 90, 80, 50);
      ctx.strokeStyle = hasCryoLog ? '#4FD1C5' : '#E86AA8';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 90, 80, 50);

      // Fluido refrigerante animado
      ctx.fillStyle = '#4FD1C5';
      const waveOffset = Math.sin(pulseTime) * 3;
      ctx.fillRect(72, 105 + waveOffset, 56, 18);

      // Beacon icon on cryogenic terminal
      ctx.fillStyle = hasCryoLog ? '#4FD1C5' : '#E86AA8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(hasCryoLog ? '✓ BITÁCORA OK' : '⚙ OSCILOSCOPIO', 64, 84);

      // B) Locker 2 de Diego en el Pasillo
      ctx.fillStyle = '#222238';
      ctx.fillRect(60, 370, 70, 45);
      ctx.strokeStyle = hasDiegoDraft ? '#4FD1C5' : '#F2B544';
      ctx.strokeRect(60, 370, 70, 45);
      ctx.fillStyle = '#141422';
      ctx.fillRect(68, 380, 18, 25);
      ctx.fillRect(96, 380, 18, 25);

      ctx.fillStyle = hasDiegoDraft ? '#4FD1C5' : '#F2B544';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(hasDiegoDraft ? '✓ LOCKER 2 REVISADO' : '🔍 LOCKER 2', 62, 364);

      // C) Terminal Central de Red de Tropa & Cortafuegos
      ctx.fillStyle = isEcoActive ? '#3D1018' : '#1F1B38';
      ctx.fillRect(380, 90, 60, 50);
      ctx.strokeStyle = isEcoActive ? '#D7263D' : '#5E4FA2';
      ctx.lineWidth = 2;
      ctx.strokeRect(380, 90, 60, 50);

      ctx.fillStyle = isEcoActive ? '#D7263D' : '#4FD1C5';
      ctx.fillRect(390, 98, 40, 25);

      if (isEcoActive) {
        ctx.strokeStyle = '#D7263D';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(360, 70, 100, 90);
        ctx.setLineDash([]);

        ctx.fillStyle = '#D7263D';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText('! CORTAFUEGOS & ECO !', 355, 180);
      } else if (hasFirewallHash) {
        ctx.fillStyle = '#4FD1C5';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText('✓ RED AISLADA', 382, 84);
      }

      // D) Mesa de Auditoría en Comandancia
      ctx.fillStyle = '#281A38';
      ctx.fillRect(610, 120, 120, 60);
      ctx.strokeStyle = '#E86AA8';
      ctx.strokeRect(610, 120, 120, 60);

      ctx.fillStyle = '#E86AA8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText('AUDITORÍA FORMAL', 628, 114);

      // 6. Draw NPCs
      // Vale (Bahía 4)
      const valeX = 170;
      const valeY = 120;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(valeX + 11, valeY + 30, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1D2A44';
      ctx.fillRect(valeX, valeY + 8, 22, 22);
      ctx.fillStyle = '#E8BFA0';
      ctx.fillRect(valeX + 3, valeY, 16, 12);
      ctx.fillStyle = '#40241A';
      ctx.fillRect(valeX + 1, valeY - 4, 20, 8);
      ctx.fillStyle = '#4FD1C5';
      ctx.fillRect(valeX + 4, valeY + 3, 14, 3);
      ctx.fillStyle = '#E86AA8';
      ctx.fillRect(valeX - 3, valeY + 14, 4, 10);
      ctx.fillStyle = '#4FD1C5';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('VALE (ING)', valeX - 14, valeY - 8);

      // Diego (Pasillo)
      const diegoX = 180;
      const diegoY = 380;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(diegoX + 11, diegoY + 30, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2E2838';
      ctx.fillRect(diegoX, diegoY + 8, 22, 22);
      ctx.fillStyle = '#F2CDB0';
      ctx.fillRect(diegoX + 3, diegoY, 16, 12);
      ctx.fillStyle = '#A87A38';
      ctx.fillRect(diegoX + 2, diegoY - 3, 18, 6);
      ctx.fillStyle = '#F2B544';
      ctx.fillRect(diegoX + 18, diegoY + 12, 8, 12);
      ctx.fillStyle = '#F2B544';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('DIEGO', diegoX - 4, diegoY - 8);

      // Comandante Rosa y Sargento Ortega (Comandancia)
      const rosaX = 630;
      const rosaY = 100;
      ctx.fillStyle = '#2F1C3F';
      ctx.fillRect(rosaX, rosaY + 8, 22, 22);
      ctx.fillStyle = '#E6BEA1';
      ctx.fillRect(rosaX + 3, rosaY, 16, 12);
      ctx.fillStyle = '#A39FB3';
      ctx.fillRect(rosaX + 2, rosaY - 3, 18, 6);
      ctx.fillStyle = '#E86AA8';
      ctx.fillRect(rosaX + 8, rosaY + 10, 6, 12);
      ctx.fillStyle = '#E86AA8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('CMDTE. ROSA', rosaX - 16, rosaY - 8);

      const ortegaX = 690;
      const ortegaY = 100;
      ctx.fillStyle = '#32224A';
      ctx.fillRect(ortegaX, ortegaY + 8, 22, 22);
      ctx.fillStyle = '#E2BA9B';
      ctx.fillRect(ortegaX + 3, ortegaY, 16, 12);
      ctx.fillStyle = '#3D3A4A';
      ctx.fillRect(ortegaX + 2, ortegaY - 2, 18, 4);
      ctx.fillStyle = '#5E4FA2';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('SGTO. ORTEGA', ortegaX - 18, ortegaY - 8);

      // 7. Draw Player (Ale)
      const px = alePos.x;
      const py = alePos.y;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(px + 11, py + 30, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5E4FA2';
      ctx.fillRect(px, py + 8, 22, 22);
      ctx.fillStyle = '#EDEBFA';
      ctx.fillRect(px + 6, py + 8, 10, 6);
      ctx.fillStyle = '#F0D3B7';
      ctx.fillRect(px + 3, py, 16, 12);
      ctx.fillStyle = '#1C1829';
      ctx.fillRect(px + 2, py - 3, 18, 6);
      ctx.fillStyle = '#4FD1C5';
      ctx.fillRect(px - 1, py + 4, 3, 5);

      ctx.fillStyle = '#EDEBFA';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('ALE (TÚ)', px - 8, py - 8);

      // 8. Interaction Prompt Highlight
      if (canInteractWith) {
        ctx.fillStyle = '#4FD1C5';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        const msg = `[ESPACIO / CLIC] Interactuar: ${canInteractWith}`;
        const msgWidth = ctx.measureText(msg).width;
        
        ctx.fillStyle = 'rgba(11, 11, 26, 0.9)';
        ctx.fillRect(px - msgWidth / 2 + 11, py - 34, msgWidth + 18, 22);
        ctx.strokeStyle = '#4FD1C5';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px - msgWidth / 2 + 11, py - 34, msgWidth + 18, 22);

        ctx.fillStyle = '#4FD1C5';
        ctx.fillText(msg, px - msgWidth / 2 + 20, py - 19);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [alePos, canInteractWith, act1Done, act2Done, hasCryoLog, hasDiegoDraft, hasFirewallHash]);

  // Handle direct click on canvas objects for point-and-click interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check click near Cryo Oscilloscope (60-140, 90-140)
    if (clickX >= 50 && clickX <= 150 && clickY >= 80 && clickY <= 150) {
      sound.playBlip();
      onCanvasObjectClick('cryo_terminal');
      return;
    }

    // Check click near Locker 2 (60-130, 360-420)
    if (clickX >= 50 && clickX <= 140 && clickY >= 350 && clickY <= 430) {
      sound.playBlip();
      onCanvasObjectClick('locker_diego');
      return;
    }

    // Check click near Central Terminal (370-450, 80-150)
    if (clickX >= 360 && clickX <= 460 && clickY >= 70 && clickY <= 160) {
      sound.playBlip();
      onCanvasObjectClick('central_terminal');
      return;
    }

    // Check click near Diego (160-210, 360-420)
    if (clickX >= 160 && clickX <= 210 && clickY >= 360 && clickY <= 420) {
      sound.playBlip();
      onCanvasObjectClick('diego');
      return;
    }

    // Check click near Vale (150-200, 100-160)
    if (clickX >= 150 && clickX <= 200 && clickY >= 100 && clickY <= 160) {
      sound.playBlip();
      onCanvasObjectClick('vale');
      return;
    }

    // Check click near Command Desk (600-740, 100-190)
    if (clickX >= 600 && clickX <= 740 && clickY >= 100 && clickY <= 190) {
      sound.playBlip();
      onCanvasObjectClick('command_desk');
      return;
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-sm overflow-hidden border-2 border-[#5E4FA2]/60 shadow-2xl bg-[#0B0B1A]">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onClick={handleCanvasClick}
        className="w-full h-auto block select-none cursor-pointer"
        title="Haz clic sobre los personajes o terminales para interactuar"
      />
    </div>
  );
};
