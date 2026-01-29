
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  audioData?: string;
  suggestions?: string[];
  emotion?: string;
  isKnowledgeCard?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  persona: PersonaType;
}

export type PersonaType = 'standard' | 'coding' | 'teacher' | 'motivator' | 'creative';

export interface LearningProgress {
  level: number;
  xp: number;
  badges: string[];
  currentPath?: string;
}

export type ThemePack = 'default' | 'cyber-blue' | 'neon-dark' | 'soft-pastel';
export type FontStyle = 'modern' | 'minimal' | 'futuristic';
export type LayoutMode = 'compact' | 'comfortable';

export interface AppSettings {
  themePack: ThemePack;
  fontStyle: FontStyle;
  layoutMode: LayoutMode;
  theme: ThemeMode;
  language: Language;
  answerStyle: AnswerStyle;
  fontSize: FontSize;
  animationsEnabled: boolean;
  voiceEnabled: boolean;
  voiceName: string;
  safeMode: boolean;
  assistantMode: AssistantMode;
  personality: Personality;
}

export type ThemeMode = 'light' | 'dark' | 'amoled' | 'auto';
export type Language = 'id' | 'en' | 'auto';
export type AnswerStyle = 'brief' | 'normal' | 'detailed';
export type FontSize = 'small' | 'medium' | 'large';
export type AssistantMode = 'casual' | 'professional' | 'student' | 'coding' | 'creative';
export type Personality = 'friendly' | 'neutral' | 'firm' | 'humorous';

// Added Task and SubTask interfaces to fix TaskAssistant.tsx errors
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  subTasks: SubTask[];
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}
