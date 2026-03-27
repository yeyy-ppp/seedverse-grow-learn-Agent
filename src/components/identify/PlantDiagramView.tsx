import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plant } from '@/data/plants';

interface Props {
  plant: Plant;
}

const partAnnotations = [
  {
    key: 'overallForm',
    label: '整体形态',
    emoji: '🌿',
    position: 'top-left',
    getDesc: (p: Plant) => p.morphology?.overallForm || p.features,
  },
  {
    key: 'flower',
    label: '花',
    emoji: '🌸',
    position: 'top-right',
    getDesc: (p: Plant) => p.morphology?.flower || '花期时绽放美丽的花朵',
  },
  {
    key: 'fruit',
    label: '果实',
    emoji: '🍎',
    position: 'mid-right',
    getDesc: (p: Plant) => p.morphology?.fruit || p.stages[p.stages.length - 1]?.description || '',
  },
  {
    key: 'stem',
    label: '茎',
    emoji: '🪵',
    position: 'mid-left',
    getDesc: (p: Plant) => p.morphology?.stem || p.features,
  },
  {
    key: 'leaf',
    label: '叶',
    emoji: '🍃',
    position: 'bottom-left',
    getDesc: (p: Plant) => p.morphology?.leaf || '叶片是植物进行光合作用的主要器官',
    getExtra: (p: Plant) => p.morphology?.leafShape ? `叶形：${p.morphology.leafShape}` : '',
  },
  {
    key: 'root',
    label: '根',
    emoji: '🌱',
    position: 'bottom-right',
    getDesc: (p: Plant) => p.morphology?.root || `适应${p.environment}`,
    getExtra: (p: Plant) => p.morphology?.rootType ? `类型：${p.morphology.rootType}` : '',
  },
];

const positionClasses: Record<string, string> = {
  'top-left': 'top-1 left-1',
  'top-right': 'top-1 right-1',
  'mid-left': 'top-[38%] left-1',
  'mid-right': 'top-[38%] right-1',
  'bottom-left': 'bottom-1 left-1',
  'bottom-right': 'bottom-1 right-1',
};

const svgLines: Record<string, [number, number, number, number]> = {
  'top-left': [80, 40, 200, 130],
  'top-right': [320, 40, 200, 130],
  'mid-left': [80, 180, 175, 180],
  'mid-right': [320, 180, 225, 180],
  'bottom-left': [80, 320, 200, 230],
  'bottom-right': [320, 320, 200, 230],
};

const PlantDiagramView = ({ plant }: Props) => {
  const [expandedPart, setExpandedPart] = useState<string | null>(null);

  return (
    <div className="card-nature p-4 space-y-4 overflow-hidden">
      <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
        🔬 {plant.name}图鉴
      </h3>

      {/* Central diagram area */}
      <div className="relative bg-gradient-to-br from-sun-light via-background to-leaf-light rounded-3xl p-4 min-h-[400px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 360">
          {partAnnotations.map(part => {
            const line = svgLines[part.position];
            return (
              <line key={part.key} x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]}
                stroke="hsl(var(--foreground) / 0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
            );
          })}
        </svg>

        {/* Central plant emoji */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <span className="text-7xl block drop-shadow-lg animate-float">{plant.emoji}</span>
        </motion.div>

        {/* Part annotations */}
        {partAnnotations.map((part, i) => (
          <motion.div
            key={part.key}
            className={`absolute ${positionClasses[part.position]} z-20 max-w-[44%]`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <button
              onClick={() => setExpandedPart(expandedPart === part.key ? null : part.key)}
              className={`bg-background/90 backdrop-blur-sm rounded-2xl p-2 shadow-md border transition-all w-full text-left ${
                expandedPart === part.key ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50'
              }`}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-base">{part.emoji}</span>
                <span className="font-black text-foreground text-xs">{part.label}</span>
              </div>
              <p className={`text-[9px] text-muted-foreground leading-relaxed ${
                expandedPart === part.key ? '' : 'line-clamp-2'
              }`}>
                {part.getDesc(plant)}
              </p>
              {'getExtra' in part && part.getExtra?.(plant) && (
                <span className="text-[8px] bg-leaf-light text-leaf px-1.5 py-0.5 rounded-full font-bold mt-1 inline-block">
                  {part.getExtra(plant)}
                </span>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {expandedPart && (() => {
          const part = partAnnotations.find(p => p.key === expandedPart);
          if (!part) return null;
          return (
            <motion.div
              key={expandedPart}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-sky-light to-leaf-light rounded-2xl p-4 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{part.emoji}</span>
                <span className="font-bold text-foreground">{part.label}详解</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{part.getDesc(plant)}</p>
              {'getExtra' in part && part.getExtra?.(plant) && (
                <div className="mt-2 flex gap-2">
                  <span className="text-[10px] bg-leaf-light text-leaf px-2 py-1 rounded-full font-bold">
                    {part.getExtra(plant)}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Info card */}
      <motion.div
        className="bg-gradient-to-br from-sun-light to-petal-light rounded-2xl p-4 border-2 border-dashed border-secondary/40 space-y-2"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
      >
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex"><span className="font-black text-foreground min-w-[70px]">学名：</span><span className="text-muted-foreground italic">{plant.scientificName}</span></div>
          <div className="flex"><span className="font-black text-foreground min-w-[70px]">科属：</span><span className="text-muted-foreground">{plant.family} · {plant.category}</span></div>
          <div className="flex"><span className="font-black text-foreground min-w-[70px]">根系类型：</span><span className="text-muted-foreground">{plant.morphology?.rootType || '—'}</span></div>
          <div className="flex"><span className="font-black text-foreground min-w-[70px]">叶形：</span><span className="text-muted-foreground">{plant.morphology?.leafShape || '—'}</span></div>
          <div className="flex"><span className="font-black text-foreground min-w-[70px]">生长环境：</span><span className="text-muted-foreground">{plant.environment}</span></div>
          <div className="flex"><span className="font-black text-foreground min-w-[70px]">生长数据：</span><span className="text-muted-foreground">{plant.morphology?.growthData || '—'}</span></div>
        </div>
      </motion.div>

      {/* Growth stages timeline */}
      <div className="space-y-2">
        <h4 className="font-bold text-foreground text-sm">🌱 生命周期</h4>
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {plant.stages.map((stage, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center min-w-[56px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-leaf-light flex items-center justify-center text-2xl mb-1 border-2 border-leaf/30">
                {stage.emoji}
              </div>
              <span className="text-[10px] font-bold text-foreground">{stage.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantDiagramView;
