import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw } from 'lucide-react';
import { drawPlantScene } from './SlidingPuzzle';

interface Props {
  plant: Plant;
  onBack: () => void;
}

const RAINBOW_COLORS = [
  { name: '黑', color: '#1F2937' },
  { name: '白', color: '#F9FAFB' },
  { name: '红', color: '#EF4444' },
  { name: '橙', color: '#F97316' },
  { name: '黄', color: '#EAB308' },
  { name: '绿', color: '#22C55E' },
  { name: '青', color: '#06B6D4' },
  { name: '蓝', color: '#3B82F6' },
  { name: '紫', color: '#A855F7' },
  { name: '粉', color: '#F472B6' },
  { name: '棕', color: '#92400E' },
];

const CANVAS_SIZE = 300;

const SceneColoringGame = ({ plant, onBack }: Props) => {
  const { collectSeed, incrementGame, getSeed, addPoints } = useSeedVerse();
  const alreadyCollected = !!getSeed(plant.id);
  const [selectedColor, setSelectedColor] = useState(RAINBOW_COLORS[2].color);
  const [completed, setCompleted] = useState(false);
  const [brushSize, setBrushSize] = useState(8);

  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const strokeCount = useRef(0);

  // Generate outline from the plant scene
  useEffect(() => {
    const outlineCanvas = outlineCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!outlineCanvas || !drawCanvas) return;

    // Draw original scene to temp canvas to create outline
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = CANVAS_SIZE;
    tempCanvas.height = CANVAS_SIZE;
    const tempCtx = tempCanvas.getContext('2d')!;
    drawPlantScene(tempCtx, plant, CANVAS_SIZE);

    // Convert to grayscale outline
    const imageData = tempCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const data = imageData.data;

    // Edge detection (simple Sobel-like)
    const gray = new Float32Array(CANVAS_SIZE * CANVAS_SIZE);
    for (let i = 0; i < data.length; i += 4) {
      gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    const outlineCtx = outlineCanvas.getContext('2d')!;
    outlineCanvas.width = CANVAS_SIZE;
    outlineCanvas.height = CANVAS_SIZE;
    outlineCtx.fillStyle = '#FFFFFF';
    outlineCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const outData = outlineCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const od = outData.data;

    for (let y = 1; y < CANVAS_SIZE - 1; y++) {
      for (let x = 1; x < CANVAS_SIZE - 1; x++) {
        const idx = y * CANVAS_SIZE + x;
        const gx = -gray[idx - CANVAS_SIZE - 1] - 2 * gray[idx - 1] - gray[idx + CANVAS_SIZE - 1]
          + gray[idx - CANVAS_SIZE + 1] + 2 * gray[idx + 1] + gray[idx + CANVAS_SIZE + 1];
        const gy = -gray[idx - CANVAS_SIZE - 1] - 2 * gray[idx - CANVAS_SIZE] - gray[idx - CANVAS_SIZE + 1]
          + gray[idx + CANVAS_SIZE - 1] + 2 * gray[idx + CANVAS_SIZE] + gray[idx + CANVAS_SIZE + 1];
        const mag = Math.sqrt(gx * gx + gy * gy);

        const pi = idx * 4;
        if (mag > 30) {
          od[pi] = 80;
          od[pi + 1] = 80;
          od[pi + 2] = 80;
          od[pi + 3] = 255;
        } else {
          od[pi] = 255;
          od[pi + 1] = 255;
          od[pi + 2] = 255;
          od[pi + 3] = 255;
        }
      }
    }
    outlineCtx.putImageData(outData, 0, 0);

    // Init draw canvas
    drawCanvas.width = CANVAS_SIZE;
    drawCanvas.height = CANVAS_SIZE;
    const drawCtx = drawCanvas.getContext('2d')!;
    drawCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, [plant]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = drawCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (completed) return;
    isDrawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || completed) return;
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  };

  const endDraw = () => {
    if (isDrawing.current) {
      strokeCount.current++;
      isDrawing.current = false;
      lastPos.current = null;

      // Check completion after enough strokes
      if (strokeCount.current >= 15 && !completed) {
        const ctx = drawCanvasRef.current?.getContext('2d');
        if (!ctx) return;
        const imgData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        let colored = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
          if (imgData.data[i] > 0) colored++;
        }
        const ratio = colored / (CANVAS_SIZE * CANVAS_SIZE);
        if (ratio > 0.35) {
          setCompleted(true);
          incrementGame();
          addPoints(2);
          if (!alreadyCollected) collectSeed(plant.id);
        }
      }
    }
  };

  const restart = () => {
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    strokeCount.current = 0;
    setCompleted(false);
  };

  return (
    <div className="card-nature p-4 space-y-4">
      <div className="text-center">
        <span className="text-4xl">{plant.emoji}</span>
        <h3 className="font-bold text-foreground mt-1">{plant.scene.name} · 场景绘图</h3>
        <p className="text-[10px] text-muted-foreground">选择颜色，在轮廓线上填色吧！</p>
      </div>

      {/* Color palette */}
      <div className="flex flex-wrap justify-center gap-2">
        {RAINBOW_COLORS.map(c => (
          <button
            key={c.color}
            onClick={() => setSelectedColor(c.color)}
            className={`w-7 h-7 rounded-full border-2 transition-all ${
              selectedColor === c.color ? 'border-foreground scale-125 shadow-lg' : 'border-border'
            }`}
            style={{ backgroundColor: c.color }}
            title={c.name}
          />
        ))}
      </div>

      {/* Brush size */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-[10px] text-muted-foreground">画笔大小：</span>
        {[4, 8, 14, 22].map(s => (
          <button
            key={s}
            onClick={() => setBrushSize(s)}
            className={`rounded-full border-2 transition-all ${
              brushSize === s ? 'border-primary bg-primary/10' : 'border-border'
            }`}
            style={{ width: Math.max(16, s + 8), height: Math.max(16, s + 8) }}
          >
            <div
              className="rounded-full mx-auto"
              style={{ width: s, height: s, backgroundColor: selectedColor }}
            />
          </button>
        ))}
      </div>

      {/* Canvas area */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-border bg-white" style={{ maxWidth: 320 }}>
        {/* Outline layer (bottom) */}
        <canvas
          ref={outlineCanvasRef}
          className="w-full h-auto"
          style={{ display: 'block' }}
        />
        {/* Drawing layer (top, transparent) */}
        <canvas
          ref={drawCanvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          style={{ mixBlendMode: 'multiply' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      {completed ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-3">
          <p className="text-3xl">🎨</p>
          <p className="font-bold text-foreground">绘图完成！画得真棒！</p>
          {!alreadyCollected && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-leaf font-bold">
              🌱 解锁了新种子：{plant.name}！
            </motion.p>
          )}
          <button onClick={restart} className="btn-sun text-sm">
            <RotateCcw size={14} className="inline mr-1" /> 重新绘制
          </button>
        </motion.div>
      ) : (
        <div className="text-center">
          <button onClick={restart} className="text-[10px] text-muted-foreground underline">
            清除重画
          </button>
        </div>
      )}
    </div>
  );
};

export default SceneColoringGame;
