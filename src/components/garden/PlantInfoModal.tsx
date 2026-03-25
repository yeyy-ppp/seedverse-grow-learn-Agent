import { motion } from 'framer-motion';
import { X, Droplets, Sprout } from 'lucide-react';
import { GardenPlot } from '@/contexts/SeedVerseContext';

interface PlantVisual {
  plant: {
    emoji: string;
    name: string;
    scientificName: string;
    environment?: string;
    features?: string;
    stages: { name: string; emoji: string; description: string; unlockContent: string }[];
  };
  stage: { name: string; emoji: string; description: string; unlockContent: string };
  stageIndex: number;
}

interface Props {
  plot: GardenPlot;
  visual: PlantVisual;
  onClose: () => void;
  onWater: () => void;
  onFertilize: () => void;
  onRemove: () => void;
}

const PlantInfoModal = ({ plot, visual, onClose, onWater, onFertilize, onRemove }: Props) => {
  const { plant, stage, stageIndex } = visual;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-background rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-foreground">{plant.emoji} {plant.name}</h3>
            <p className="text-xs text-muted-foreground italic">{plant.scientificName}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>

        {/* Sketch-style plant illustration */}
        <div className="relative bg-gradient-to-br from-leaf-light/50 to-petal-light/30 rounded-2xl p-6 text-center">
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-leaf/20" />
          <motion.span
            className="text-7xl block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {stage.emoji}
          </motion.span>
          <p className="font-bold text-foreground mt-2 font-display text-lg">{stage.name}阶段</p>
          <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
          {/* Sketch lines decoration */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-leaf/20 rounded-tl-lg" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-leaf/20 rounded-br-lg" />
        </div>

        {/* Plant info */}
        {(plant.environment || plant.features) && (
          <div className="space-y-2">
            {plant.environment && (
              <div className="bg-sun-light rounded-xl p-2.5 text-xs">
                <span className="font-bold text-secondary-foreground">🌍 环境：</span>
                <span className="text-muted-foreground">{plant.environment}</span>
              </div>
            )}
            {plant.features && (
              <div className="bg-petal-light rounded-xl p-2.5 text-xs">
                <span className="font-bold text-petal">✨ 特征：</span>
                <span className="text-muted-foreground">{plant.features}</span>
              </div>
            )}
          </div>
        )}

        {/* Growth stages bar */}
        <div className="flex items-center gap-1">
          {plant.stages.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${i <= stageIndex ? 'bg-leaf-light' : 'bg-muted'} ${i === stageIndex ? 'ring-2 ring-sun' : ''}`}>
                {i <= stageIndex ? s.emoji : '🔒'}
              </div>
              <span className="text-[7px] text-muted-foreground mt-0.5">{s.name}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-sky-light p-2.5 text-center">
            <Droplets size={16} className="mx-auto text-sky" />
            <p className="text-sm font-bold text-foreground mt-1">{Math.round(plot.waterLevel)}%</p>
            <p className="text-[9px] text-muted-foreground">水分</p>
          </div>
          <div className="rounded-xl bg-leaf-light p-2.5 text-center">
            <Sprout size={16} className="mx-auto text-leaf" />
            <p className="text-sm font-bold text-foreground mt-1">{Math.round(plot.growthProgress)}%</p>
            <p className="text-[9px] text-muted-foreground">生长进度</p>
          </div>
        </div>

        {/* Unlock content */}
        <div className="bg-sun-light rounded-xl p-3">
          <p className="text-xs font-semibold text-secondary-foreground">💡 {stage.unlockContent}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onWater} className="flex-1 btn-nature text-xs py-2">
            💧 浇水
          </button>
          <button
            onClick={onFertilize}
            disabled={plot.fertilized}
            className={`flex-1 btn-sun text-xs py-2 ${plot.fertilized ? 'opacity-50' : ''}`}
          >
            {plot.fertilized ? '✨ 已施肥' : '🌿 施肥'}
          </button>
        </div>
        <button onClick={onRemove} className="w-full text-xs text-destructive/70 py-1">
          🗑️ 移除植物
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PlantInfoModal;
