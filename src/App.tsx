import React, { useState, useCallback } from 'react';
import { PlayerGender, GameMetrics, ClueItem, DecisionLogEntry, GameScreen } from './types/game';
import { GenderSelectionModal } from './components/GenderSelectionModal';
import { LevelMap } from './components/LevelMap';
import { Level1Taller } from './components/Level1Taller';
import { Level2ZeroG } from './components/Level2ZeroG';
import { Level3Forensic } from './components/Level3Forensic';
import { Level4Ship } from './components/Level4Ship';
import { Level5Council } from './components/Level5Council';
import { LevelTransitionModal } from './components/LevelTransitionModal';
import { GameOverModal } from './components/GameOverModal';
import { EndingModal } from './components/EndingModal';
import { GlossaryModal } from './components/GlossaryModal';
import { PedagogyModal } from './components/PedagogyModal';
import { EmergencyModal } from './components/EmergencyModal';
import { ReflectionNotesModal } from './components/ReflectionNotesModal';
import { VideoGeneratorModal } from './components/VideoGeneratorModal';
import { ImageStudioModal } from './components/ImageStudioModal';
import { TopHUD } from './components/TopHUD';
import { sound } from './services/audio';

interface ActiveTransitionData {
  completedLevelNumber: number;
  nextLevelNumber: number;
  earnedClue: ClueItem;
  earnedPoints: number;
}

