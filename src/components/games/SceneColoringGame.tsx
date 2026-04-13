import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw, Check } from 'lucide-react';

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

// Generate SVG scene elements based on plant
const generateSceneElements = (plant: Plant) => {
  const id = plant.id;
  const elements: { path: string; label: string; defaultColor: string }[] = [];

  // Common ground
  elements.push({ path: 'M0,280 Q100,260 200,275 Q300,260 400,280 L400,400 L0,400 Z', label: '地面', defaultColor: '#D1D5DB' });

  if (id === 'lotus') {
    elements.push({ path: 'M50,250 Q200,220 350,250 Q350,300 200,310 Q50,300 50,250 Z', label: '池塘', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M120,230 Q160,200 200,230 Q160,240 120,230 Z', label: '荷叶1', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M250,225 Q290,195 330,225 Q290,235 250,225 Z', label: '荷叶2', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M180,190 Q200,150 220,190 Q210,200 190,200 Z', label: '荷花', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M280,185 Q300,145 320,185 Q310,195 290,195 Z', label: '荷花2', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M30,200 L50,120 L70,200 L50,180 Z', label: '远山', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M320,180 L345,100 L370,180 L345,165 Z', label: '亭子', defaultColor: '#D1D5DB' });
  } else if (id === 'sunflower') {
    elements.push({ path: 'M80,160 Q100,80 120,160 L110,280 L90,280 Z', label: '向日葵茎1', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M70,100 A50,50 0 1,1 130,100 A50,50 0 1,1 70,100 Z', label: '花盘1', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M220,180 Q240,100 260,180 L250,280 L230,280 Z', label: '向日葵茎2', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M210,120 A50,50 0 1,1 270,120 A50,50 0 1,1 210,120 Z', label: '花盘2', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M320,200 Q340,150 360,200 L355,280 L325,280 Z', label: '向日葵茎3', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M310,165 A40,40 0 1,1 370,165 A40,40 0 1,1 310,165 Z', label: '花盘3', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M150,50 A30,30 0 1,1 210,50 A30,30 0 1,1 150,50 Z', label: '太阳', defaultColor: '#D1D5DB' });
  } else if (id === 'plum') {
    elements.push({ path: 'M180,280 Q185,200 170,150 Q160,120 180,100 Q200,80 220,100 Q240,120 230,150 Q220,200 215,280 Z', label: '树干', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M100,120 Q150,40 200,80 Q250,40 300,120 Q250,100 200,130 Q150,100 100,120 Z', label: '树冠', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M140,90 A8,8 0 1,1 156,90 A8,8 0 1,1 140,90 Z', label: '梅花1', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M210,70 A8,8 0 1,1 226,70 A8,8 0 1,1 210,70 Z', label: '梅花2', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M170,110 A8,8 0 1,1 186,110 A8,8 0 1,1 170,110 Z', label: '梅花3', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M0,250 Q50,240 100,260 Q200,240 300,260 Q350,250 400,260 L400,280 L0,280 Z', label: '雪地', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M60,270 Q65,260 70,270 Q75,260 80,270 Z', label: '小雪堆', defaultColor: '#D1D5DB' });
  } else if (id === 'pine') {
    elements.push({ path: 'M190,280 L195,160 L205,160 L210,280 Z', label: '树干', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M140,200 L200,100 L260,200 Z', label: '树冠下层', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M155,160 L200,70 L245,160 Z', label: '树冠中层', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M170,120 L200,40 L230,120 Z', label: '树冠顶层', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M30,200 Q80,150 130,220 Q80,250 30,200 Z', label: '灌木', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M300,220 Q340,180 380,230 Q340,260 300,220 Z', label: '灌木2', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M50,100 Q80,80 110,110 Q80,130 50,100 Z', label: '云', defaultColor: '#D1D5DB' });
  } else {
    // Generic scene
    elements.push({ path: 'M150,280 Q160,200 155,150 Q155,120 170,100 Q190,80 210,100 Q225,120 220,150 Q215,200 225,280 Z', label: '植物', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M100,130 Q190,50 280,130 Q190,110 100,130 Z', label: '叶冠', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M170,80 A20,20 0 1,1 210,80 A20,20 0 1,1 170,80 Z', label: '花/果', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M300,60 A25,25 0 1,1 350,60 A25,25 0 1,1 300,60 Z', label: '太阳', defaultColor: '#D1D5DB' });
    elements.push({ path: 'M40,100 Q70,80 100,100 Q70,110 40,100 Z', label: '云朵', defaultColor: '#D1D5DB' });
  }

  // Sky background always
  elements.unshift({ path: 'M0,0 L400,0 L400,280 Q200,260 0,280 Z', label: '天空', defaultColor: '#D1D5DB' });

  return elements;
};

const SceneColoringGame = ({ plant, onBack }: Props) => {
  const { collectSeed, incrementGame, getSeed, addPoints } = useSeedVerse();
  const alreadyCollected = !!getSeed(plant.id);
  const [selectedColor, setSelectedColor] = useState(RAINBOW_COLORS[0].color);
  const [colorMap, setColorMap] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const elements = useRef(generateSceneElements(plant)).current;
  const totalColorable = elements.length;

  const handleFill = (index: number) => {
    if (completed) return;
    setColorMap(prev => {
      const next = { ...prev, [index]: selectedColor };
      if (Object.keys(next).length >= totalColorable && !completed) {
        setCompleted(true);
        incrementGame();
        addPoints(2);
        if (!alreadyCollected) collectSeed(plant.id);
      }
      return next;
    });
  };

  const restart = () => {
    setColorMap({});
    setCompleted(false);
  };

  const filledCount = Object.keys(colorMap).length;
  const progress = Math.round((filledCount / totalColorable) * 100);

  return (
    <div className="card-nature p-4 space-y-4">
      <div className="text-center">
        <span className="text-4xl">{plant.emoji}</span>
        <h3 className="font-bold text-foreground mt-1">{plant.scene.name} · 场景绘图</h3>
        <p className="text-[10px] text-muted-foreground">选择颜色，点击区域进行填色</p>
      </div>

      {/* Color palette */}
      <div className="flex justify-center gap-2">
        {RAINBOW_COLORS.map(c => (
          <button
            key={c.color}
            onClick={() => setSelectedColor(c.color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === c.color ? 'border-foreground scale-125 shadow-lg' : 'border-border'
            }`}
            style={{ backgroundColor: c.color }}
            title={c.name}
          />
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-leaf to-sun"
            animate={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground font-bold">{filledCount}/{totalColorable}</span>
      </div>

      {/* SVG Canvas */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-border bg-background" style={{ maxWidth: 400 }}>
        <svg viewBox="0 0 400 400" className="w-full h-auto">
          {elements.map((el, i) => (
            <g key={i}>
              <path
                d={el.path}
                fill={colorMap[i] || '#F9FAFB'}
                stroke="hsl(var(--foreground) / 0.3)"
                strokeWidth="1.5"
                strokeDasharray={colorMap[i] ? '0' : '4 3'}
                className="cursor-pointer transition-colors hover:opacity-80"
                onClick={() => handleFill(i)}
              />
              {!colorMap[i] && (
                <text
                  x={getPathCenter(el.path)[0]}
                  y={getPathCenter(el.path)[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="hsl(var(--muted-foreground))"
                  className="pointer-events-none select-none"
                >
                  {el.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {completed && (
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
      )}
    </div>
  );
};

// Helper to approximate path center for label
function getPathCenter(d: string): [number, number] {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) || [];
  if (nums.length < 2) return [200, 200];
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < nums.length - 1; i += 2) {
    sumX += nums[i];
    sumY += nums[i + 1];
    count++;
  }
  return [sumX / count, sumY / count];
}

export default SceneColoringGame;
