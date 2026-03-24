import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw } from 'lucide-react';

const GRID = 3;
const TOTAL = GRID * GRID;

// Scene color palettes mapped by plant color
const scenePalettes: Record<string, string[]> = {
  sun: ['#FDE68A', '#FBBF24', '#F59E0B', '#D97706', '#92400E'],
  leaf: ['#A7F3D0', '#34D399', '#10B981', '#059669', '#065F46'],
  petal: ['#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#BE185D'],
  sky: ['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#1D4ED8'],
  fruit: ['#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#B91C1C'],
};

const getSceneGradient = (plant: Plant) => {
  const colors = scenePalettes[plant.color] || scenePalettes.leaf;
  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, ${colors[4]} 100%)`;
};

interface Props {
  plant: Plant;
  onBack: () => void;
}

const SlidingPuzzle = ({ plant, onBack }: Props) => {
  const { collectSeed, incrementGame, getSeed } = useSeedVerse();
  const alreadyCollected = !!getSeed(plant.id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  // Generate puzzle image on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Background gradient
    const colors = scenePalettes[plant.color] || scenePalettes.leaf;
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.3, colors[1]);
    gradient.addColorStop(0.6, colors[2]);
    gradient.addColorStop(1, colors[3]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Decorative circles
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(
        30 + Math.random() * (size - 60),
        30 + Math.random() * (size - 60),
        10 + Math.random() * 25,
        0, Math.PI * 2
      );
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)] + '44';
      ctx.fill();
    }

    // Plant emoji in center
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(plant.emoji, size / 2, size / 2 - 20);

    // Scene name
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;
    ctx.fillText(plant.scene.name, size / 2, size - 40);
    ctx.shadowBlur = 0;

    setImageData(canvas.toDataURL());
  }, [plant]);

  // Puzzle state: array of tile indices, last is empty
  const solved = useMemo(() => Array.from({ length: TOTAL }, (_, i) => i), []);
  const [tiles, setTiles] = useState<number[]>(() => {
    const arr = [...solved];
    // Fisher-Yates shuffle ensuring solvability
    let inversions = 0;
    do {
      for (let i = TOTAL - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      // Count inversions (excluding the blank = TOTAL-1)
      inversions = 0;
      for (let i = 0; i < TOTAL - 1; i++) {
        for (let j = i + 1; j < TOTAL - 1; j++) {
          if (arr[i] !== TOTAL - 1 && arr[j] !== TOTAL - 1 && arr[i] > arr[j]) {
            inversions++;
          }
        }
      }
    } while (inversions % 2 !== 0);
    return arr;
  });
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);

  const emptyIdx = tiles.indexOf(TOTAL - 1);

  const canMove = (idx: number) => {
    const eRow = Math.floor(emptyIdx / GRID);
    const eCol = emptyIdx % GRID;
    const tRow = Math.floor(idx / GRID);
    const tCol = idx % GRID;
    return (Math.abs(eRow - tRow) + Math.abs(eCol - tCol)) === 1;
  };

  const handleTap = useCallback((idx: number) => {
    if (completed || !canMove(idx)) return;
    setTiles(prev => {
      const next = [...prev];
      [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
      // Check win
      const win = next.every((v, i) => v === i);
      if (win) {
        setCompleted(true);
        incrementGame();
        if (!alreadyCollected) collectSeed(plant.id);
      }
      return next;
    });
    setMoves(m => m + 1);
  }, [completed, emptyIdx, alreadyCollected, plant.id]);

  const tileSize = 100 / GRID;

  return (
    <div className="card-nature p-4 space-y-4">
      <canvas ref={canvasRef} className="hidden" />
      <div className="text-center">
        <span className="text-4xl">{plant.emoji}</span>
        <h3 className="font-bold text-foreground mt-1">{plant.scene.name} · 滑块拼图</h3>
        <p className="text-[10px] text-muted-foreground">点击空格旁边的方块来移动，还原完整图片</p>
        <p className="text-xs text-muted-foreground mt-1">步数：{moves}</p>
      </div>

      {/* Reference image */}
      {imageData && (
        <div className="flex justify-center">
          <div className="relative">
            <p className="text-[10px] text-muted-foreground text-center mb-1">参考图</p>
            <img src={imageData} alt="参考" className="w-24 h-24 rounded-xl border-2 border-border" />
          </div>
        </div>
      )}

      {/* Puzzle grid */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-border" style={{ width: 270, height: 270 }}>
        {tiles.map((tile, idx) => {
          if (tile === TOTAL - 1 && !completed) return null; // Empty space
          const srcRow = Math.floor(tile / GRID);
          const srcCol = tile % GRID;
          const row = Math.floor(idx / GRID);
          const col = idx % GRID;
          const movable = canMove(idx);

          return (
            <motion.button
              key={tile}
              layout
              onClick={() => handleTap(idx)}
              className={`absolute overflow-hidden ${movable && !completed ? 'cursor-pointer ring-2 ring-primary/30' : ''}`}
              style={{
                width: 90,
                height: 90,
                left: col * 90,
                top: row * 90,
              }}
              whileTap={movable ? { scale: 0.95 } : undefined}
            >
              {imageData && (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${imageData})`,
                    backgroundSize: '270px 270px',
                    backgroundPosition: `-${srcCol * 90}px -${srcRow * 90}px`,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-3">
          <p className="text-3xl">🎉</p>
          <p className="font-bold text-foreground">拼图完成！用了 {moves} 步</p>
          {!alreadyCollected && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-leaf font-bold"
            >
              🌱 解锁了新种子：{plant.name}！
            </motion.p>
          )}
          <button onClick={onBack} className="btn-sun text-sm">
            <RotateCcw size={14} className="inline mr-1" /> 继续挑战
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SlidingPuzzle;