export default function App() {
  // Player Profile
  const [gender, setGender] = useState<PlayerGender>('hombre');
  const [screen, setScreen] = useState<GameScreen>('GENDER_SELECT');

  // Progression
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [clues, setClues] = useState<ClueItem[]>([]);
  const [decisionLog, setDecisionLog] = useState<DecisionLogEntry[]>([]);

  // Score & Lives (Strict mathematical consistency)
  const [metrics, setMetrics] = useState<GameMetrics>({
    puntos: 70,
    vidas: 3
  });

  // Level Transition Interstitial
  const [activeTransition, setActiveTransition] = useState<ActiveTransitionData | null>(null);

  // Modal Overlays
  const [showGlossary, setShowGlossary] = useState(false);
  const [showPedagogy, setShowPedagogy] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showReflectionNotes, setShowReflectionNotes] = useState(false);
  const [showVideoLab, setShowVideoLab] = useState(false);
  const [showImageStudio, setShowImageStudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Helper to adjust metrics safely and trigger audio
  const modifyMetrics = useCallback((deltaPuntos: number = 0, deltaVidas: number = 0) => {
    setMetrics(prev => {
      const nextPuntos = Math.max(0, Math.min(100, prev.puntos + deltaPuntos));
      const nextVidas = Math.max(0, Math.min(3, prev.vidas + deltaVidas));
      return { puntos: nextPuntos, vidas: nextVidas };
    });

    if (deltaPuntos > 0) sound.playSignalUp();
    else if (deltaPuntos < 0) sound.playSignalDown();
  }, []);

  // Handle Gender Selection
  const handleSelectGender = (selectedGender: PlayerGender) => {
    setGender(selectedGender);
    setScreen('LEVEL_1_TALLER');
    sound.startMusic();
    sound.switchProceduralTrack(0); // KUNTUR base theme
  };

  // Level 1 Completion
  const handleCompleteLevel1 = (decision: DecisionLogEntry, clue: ClueItem) => {
    setDecisionLog(prev => [...prev, decision]);
    modifyMetrics(decision.pointsDelta, decision.isToxic ? -1 : 0);
    
    if (!clues.some(c => c.id === clue.id)) {
      setClues(prev => [...prev, clue]);
    }

    setCurrentLevelNumber(2);

    // Open Cinematic Transition to Level 2
    setActiveTransition({
      completedLevelNumber: 1,
      nextLevelNumber: 2,
      earnedClue: clue,
      earnedPoints: decision.pointsDelta
    });
  };

  // Level 2 Completion
  const handleCompleteLevel2 = (clue: ClueItem) => {
    if (!clues.some(c => c.id === clue.id)) {
      setClues(prev => [...prev, clue]);
    }
    modifyMetrics(10, 0);

    const logEntry: DecisionLogEntry = {
      id: 'l2-zerog',
      levelNumber: 2,
      levelTitle: 'Nivel 2: Hangar en Gravedad Cero',
      situation: 'Perseguir y capturar al microdron espía antes de que escape por la esclusa.',
      chosenComment: 'Mochila propulsora activada: interceptación del dron espía sin tocar objetos prohibidos.',
      isToxic: false,
      pointsDelta: 10,
      whyThisMatters: 'Recuperaste la evidencia física original antes de que el agresor destruyera las huellas.',
      realWorldImpact: 'Preservar las pruebas originales sin alterar es clave para sustentar una denuncia por acoso digital.'
    };
    setDecisionLog(prev => [...prev, logEntry]);

    setCurrentLevelNumber(3);

    // Open Cinematic Transition to Level 3
    setActiveTransition({
      completedLevelNumber: 2,
      nextLevelNumber: 3,
      earnedClue: clue,
      earnedPoints: 10
    });
  };

  // Level 3 Completion
  const handleCompleteLevel3 = (decision: DecisionLogEntry, clue: ClueItem) => {
    setDecisionLog(prev => [...prev, decision]);
    modifyMetrics(decision.pointsDelta, decision.isToxic ? -1 : 0);

    if (!clues.some(c => c.id === clue.id)) {
      setClues(prev => [...prev, clue]);
    }

    setCurrentLevelNumber(4);

    // Open Cinematic Transition to Level 4
    setActiveTransition({
      completedLevelNumber: 3,
      nextLevelNumber: 4,
      earnedClue: clue,
      earnedPoints: decision.pointsDelta
    });
  };

  // Level 4 Completion
  const handleCompleteLevel4 = (clue: ClueItem) => {
    if (!clues.some(c => c.id === clue.id)) {
      setClues(prev => [...prev, clue]);
    }
    modifyMetrics(10, 0);

    const logEntry: DecisionLogEntry = {
      id: 'l4-ship',
      levelNumber: 4,
      levelTitle: 'Nivel 4: Carrera en Nave // Antenas Repetidoras',
      situation: 'Cortar la señal de las 3 antenas repetidoras para evitar la difusión masiva del video.',
      chosenComment: 'Nave interceptora tripulada: 3 antenas destruidas y firma de IP de Diego rastreada.',
      isToxic: false,
      pointsDelta: 10,
      whyThisMatters: 'Frenaste la viralización a gran escala antes de que causara un daño irreparable.',
      realWorldImpact: 'Detener la retransmisión rápida protege a la persona de la revictimización en colegios y universidades.'
    };
    setDecisionLog(prev => [...prev, logEntry]);

    setCurrentLevelNumber(5);

    // Open Cinematic Transition to Level 5
    setActiveTransition({
      completedLevelNumber: 4,
      nextLevelNumber: 5,
      earnedClue: clue,
      earnedPoints: 10
    });
  };

  // Level 5 Completion (Victory)
  const handleVictory = () => {
    sound.playFanfare();
    sound.switchProceduralTrack(2); // Constelación triumph theme
    modifyMetrics(15, 0);

    const victoryEntry: DecisionLogEntry = {
      id: 'l5-council',
      levelNumber: 5,
      levelTitle: 'Nivel 5: Sala del Consejo // Duelo de Pruebas',
      situation: 'Desmontar las 4 mentiras de Diego ante la Comandante Rosa con pruebas técnicas irrefutables.',
      chosenComment: '¡FALSO! Pruebas periciales presentadas con firmeza y respeto procesal.',
      isToxic: false,
      pointsDelta: 15,
      whyThisMatters: 'Demostraste que los hechos y las pruebas periciales desarticulan cualquier campaña de odio o difamación.',
      realWorldImpact: 'La verdad documentada reivindica a las víctimas y sienta precedentes de justicia comunitaria.'
    };
    setDecisionLog(prev => [...prev, victoryEntry]);

    setScreen('VICTORY_SCREEN');
  };

  // Failure / Game Over Trigger
  const handleFailLevel = (decision: DecisionLogEntry) => {
    setDecisionLog(prev => [...prev, decision]);
    modifyMetrics(decision.pointsDelta, -1);
    sound.playSignalDown();
    setScreen('GAME_OVER');
  };

  // Continue from Transition Interstitial to the Next Level
  const handleContinueNextLevel = () => {
    if (!activeTransition) return;
    const nextLvl = activeTransition.nextLevelNumber;
    setActiveTransition(null);

    if (nextLvl === 2) setScreen('LEVEL_2_ZEROG');
    else if (nextLvl === 3) setScreen('LEVEL_3_FORENSIC');
    else if (nextLvl === 4) setScreen('LEVEL_4_SHIP');
    else if (nextLvl === 5) setScreen('LEVEL_5_COUNCIL');
  };

  // Restart Entire Game
  const handleRestartAll = () => {
    setMetrics({ puntos: 70, vidas: 3 });
    setClues([]);
    setDecisionLog([]);
    setCurrentLevelNumber(1);
    setActiveTransition(null);
    setScreen('GENDER_SELECT');
    sound.switchProceduralTrack(0);
    sound.playBlip();
  };

  // Retry Current Level
  const handleRetryCurrentLevel = () => {
    // Restore at least 1 life and 40 empathy so they can retry
    setMetrics(prev => ({
      puntos: Math.max(40, prev.puntos + 20),
      vidas: Math.max(1, prev.vidas)
    }));

    if (currentLevelNumber === 1) setScreen('LEVEL_1_TALLER');
    else if (currentLevelNumber === 2) setScreen('LEVEL_2_ZEROG');
    else if (currentLevelNumber === 3) setScreen('LEVEL_3_FORENSIC');
    else if (currentLevelNumber === 4) setScreen('LEVEL_4_SHIP');
    else setScreen('LEVEL_5_COUNCIL');
  };

  // Get current level title for HUD
  const getCurrentLevelTitle = () => {
    if (screen === 'LEVEL_1_TALLER') return 'Nivel 1: Taller & Osciloscopio';
    if (screen === 'LEVEL_2_ZEROG') return 'Nivel 2: Dron en Gravedad Cero';
    if (screen === 'LEVEL_3_FORENSIC') return 'Nivel 3: Detector de Holofakes';
    if (screen === 'LEVEL_4_SHIP') return 'Nivel 4: Carrera de Antenas';
    if (screen === 'LEVEL_5_COUNCIL') return 'Nivel 5: Duelo ante el Consejo';
    if (screen === 'LEVEL_MAP') return 'Mapa de Misiones';
    if (screen === 'VICTORY_SCREEN') return '¡Victoria! Constelación Ética';
    if (screen === 'GAME_OVER') return 'Simulación Colapsada';
    return 'Base Espacial KUNTUR';
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B1A] text-[#EDEBFA] flex flex-col justify-between overflow-x-hidden">
      
      {/* Top HUD (Always visible after gender select) */}
      {screen !== 'GENDER_SELECT' && (
        <TopHUD
          gender={gender}
          metrics={metrics}
          currentLevelTitle={getCurrentLevelTitle()}
          isMuted={isMuted}
          onToggleMute={() => {
            const next = sound.toggleMute();
            setIsMuted(next);
          }}
          onOpenGlossary={() => setShowGlossary(true)}
          onOpenPedagogy={() => setShowPedagogy(true)}
          onOpenEmergency={() => setShowEmergency(true)}
          onOpenLevelMap={() => setScreen('LEVEL_MAP')}
          onOpenReflectionNotes={() => setShowReflectionNotes(true)}
          onOpenVideoLab={() => setShowVideoLab(true)}
          onOpenImageStudio={() => setShowImageStudio(true)}
        />
      )}

      {/* Main Screen Container */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-5 relative">
        
        {/* Retro Scanline Overlay */}
        <div className="absolute inset-0 scanlines-overlay pointer-events-none rounded-sm" />

        {/* 1. Initial Gender Selection Screen */}
        {screen === 'GENDER_SELECT' && (
          <GenderSelectionModal
            onSelect={handleSelectGender}
            onOpenPedagogy={() => setShowPedagogy(true)}
          />
        )}

        {/* 2. Level Map / Mission Hub */}
        {screen === 'LEVEL_MAP' && (
          <LevelMap
            gender={gender}
            currentLevelNumber={currentLevelNumber}
            metrics={metrics}
            clues={clues}
            onSelectLevel={(lvl) => {
              if (lvl === 1) setScreen('LEVEL_1_TALLER');
              else if (lvl === 2) setScreen('LEVEL_2_ZEROG');
              else if (lvl === 3) setScreen('LEVEL_3_FORENSIC');
              else if (lvl === 4) setScreen('LEVEL_4_SHIP');
              else if (lvl === 5) setScreen('LEVEL_5_COUNCIL');
            }}
            onOpenGlossary={() => setShowGlossary(true)}
            onOpenPedagogy={() => setShowPedagogy(true)}
            onOpenEmergency={() => setShowEmergency(true)}
          />
        )}

        {/* 3. Level 1: Taller & Osciloscopio */}
        {screen === 'LEVEL_1_TALLER' && (
          <Level1Taller
            gender={gender}
            onCompleteLevel={handleCompleteLevel1}
            onFailLevel={handleFailLevel}
            onOpenGlossary={() => setShowGlossary(true)}
          />
        )}

        {/* 4. Level 2: Hangar Zero G Drone Chase */}
        {screen === 'LEVEL_2_ZEROG' && (
          <Level2ZeroG
            gender={gender}
            onCompleteLevel={handleCompleteLevel2}
            onOpenGlossary={() => setShowGlossary(true)}
          />
        )}

        {/* 5. Level 3: Forensic Holo Scanner & Chat Dilemma */}
        {screen === 'LEVEL_3_FORENSIC' && (
          <Level3Forensic
            gender={gender}
            onCompleteLevel={handleCompleteLevel3}
            onFailLevel={handleFailLevel}
            onOpenGlossary={() => setShowGlossary(true)}
          />
        )}

        {/* 6. Level 4: Ship Race & Antenna Knockout */}
        {screen === 'LEVEL_4_SHIP' && (
          <Level4Ship
            gender={gender}
            onCompleteLevel={handleCompleteLevel4}
            onOpenGlossary={() => setShowGlossary(true)}
          />
        )}

        {/* 7. Level 5: Courtroom Council Duel against Diego */}
        {screen === 'LEVEL_5_COUNCIL' && (
          <Level5Council
            gender={gender}
            clues={clues}
            onVictory={handleVictory}
            onDefeat={handleFailLevel}
            onOpenGlossary={() => setShowGlossary(true)}
          />
        )}

        {/* 8. Game Over Screen (Pedagogical breakdown of misogynistic/bystander choices) */}
        {screen === 'GAME_OVER' && (
          <GameOverModal
            gender={gender}
            decisionLog={decisionLog}
            onRetryLevel={handleRetryCurrentLevel}
            onRestartAll={handleRestartAll}
            onOpenPedagogy={() => setShowPedagogy(true)}
            onOpenReflectionNotes={() => setShowReflectionNotes(true)}
          />
        )}

        {/* 9. Victory Screen (Constelación Ética with full breakdown & UNESCO resources) */}
        {screen === 'VICTORY_SCREEN' && (
          <EndingModal
            metrics={metrics}
            gender={gender}
            decisionLog={decisionLog}
            onRestart={handleRestartAll}
            onOpenPedagogy={() => setShowPedagogy(true)}
            onOpenReflectionNotes={() => setShowReflectionNotes(true)}
          />
        )}

      </main>

      {/* Cinematic Level Transition Interstitial */}
      {activeTransition && (
        <LevelTransitionModal
          completedLevelNumber={activeTransition.completedLevelNumber}
          nextLevelNumber={activeTransition.nextLevelNumber}
          gender={gender}
          earnedClue={activeTransition.earnedClue}
          earnedPoints={activeTransition.earnedPoints}
          metrics={metrics}
          onContinue={handleContinueNextLevel}
          onOpenGlossary={() => setShowGlossary(true)}
        />
      )}

      {/* Auxiliary Global Modals */}
      {showGlossary && (
        <GlossaryModal onClose={() => setShowGlossary(false)} />
      )}

      {showPedagogy && (
        <PedagogyModal onClose={() => setShowPedagogy(false)} />
      )}

      {showEmergency && (
        <EmergencyModal onClose={() => setShowEmergency(false)} />
      )}

      {showReflectionNotes && (
        <ReflectionNotesModal onClose={() => setShowReflectionNotes(false)} />
      )}

      {showVideoLab && (
        <VideoGeneratorModal onClose={() => setShowVideoLab(false)} />
      )}

      {showImageStudio && (
        <ImageStudioModal onClose={() => setShowImageStudio(false)} />
      )}

    </div>
  );
}
