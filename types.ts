export type NutrientScore = 'good' | 'moderate' | 'high' | 'neutral';

export interface Nutrient {
  name: string;
  value: string;
  dv: string;
  score: NutrientScore;
}

export interface AnalysisResult {
  productName: string;
  nutrients: Nutrient[];
  allergens: string[];
  summary: string;
  fssaiVerified: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum AppView {
  SCAN = 'SCAN',
  CHAT = 'CHAT',
  HYDRATION = 'HYDRATION',
  DASHBOARD = 'DASHBOARD'
}
