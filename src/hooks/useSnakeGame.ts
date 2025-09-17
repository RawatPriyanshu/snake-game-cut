import { useState, useEffect, useCallback } from 'react';
import { GameState, Direction, Position, SnakeSegment } from '@/types/snake';

const GRID_SIZE = 20;
const INITIAL_SNAKE: SnakeSegment[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_FOOD: Position = { x: 15, y: 15 };
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 150;

const generateFood = (snake: SnakeSegment[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

const getHighScore = (): number => {
  const saved = localStorage.getItem('snake-high-score');
  return saved ? parseInt(saved) : 0;
};

const saveHighScore = (score: number): void => {
  localStorage.setItem('snake-high-score', score.toString());
};

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: INITIAL_FOOD,
    direction: INITIAL_DIRECTION,
    isGameOver: false,
    score: 0,
    isPlaying: false,
  });

  const [highScore, setHighScore] = useState<number>(getHighScore());

  const resetGame = useCallback(() => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      isGameOver: false,
      score: 0,
      isPlaying: false,
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prev => {
      const opposites = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };
      
      if (opposites[prev.direction] === newDirection || !prev.isPlaying || prev.isGameOver) {
        return prev;
      }
      
      return { ...prev, direction: newDirection };
    });
  }, []);

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const head = prev.snake[0];
      const newHead: SnakeSegment = { ...head };

      switch (prev.direction) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        const newHighScore = Math.max(prev.score, highScore);
        setHighScore(newHighScore);
        saveHighScore(newHighScore);
        return { ...prev, isGameOver: true };
      }

      // Check self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        const newHighScore = Math.max(prev.score, highScore);
        setHighScore(newHighScore);
        saveHighScore(newHighScore);
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];

      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        const newFood = generateFood(newSnake);
        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: prev.score + 10,
        };
      }

      // Remove tail if no food eaten
      newSnake.pop();

      return {
        ...prev,
        snake: newSnake,
      };
    });
  }, [highScore]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [gameState.isPlaying, gameState.isGameOver, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (gameState.isGameOver) {
            resetGame();
          } else if (!gameState.isPlaying) {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, gameState.isGameOver, gameState.isPlaying, resetGame, startGame]);

  return {
    gameState,
    highScore,
    resetGame,
    startGame,
    changeDirection,
    GRID_SIZE,
  };
};