import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse, GardenPlot } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import { Droplets, Sun, CloudRain, Cloud, Snowflake, Wind, X } from 'lucide-react';
import GardenWeatherEffects from './GardenWeatherEffects';
import GardenPlotCard from './GardenPlotCard';
import PlantInfoModal from './PlantInfoModal';

export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'snowy';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SolarTerm {
  name: string;
  emoji: string;
  description: string;
  season: Season;
}

export const solarTerms: SolarTerm[] = [
  { name: '立春', emoji: '🌱', description: '春天开始，万物复苏', season: 'spring' },
  { name: '雨水', emoji: '🌧️', description: '春雨贵如油', season: 'spring' },
  { name: '惊蛰', emoji: '🐛', description: '春雷惊醒冬眠动物', season: 'spring' },
  { name: '春分', emoji: '🌸', description: '昼夜等长，百花齐放', season: 'spring' },
  { name: '清明', emoji: '🍃', description: '天清气明，草木茂盛', season: 'spring' },
  { name: '谷雨', emoji: '🌾', description: '雨生百谷', season: 'spring' },
  { name: '立夏', emoji: '☀️', description: '夏天来了，草木繁茂', season: 'summer' },
  { name: '小满', emoji: '🌿', description: '谷物开始饱满', season: 'summer' },
  { name: '芒种', emoji: '🌾', description: '播种忙碌的时节', season: 'summer' },
  { name: '夏至', emoji: '🔥', description: '一年中白天最长', season: 'summer' },
  { name: '小暑', emoji: '🌡️', description: '天气逐渐炎热', season: 'summer' },
  { name: '大暑', emoji: '♨️', description: '一年最热的时候', season: 'summer' },
  { name: '立秋', emoji: '🍂', description: '秋天来了，凉风至', season: 'autumn' },
  { name: '处暑', emoji: '🌤️', description: '暑气渐消', season: 'autumn' },
  { name: '白露', emoji: '💧', description: '天气转凉，露水凝结', season: 'autumn' },
  { name: '秋分', emoji: '🍁', description: '昼夜等长，秋意渐浓', season: 'autumn' },
  { name: '寒露', emoji: '🥶', description: '露水更冷', season: 'autumn' },
  { name: '霜降', emoji: '🌫️', description: '开始降霜', season: 'autumn' },
  { name: '立冬', emoji: '❄️', description: '冬天来了', season: 'winter' },
  { name: '小雪', emoji: '🌨️', description: '开始下小雪', season: 'winter' },
  { name: '大雪', emoji: '⛄', description: '雪量增大', season: 'winter' },
  { name: '冬至', emoji: '🌙', description: '一年中夜晚最长', season: 'winter' },
  { name: '小寒', emoji: '🧊', description: '天气寒冷', season: 'winter' },
  { name: '大寒', emoji: '🥶', description: '一年最冷的时候', season: 'winter' },
];

export const seasonInfo: Record<Season, { name: string; emoji: string; bg: string; colors: string }> = {
  spring: { name: '春天', emoji: '🌸', bg: 'from-leaf-light to-petal-light', colors: 'text-leaf' },
  summer: { name: '夏天', emoji: '☀️', bg: 'from-sun-light to-sky-light', colors: 'text-sun' },
  autumn: { name: '秋天', emoji: '🍂', bg: 'from-fruit-light to-sun-light', colors: 'text-fruit' },
  winter: { name: '冬天', emoji: '❄️', bg: 'from-sky-light to-muted', colors: 'text-sky' },
};

export const weatherInfo: Record<Weather, { name: string; icon: typeof Sun; effect: string }> = {
  sunny: { name: '晴天', icon: Sun, effect: '阳光充足，植物生长加速' },
  rainy: { name: '雨天', icon: CloudRain, effect: '自动浇水，水分充足' },
  cloudy: { name: '多云', icon: Cloud, effect: '温和天气，正常生长' },
  windy: { name: '大风', icon: Wind, effect: '注意防护，生长略慢' },
  snowy: { name: '下雪', icon: Snowflake, effect: '寒冷天气，需要保暖' },
};

const weatherBySeason: Record<Season, Weather[]> = {
  spring: ['sunny', 'rainy', 'cloudy', 'windy'],
  summer: ['sunny', 'sunny', 'rainy', 'cloudy'],
  autumn: ['sunny', 'cloudy', 'windy', 'rainy'],
  winter: ['cloudy', 'snowy', 'snowy', 'windy'],
};

