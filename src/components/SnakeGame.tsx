import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSnakeGame } from '@/hooks/useSnakeGame';

const SnakeGame = () => {
  const { gameState, highScore, resetGame, startGame, GRID_SIZE } = useSnakeGame();

  const getSnakeHeadDirection = () => {
    switch (gameState.direction) {
      case 'UP': return 'rotate-0';
      case 'DOWN': return 'rotate-180';
      case 'LEFT': return 'rotate-[270deg]';
      case 'RIGHT': return 'rotate-90';
      default: return 'rotate-90';
    }
  };

  const getCellContent = (x: number, y: number) => {
    const isSnakeHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
    const isSnakeBody = gameState.snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = gameState.food.x === x && gameState.food.y === y;

    if (isSnakeHead) {
      return (
        <div className={`w-full h-full bg-gradient-to-br from-snake via-snake-secondary to-snake-glow rounded-lg border-2 border-snake-glow/60 relative overflow-hidden ${getSnakeHeadDirection()} transition-transform duration-150`}>
          {/* Snake head pattern */}
          <div className="absolute inset-0 bg-gradient-to-t from-snake/20 to-transparent rounded-lg" />
          
          {/* Snake eyes */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
            <div className="w-1 h-1 bg-snake-eye rounded-full shadow-sm" />
            <div className="w-1 h-1 bg-snake-eye rounded-full shadow-sm" />
          </div>
          
          {/* Nostril dots */}
          <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2">
            <div className="w-0.5 h-0.5 bg-snake-eye/60 rounded-full" />
          </div>
        </div>
      );
    }
    
    if (isSnakeBody) {
      const segmentIndex = gameState.snake.slice(1).findIndex(segment => segment.x === x && segment.y === y);
      const isEvenSegment = segmentIndex % 2 === 0;
      
      return (
        <div className={`w-full h-full rounded-md border border-snake/40 relative overflow-hidden ${
          isEvenSegment ? 'bg-gradient-to-br from-snake to-snake-secondary' : 'bg-gradient-to-br from-snake-secondary to-snake'
        }`}>
          {/* Body pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-snake-glow/10 to-transparent" />
          
          {/* Scale pattern */}
          <div className="absolute inset-0">
            <div className="w-full h-0.5 bg-snake-secondary/30 absolute top-1" />
            <div className="w-full h-0.5 bg-snake-secondary/30 absolute bottom-1" />
          </div>
        </div>
      );
    }
    
    if (isFood) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-food via-food-glow to-food rounded-full animate-food-glow border-2 border-food-glow/60 relative overflow-hidden">
          {/* Apple-like highlights */}
          <div className="absolute top-0.5 left-1 w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-white/60 rounded-full" />
          
          {/* Apple stem */}
          <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-green-600 rounded-full" />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-bg via-background to-game-bg flex items-center justify-center p-4 transition-colors duration-300">
      <div className="flex flex-col items-center space-y-6 max-w-2xl w-full">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-snake via-snake-glow to-snake bg-clip-text text-transparent drop-shadow-lg">
            🐍 SNAKE
          </h1>
          <p className="text-muted-foreground text-lg">
            Use arrow keys or WASD to control the snake
          </p>
        </div>

        {/* Score Display */}
        <div className="flex gap-8 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Score</p>
            <p className="text-2xl font-bold text-snake drop-shadow-sm">{gameState.score}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">High Score</p>
            <p className="text-2xl font-bold text-food drop-shadow-sm">{highScore}</p>
          </div>
        </div>

        {/* Game Board */}
        <Card className="p-6 bg-card/80 border-border/60 backdrop-blur-sm shadow-2xl">
          <div 
            className="grid gap-px bg-gradient-to-br from-grid via-grid/50 to-grid p-3 rounded-xl shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-4 h-4 md:w-6 md:h-6 bg-background/20 border border-grid/20 rounded-sm flex items-center justify-center transition-all duration-75"
                >
                  {getCellContent(x, y)}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Game Controls */}
        <div className="text-center space-y-4">
          {!gameState.isPlaying && !gameState.isGameOver && (
            <div className="space-y-2 animate-fade-in">
              <Button 
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-snake to-snake-glow hover:from-snake-glow hover:to-snake text-primary-foreground font-bold px-8 py-3 shadow-lg hover:shadow-[0_0_25px_hsl(var(--snake)/0.5)] transition-all duration-300 border border-snake-glow/30"
              >
                🎮 Start Game
              </Button>
              <p className="text-sm text-muted-foreground">Press Space to start</p>
            </div>
          )}

          {gameState.isGameOver && (
            <div className="space-y-3 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-food drop-shadow-sm">💀 Game Over!</h2>
                <p className="text-muted-foreground">
                  Final Score: <span className="text-snake font-bold">{gameState.score}</span>
                </p>
              </div>
              <Button 
                onClick={resetGame}
                size="lg"
                className="bg-gradient-to-r from-food to-food-glow hover:from-food-glow hover:to-food text-destructive-foreground font-bold px-8 py-3 shadow-lg hover:shadow-[0_0_25px_hsl(var(--food)/0.5)] transition-all duration-300 border border-food-glow/30"
              >
                🔄 Play Again
              </Button>
              <p className="text-sm text-muted-foreground">Press Space to restart</p>
            </div>
          )}

          {gameState.isPlaying && (
            <div className="space-y-2 animate-fade-in">
              <div className="text-snake-glow font-bold text-lg animate-pulse">
                🎯 Playing...
              </div>
              <p className="text-sm text-muted-foreground">
                Eat the 🍎 to grow and increase your score!
              </p>
            </div>
          )}
        </div>

        {/* Controls Guide */}
        <div className="text-center text-sm text-muted-foreground space-y-2 max-w-md opacity-75">
          <p className="font-semibold">🎮 Controls:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>↑ ↓ ← → Arrow Keys</div>
            <div>W A S D Keys</div>
            <div>Space: Start/Restart</div>
            <div>🚫 Avoid walls and yourself!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;