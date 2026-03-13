export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface GameDefinition {
  id: string;
  title: string;
  icon: string;
  route: string;
  difficulties?: GameDifficulty[];
}
