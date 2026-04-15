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
        className="rounded-2xl overflow-hidden cursor-pointer relative shadow-lg"
        style={{ aspectRatio: '1', background: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)', border: '2px solid #a5d6a7' }}
      >
        {plot.plantId && visual ? (
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            {/* Plant emoji */}
            <motion.span
              className="text-3xl block -mt-2"
              animate={weather === 'windy' ? { rotate: [-5, 5, -5] } : { y: [0, -3, 0] }}
              transition={{ duration: weather === 'windy' ? 0.5 : 2, repeat: Infinity }}
            >
              {visual.stage.emoji}
            </motion.span>

            {/* Water indicator */}
            <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-background/70 rounded-full px-1 py-0.5">
              <Droplets size={8} className={plot.waterLevel > 30 ? 'text-sky' : 'text-destructive'} />
              <span className="text-[7px] text-foreground font-medium">{Math.round(plot.waterLevel)}%</span>
            </div>
            {plot.fertilized && (
              <span className="absolute top-1.5 left-1.5 text-[10px]">✨</span>
            )}

            {/* Growth bar */}
            <div className="absolute bottom-14 left-2 right-2">
              <div className="h-1.5 rounded-full bg-muted/60">
                <div className="h-full rounded-full bg-leaf transition-all" style={{ width: `${plot.growthProgress}%` }} />
              </div>
            </div>

            {/* Pot base for planted */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%]">
              <div className="h-2 rounded-t-sm" style={{ background: 'linear-gradient(to right, #a0522d, #cd853f, #a0522d)' }} />
              <div className="h-2 mx-[8%]" style={{ background: 'linear-gradient(to bottom, #3e2723, #4e342e)' }} />
              <div
                className="h-8"
                style={{ background: 'linear-gradient(to bottom, #a0522d, #6d3a1f)', clipPath: 'polygon(5% 0, 95% 0, 82% 100%, 18% 100%)' }}
              />
              <div className="h-1.5 rounded-b-sm mx-[18%]" style={{ background: '#4a2510' }} />
            </div>
          </div>
        ) : (
          /* Empty pot — visible terracotta */
          <div className="relative z-10 flex flex-col items-center justify-end h-full">
            {/* Plus hint */}
            <div className="absolute top-[30%] flex flex-col items-center gap-1 text-muted-foreground">
              <Plus size={20} strokeWidth={2} />
              <span className="text-[9px] font-bold">播种</span>
            </div>

            {/* Terracotta pot — using inline styles for vivid colors */}
            <div className="w-[80%]">
              {/* Pot rim */}
              <div className="h-2.5 rounded-t-md shadow-sm" style={{ background: 'linear-gradient(to right, #a0522d, #cd853f, #a0522d)' }} />
              {/* Soil surface */}
              <div className="h-2.5 mx-[6%]" style={{ background: 'linear-gradient(to bottom, #3e2723, #5d4037)' }} />
              {/* Pot body */}
              <div
                className="h-10"
                style={{ background: 'linear-gradient(to bottom, #a0522d, #6d3a1f)', clipPath: 'polygon(5% 0, 95% 0, 80% 100%, 20% 100%)' }}
              />
              {/* Pot bottom */}
              <div className="h-1.5 rounded-b-sm mx-[20%]" style={{ background: '#4a2510' }} />
            </div>
          </div>
        )}
      </div>

      {/* Plant name label */}
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
