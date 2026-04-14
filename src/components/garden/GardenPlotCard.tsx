import { motion } from 'framer-motion';
import { Droplets, Plus } from 'lucide-react';
import { GardenPlot } from '@/contexts/SeedVerseContext';
import type { Weather } from './GardenSimulation';

interface PlantVisual {
  plant: { emoji: string; name: string; stages: any[] };
  stage: { emoji: string; name: string };
  stageIndex: number;
}

interface Props {
  plot: GardenPlot;
  visual: PlantVisual | null;
  weather: Weather;
  onPlotClick: () => void;
  onWater: () => void;
  onFertilize: () => void;
}

const GardenPlotCard = ({ plot, visual, weather, onPlotClick, onWater, onFertilize }: Props) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <div
        onClick={onPlotClick}
        className="card-nature rounded-2xl overflow-hidden cursor-pointer relative"
        style={{ aspectRatio: '1' }}
      >
        {/* Soil background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-earth-light/20 to-earth-light/40" />

        {/* Realistic pot visual */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%]">
          {/* Pot rim */}
          <div className="h-2 rounded-t-sm bg-gradient-to-r from-[hsl(15,40%,55%)] via-[hsl(18,45%,60%)] to-[hsl(15,40%,55%)]" />
          {/* Pot body - tapered trapezoid */}
          <div
            className="h-10 bg-gradient-to-b from-[hsl(18,42%,52%)] to-[hsl(15,35%,42%)]"
            style={{ clipPath: 'polygon(8% 0, 92% 0, 82% 100%, 18% 100%)' }}
          />
          {/* Soil in pot */}
          <div
            className="absolute top-2 left-[12%] right-[12%] h-3 rounded-b-sm bg-gradient-to-b from-[hsl(25,30%,30%)] to-[hsl(25,25%,25%)]"
          />
        </div>

        {plot.plantId && visual ? (
          <div className="relative z-10 flex flex-col items-center justify-center h-full pt-1">
            <motion.span
              className="text-3xl block"
              animate={weather === 'windy' ? { rotate: [-5, 5, -5] } : { y: [0, -3, 0] }}
              transition={{ duration: weather === 'windy' ? 0.5 : 2, repeat: Infinity }}
            >
              {visual.stage.emoji}
            </motion.span>

            {/* Water indicator */}
            <div className="absolute top-1 right-1 flex items-center gap-0.5">
              <Droplets size={8} className={plot.waterLevel > 30 ? 'text-sky' : 'text-destructive'} />
              <span className="text-[7px] text-foreground">{Math.round(plot.waterLevel)}%</span>
            </div>
            {plot.fertilized && (
              <span className="absolute top-1 left-1 text-[8px]">✨</span>
            )}

            {/* Growth bar */}
            <div className="absolute bottom-12 left-2 right-2">
              <div className="h-1.5 rounded-full bg-muted/50">
                <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${plot.growthProgress}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Plus size={20} />
              <span className="text-[9px] font-bold">播种</span>
            </div>
          </div>
        )}
      </div>

      {/* Plant name label outside pot */}
      {plot.plantId && visual && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 flex items-center justify-center"
        >
          <div
            onClick={onPlotClick}
            className="bg-background/90 border border-border rounded-full px-2 py-0.5 flex items-center gap-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-[9px]">{visual.plant.emoji}</span>
            <span className="text-[9px] font-bold text-foreground truncate max-w-[60px]">{visual.plant.name}</span>
          </div>
        </motion.div>
      )}

      {/* Quick action buttons */}
      {plot.plantId && visual && (
        <div className="flex justify-center gap-1 mt-1">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); onWater(); }}
            className="bg-sky/20 hover:bg-sky/40 rounded-full w-6 h-6 flex items-center justify-center text-[10px] transition-colors"
            title="浇水"
          >
            💧
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); onFertilize(); }}
            className={`bg-leaf/20 hover:bg-leaf/40 rounded-full w-6 h-6 flex items-center justify-center text-[10px] transition-colors ${plot.fertilized ? 'opacity-40' : ''}`}
            disabled={plot.fertilized}
            title="施肥"
          >
            🌿
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default GardenPlotCard;
