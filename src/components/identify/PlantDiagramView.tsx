import { motion } from 'framer-motion';
import { Plant } from '@/data/plants';

interface Props {
  plant: Plant;
}

// Botanical part annotations with positions
const partAnnotations = [
  {
    key: 'flower',
    label: '花',
    emoji: '🌸',
    position: 'top-left',
    getDesc: (p: Plant) => `${p.name}的花朵是其最具辨识度的特征。${p.features.includes('花') ? p.features : '花期时绽放美丽的花朵。'}`,
  },
  {
    key: 'fruit',
    label: '果实',
    emoji: '🫘',
    position: 'top-right',
    getDesc: (p: Plant) => {
      const lastStage = p.stages[p.stages.length - 1];
      return lastStage ? `${lastStage.description} ${lastStage.unlockContent}` : '果实中蕴含着生命的种子。';
    },
  },
  {
    key: 'stem',
    label: '茎叶',
    emoji: '🌿',
    position: 'bottom-left',
    getDesc: (p: Plant) => `${p.features}`,
  },
  {
    key: 'root',
    label: '根系',
    emoji: '🪴',
    position: 'bottom-right',
    getDesc: (p: Plant) => `${p.name}的根系帮助它从土壤中吸收水分和养分，适应${p.environment.includes('土壤') ? '各类土壤环境' : p.environment}。`,
  },
];

const PlantDiagramView = ({ plant }: Props) => {
  return (
    <div className="card-nature p-4 space-y-4 overflow-hidden">
      <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
        🔬 {plant.name}图鉴
      </h3>

      {/* Central diagram area */}
      <div className="relative bg-gradient-to-br from-sun-light via-background to-leaf-light rounded-3xl p-6 min-h-[360px]">
        {/* Dashed annotation lines - decorative */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 360">
          {/* top-left to center */}
          <line x1="80" y1="60" x2="200" y2="140" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
          {/* top-right to center */}
          <line x1="320" y1="60" x2="200" y2="140" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
          {/* bottom-left to center */}
          <line x1="80" y1="300" x2="200" y2="210" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
          {/* bottom-right to center */}
          <line x1="320" y1="300" x2="200" y2="210" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
        </svg>

        {/* Central plant emoji */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <span className="text-8xl block drop-shadow-lg animate-float">{plant.emoji}</span>
        </motion.div>

        {/* Part annotations in corners */}
        {partAnnotations.map((part, i) => {
          const positionClasses: Record<string, string> = {
            'top-left': 'top-2 left-2',
            'top-right': 'top-2 right-2',
            'bottom-left': 'bottom-2 left-2',
            'bottom-right': 'bottom-2 right-2',
          };

          return (
            <motion.div
              key={part.key}
              className={`absolute ${positionClasses[part.position]} z-20 max-w-[45%]`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="bg-background/90 backdrop-blur-sm rounded-2xl p-2.5 shadow-md border border-border/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-lg">{part.emoji}</span>
                  <span className="font-black text-foreground text-sm">{part.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">
                  {part.getDesc(plant)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info card - like the reference image's bottom-right card */}
      <motion.div
        className="bg-gradient-to-br from-sun-light to-petal-light rounded-2xl p-4 border-2 border-dashed border-secondary/40 space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex">
            <span className="font-black text-foreground min-w-[60px]">别名：</span>
            <span className="text-muted-foreground">{plant.name}</span>
          </div>
          <div className="flex">
            <span className="font-black text-foreground min-w-[60px]">学名：</span>
            <span className="text-muted-foreground italic">{plant.scientificName}</span>
          </div>
          <div className="flex">
            <span className="font-black text-foreground min-w-[60px]">科属：</span>
            <span className="text-muted-foreground">{plant.family}{plant.category}</span>
          </div>
          <div className="flex">
            <span className="font-black text-foreground min-w-[60px]">形态特征：</span>
            <span className="text-muted-foreground">{plant.features}</span>
          </div>
          <div className="flex">
            <span className="font-black text-foreground min-w-[60px]">生长环境：</span>
            <span className="text-muted-foreground">{plant.environment}</span>
          </div>
          {plant.stages.length > 0 && (
            <>
              <div className="flex">
                <span className="font-black text-foreground min-w-[60px]">生长周期：</span>
                <span className="text-muted-foreground">{plant.stages.map(s => s.name).join(' → ')}</span>
              </div>
            </>
          )}
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
              {i < plant.stages.length - 1 && (
                <span className="absolute text-muted-foreground text-xs" style={{ display: 'none' }}>→</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantDiagramView;