// One full seasonal cycle = 12 hours real time → 2 cycles per day
// Each season = 3 hours, each solar term = 30 minutes
const CYCLE_MS = 12 * 60 * 60 * 1000; // 12 hours in ms

/** Get time-based state from real clock — never resets on navigation */
function getTimeState() {
  const now = Date.now();
  const cyclePos = (now % CYCLE_MS) / CYCLE_MS; // 0..1 position in current cycle
  const percent = cyclePos * 100;

  const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
  const seasonIndex = Math.floor(cyclePos * 4) % 4;
  const season = seasons[seasonIndex];

  const termIndex = Math.floor(cyclePos * 24) % 24;
  const solarTerm = solarTerms[termIndex];

  // Day/night based on real hour
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 19;

  // Deterministic weather from 15-minute blocks
  const weatherBlock = Math.floor(now / (15 * 60 * 1000));
  const options = weatherBySeason[season];
  const weatherIndex = weatherBlock % options.length;
  const weather: Weather = isNight && options[weatherIndex] === 'sunny' ? 'cloudy' : options[weatherIndex];

  return { season, solarTerm, weather, percent, isNight };
}

const GardenSimulation = () => {
  const { collectedSeeds, getPlantById, growSeed, gardenPlots, setGardenPlots, waterPlot, fertilizePlot, plantSeedInPlot, removePlotPlant } = useSeedVerse();
  const collectedPlants = collectedSeeds.map(s => getPlantById(s.plantId)).filter(Boolean) as Plant[];

  const [timeState, setTimeState] = useState(getTimeState);
  const [showPlantPicker, setShowPlantPicker] = useState<number | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);

  const { season, solarTerm, weather, percent, isNight } = timeState;

  // Update time state every second
  useEffect(() => {
    const interval = setInterval(() => setTimeState(getTimeState()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Growth tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGardenPlots(prev => prev.map(plot => {
        if (!plot.plantId) return plot;
        let growthRate = 0.5;
        if (weather === 'sunny') growthRate = 1.0;
        if (weather === 'rainy') growthRate = 0.8;
        if (weather === 'windy') growthRate = 0.3;
        if (weather === 'snowy') growthRate = 0.1;
        if (season === 'spring') growthRate *= 1.2;
        if (season === 'summer') growthRate *= 1.0;
        if (season === 'autumn') growthRate *= 0.7;
        if (season === 'winter') growthRate *= 0.3;
        if (plot.waterLevel > 30) growthRate *= 1.2;
        if (plot.waterLevel < 15) growthRate *= 0.3;
        if (plot.fertilized) growthRate *= 1.5;
        if (isNight) growthRate *= 0.5;

        const waterDrain = weather === 'rainy' ? -0.5 : weather === 'sunny' ? 0.8 : 0.4;
        const newWater = Math.max(0, Math.min(100, plot.waterLevel - waterDrain));
        const newGrowth = Math.min(100, plot.growthProgress + growthRate);
        return { ...plot, growthProgress: newGrowth, waterLevel: newWater };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [weather, season, isNight, setGardenPlots]);

  // Sync growth to seed stages
  useEffect(() => {
    gardenPlots.forEach(plot => {
      if (!plot.plantId) return;
      const plant = getPlantById(plot.plantId);
      if (!plant) return;
      const stageIndex = Math.min(plant.stages.length - 1, Math.floor((plot.growthProgress / 100) * plant.stages.length));
      const seed = collectedSeeds.find(s => s.plantId === plot.plantId);
      if (seed && stageIndex > seed.currentStage) growSeed(plot.plantId);
    });
  }, [gardenPlots, collectedSeeds, getPlantById, growSeed]);

  const getPlantVisual = (plot: GardenPlot) => {
    if (!plot.plantId) return null;
    const plant = getPlantById(plot.plantId);
    if (!plant) return null;
    const stageIndex = Math.min(plant.stages.length - 1, Math.floor((plot.growthProgress / 100) * plant.stages.length));
    return { plant, stage: plant.stages[stageIndex], stageIndex };
  };

  const WeatherIcon = weatherInfo[weather].icon;
  const sInfo = seasonInfo[season];

  return (
    <div className="space-y-4">
      {/* Sky & Weather info bar */}
      <div className={`relative rounded-3xl p-4 overflow-hidden min-h-[140px] transition-colors duration-1000 ${
        isNight ? 'bg-gradient-to-b from-[hsl(230,30%,12%)] to-[hsl(230,25%,20%)]' : `bg-gradient-to-b ${sInfo.bg}`
      }`}>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isNight ? '🌙' : sInfo.emoji}</span>
              <span className={`font-bold ${isNight ? 'text-sky-200' : sInfo.colors}`}>
                {sInfo.name} · {isNight ? '夜晚' : '白天'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 bg-background/40 rounded-full px-2 py-0.5 w-fit">
              <span className="text-sm">{solarTerm.emoji}</span>
              <span className="text-xs font-bold text-foreground">{solarTerm.name}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{solarTerm.description}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <WeatherIcon size={14} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{weatherInfo[weather].name} · {weatherInfo[weather].effect}</span>
            </div>
          </div>
          <div className="text-4xl">
            {isNight
              ? (weather === 'snowy' ? '🌨️' : weather === 'rainy' ? '🌧️' : '🌙')
              : (weather === 'sunny' ? '☀️' : weather === 'rainy' ? '🌧️' : weather === 'cloudy' ? '☁️' : weather === 'windy' ? '💨' : '🌨️')
            }
          </div>
        </div>

        {/* Season progress */}
        <div className="mt-3 relative z-10">
          <div className="flex justify-between text-[8px] text-muted-foreground mb-1">
            <span>🌸春</span><span>☀️夏</span><span>🍂秋</span><span>❄️冬</span>
          </div>
          <div className="h-2.5 rounded-full bg-background/50 overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-leaf via-sun to-sky"
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border-2 border-foreground/30 shadow-sm"
              animate={{ left: `calc(${percent}% - 6px)` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Garden Plots */}
      <div className="grid grid-cols-3 gap-3">
        {gardenPlots.map(plot => (
          <GardenPlotCard
            key={plot.id}
            plot={plot}
            visual={getPlantVisual(plot)}
            weather={weather}
            onPlotClick={() => plot.plantId ? setSelectedPlot(plot.id) : setShowPlantPicker(plot.id)}
            onWater={() => waterPlot(plot.id)}
            onFertilize={() => fertilizePlot(plot.id)}
          />
        ))}
      </div>

      {/* Plant picker modal */}
      <AnimatePresence>
        {showPlantPicker !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 flex items-end justify-center"
            onClick={() => setShowPlantPicker(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-background rounded-t-3xl p-4 pb-8 max-h-[60vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-foreground">🌱 选择种子播种</h3>
                <button onClick={() => setShowPlantPicker(null)}><X size={20} className="text-muted-foreground" /></button>
              </div>
              {collectedPlants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">还没有收集种子，先去识别植物吧！</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {collectedPlants.map(plant => {
                    const alreadyPlanted = gardenPlots.some(p => p.plantId === plant.id);
                    return (
                      <motion.button
                        key={plant.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!alreadyPlanted) {
                            plantSeedInPlot(showPlantPicker, plant.id);
                            setShowPlantPicker(null);
                          }
                        }}
                        disabled={alreadyPlanted}
                        className={`card-nature p-3 flex flex-col items-center gap-1 ${alreadyPlanted ? 'opacity-40' : ''}`}
                      >
                        <span className="text-2xl">{plant.emoji}</span>
                        <span className="text-[10px] font-bold text-foreground">{plant.name}</span>
                        {alreadyPlanted && <span className="text-[8px] text-muted-foreground">已种植</span>}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected plot detail modal */}
      <AnimatePresence>
        {selectedPlot !== null && (() => {
          const plot = gardenPlots.find(p => p.id === selectedPlot);
          if (!plot || !plot.plantId) return null;
          const visual = getPlantVisual(plot);
          if (!visual) return null;
          return (
            <PlantInfoModal
              plot={plot}
              visual={visual}
              onClose={() => setSelectedPlot(null)}
              onWater={() => waterPlot(plot.id)}
              onFertilize={() => fertilizePlot(plot.id)}
              onRemove={() => { removePlotPlant(plot.id); setSelectedPlot(null); }}
            />
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default GardenSimulation;
