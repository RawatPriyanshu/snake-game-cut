export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: SnakeSegment[];
  food: Position;
  direction: Direction;
  isGameOver: boolean;
  score: number;
  isPlaying: boolean;
}

export interface GameStats {
  currentScore: number;
  highScore: number;
}