import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSnakeGame } from '@/hooks/useSnakeGame';

const SnakeGame = () => {
  const { gameState, highScore, resetGame, startGame, GRID_SIZE } = useSnakeGame();

  const getCellContent = (x: number, y: number) => {
    const isSnakeHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
    const isSnakeBody = gameState.snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = gameState.food.x === x && gameState.food.y === y;

    if (isSnakeHead) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-snake to-snake-glow rounded-sm animate-pulse-neon border border-snake-glow/50" />
      );
    }
    if (isSnakeBody) {
      return (
        <div className="w-full h-full bg-snake rounded-sm shadow-[0_0_10px_hsl(var(--snake)/0.3)]" />
      );
    }
    if (isFood) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-food to-food-glow rounded-full animate-food-glow" />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-bg via-background to-game-bg flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-6 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-snake via-snake-glow to-snake bg-clip-text text-transparent">
            SNAKE
          </h1>
          <p className="text-muted-foreground text-lg">
            Use arrow keys or WASD to control the snake
          </p>
        </div>

        {/* Score Display */}
        <div className="flex gap-8 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Score</p>
            <p className="text-2xl font-bold text-snake">{gameState.score}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">High Score</p>
            <p className="text-2xl font-bold text-food">{highScore}</p>
          </div>
        </div>

        {/* Game Board */}
        <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm">
          <div 
            className="grid gap-px bg-grid p-2 rounded-lg"
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
                  className="w-4 h-4 md:w-6 md:h-6 bg-background/10 border border-grid/30 rounded-sm flex items-center justify-center"
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
                className="bg-gradient-to-r from-snake to-snake-glow hover:from-snake-glow hover:to-snake text-primary-foreground font-bold px-8 py-3 shadow-lg hover:shadow-[0_0_25px_hsl(var(--snake)/0.5)] transition-all duration-300"
              >
                Start Game
              </Button>
              <p className="text-sm text-muted-foreground">Press Space to start</p>
            </div>
          )}

          {gameState.isGameOver && (
            <div className="space-y-3 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-food">Game Over!</h2>
                <p className="text-muted-foreground">
                  Final Score: <span className="text-snake font-bold">{gameState.score}</span>
                </p>
              </div>
              <Button 
                onClick={resetGame}
                size="lg"
                className="bg-gradient-to-r from-food to-food-glow hover:from-food-glow hover:to-food text-destructive-foreground font-bold px-8 py-3 shadow-lg hover:shadow-[0_0_25px_hsl(var(--food)/0.5)] transition-all duration-300"
              >
                Play Again
              </Button>
              <p className="text-sm text-muted-foreground">Press Space to restart</p>
            </div>
          )}

          {gameState.isPlaying && (
            <div className="space-y-2 animate-fade-in">
              <div className="text-snake font-bold text-lg animate-pulse-neon">
                Playing...
              </div>
              <p className="text-sm text-muted-foreground">
                Eat the red food to grow and increase your score!
              </p>
            </div>
          )}
        </div>

        {/* Controls Guide */}
        <div className="text-center text-sm text-muted-foreground space-y-2 max-w-md">
          <p className="font-semibold">Controls:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>↑ ↓ ← → Arrow Keys</div>
            <div>W A S D Keys</div>
            <div>Space: Start/Restart</div>
            <div>Avoid walls and yourself!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;