import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    const newHead = {
      x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
    };

    // Check collision with self
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      if (score > highScore) setHighScore(score);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check if food eaten
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(s => s + 10);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, gameStarted, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED - Math.min(score / 2, 100));
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, moveSnake, score]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="font-mono text-[4rem] font-bold text-[var(--accent-blue)] leading-none mb-1 drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]">
          {score.toString().padStart(4, '0')}
        </div>
        <div className="text-[0.7rem] uppercase tracking-[3px] text-[var(--text-secondary)] font-bold">Current Score</div>
      </div>

      <div 
        className="relative bg-black border-2 border-[var(--accent-neon)] shadow-[0_0_30px_rgba(0,255,157,0.15)] overflow-hidden"
        style={{ 
          width: 440, 
          height: 440,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={i === 0 ? { scale: 0.8 } : false}
            animate={{ scale: 1 }}
            className={`rounded-[2px] ${i === 0 ? 'bg-[var(--accent-neon)] shadow-[0_0_12px_var(--accent-neon)] z-10' : 'bg-[var(--accent-neon)]/60'}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-[#ff0055] rounded-full shadow-[0_0_12px_#ff0055]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {!gameStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              <h2 className="text-3xl font-black text-white mb-6 tracking-tighter italic uppercase">Ready?</h2>
              <Button 
                onClick={resetGame}
                className="bg-[var(--accent-neon)] hover:bg-[var(--accent-neon)]/80 text-black font-bold px-10 py-6 rounded-none text-lg shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all"
              >
                <Play className="mr-2 h-5 w-5 fill-current" /> START
              </Button>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-8 text-center"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Session Terminated</h2>
              <p className="text-[var(--text-secondary)] mb-6 font-mono">Final Score: {score}</p>
              <Button 
                onClick={resetGame}
                variant="outline"
                className="border-[var(--accent-neon)] text-[var(--accent-neon)] hover:bg-[var(--accent-neon)] hover:text-black font-bold px-8 py-6 rounded-none transition-all"
              >
                <RefreshCw className="mr-2 h-5 w-5" /> REBOOT
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col items-center">
          <div className="text-[var(--text-primary)] font-mono text-xl font-bold">{highScore.toString().padStart(4, '0')}</div>
          <div className="text-[0.6rem] uppercase tracking-widest text-[var(--text-secondary)]">High Score</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-[var(--text-primary)] font-mono text-xl font-bold">{Math.floor(1000 / (INITIAL_SPEED - Math.min(score / 2, 100)))}</div>
          <div className="text-[0.6rem] uppercase tracking-widest text-[var(--text-secondary)]">Frequency</div>
        </div>
      </div>
    </div>
  );
}
