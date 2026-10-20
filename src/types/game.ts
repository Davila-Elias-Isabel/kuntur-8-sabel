export type PlayerGender = 'hombre' | 'mujer';

export type GameScreen = 
  | 'GENDER_SELECT'
  | 'LEVEL_MAP'
  | 'LEVEL_1_TALLER'
  | 'LEVEL_2_ZEROG'
  | 'LEVEL_3_FORENSIC'
  | 'LEVEL_4_SHIP'
  | 'LEVEL_5_COUNCIL'
  | 'GAME_OVER'
  | 'VICTORY_SCREEN';

export interface DecisionLogEntry {
  id: string;
  levelNumber: number;
  levelTitle: string;
  situation: string;
  chosenComment: string;
  isToxic: boolean;
  pointsDelta: number;
  whyThisMatters: string;
  realWorldImpact: string;
}

export interface ClueItem {
  id: 'clue_oscilloscope' | 'clue_drone' | 'clue_forensic' | 'clue_antenna';
  name: string;
  colloquialName: string;
  category: 'coartada' | 'fotos_base' | 'peritaje_ia' | 'ip_culpable';
  icon: string;
  whatItIs: string;
  howItHelpsInCouncil: string;
  unlocked: boolean;
}

export interface GameMetrics {
  puntos: number;
  vidas: number;
  senal?: number;
  riesgo?: number;
}

export interface GlossaryTerm {
  term: string;
  shortDefinition: string;
  teenAnalogy: string;
  whyItMatters: string;
}

export interface HotspotItem {
  id: string;
  xPercent: number;
  yPercent: number;
  isRealAnomaly: boolean;
  title: string;
  description: string;
  examined: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  plainExplanation?: string;
  acquiredAt?: string;
  isEvidence?: boolean;
  iconType?: string;
  loreDetail?: string;
}

export interface LiveChatMessage {
  id: string;
  author: string;
  authorRole: string;
  authorColor: string;
  text: string;
  timestamp: string;
  isMalicious?: boolean;
}

export interface DialogueChoice {
  id: string;
  label: string;
  nextStepId: string;
  deltaSignal?: number;
  deltaRisk?: number;
  pedagogicalTip?: string;
}

export interface DialogueStep {
  id: string;
  speaker: string;
  speakerRole: string;
  speakerColor: string;
  mood?: 'neutral' | 'concerned' | 'firm' | 'critical' | 'calm';
  avatarType: 'ale' | 'ale_hombre' | 'ale_mujer' | 'vale' | 'diego' | 'rosa' | 'eco' | 'ortega';
  text: string;
  choices?: DialogueChoice[];
  autoNextId?: string;
}
