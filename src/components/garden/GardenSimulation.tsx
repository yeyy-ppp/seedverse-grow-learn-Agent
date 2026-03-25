import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse, GardenPlot } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import { Droplets, Sun, CloudRain, Cloud, Snowflake, Wind, X, Sprout, Plus } from 'lucide-react';
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
  dayRange: [number, number]; // percentage of year 0-100
}

export const solarTerms: SolarTerm[] = [
  { name: '立春', emoji: '🌱', description: '春天开始，万物复苏', season: 'spring', dayRange: [0, 4.17] },
  { name: '雨水', emoji: '🌧️', description: '春雨贵如油', season: 'spring', dayRange: [4.17, 8.33] },
  { name: '惊蛰', emoji: '🐛', description: '春雷惊醒冬眠动物', season: 'spring', dayRange: [8.33, 12.5] },
  { name: '春分', emoji: '🌸', description: '昼夜等长，百花齐放', season: 'spring', dayRange: [12.5, 16.67] },
  { name: '清明', emoji: '🍃', description: '天清气明，草木茂盛', season: 'spring', dayRange: [16.67, 20.83] },
  { name: '谷雨', emoji: '🌾', description: '雨生百谷', season: 'spring', dayRange: [20.83, 25] },
  { name: '立夏', emoji: '☀️', description: '夏天来了，草木繁茂', season: 'summer', dayRange: [25, 29.17] },
  { name: '小满', emoji: '🌿', description: '谷物开始饱满', season: 'summer', dayRange: [29.17, 33.33] },
  { name: '芒种', emoji: '🌾', description: '播种忙碌的时节', season: 'summer', dayRange: [33.33, 37.5] },
  { name: '夏至', emoji: '🔥', description: '一年中白天最长', season: 'summer', dayRange: [37.5, 41.67] },
  { name: '小暑', emoji: '🌡️', description: '天气逐渐炎热', season: 'summer', dayRange: [41.67, 45.83] },
  { name: '大暑', emoji: '♨️', description: '一年最热的时候', season: 'summer', dayRange: [45.83, 50] },
  { name: '立秋', emoji: '🍂', description: '秋天来了，凉风至', season: 'autumn', dayRange: [50, 54.17] },
  { name: '处暑', emoji: '🌤️', description: '暑气渐消', season: 'autumn', dayRange: [54.17, 58.33] },
  { name: '白露', emoji: '💧', description: '天气转凉，露水凝结', season: 'autumn', dayRange: [58.33, 62.5] },
  { name: '秋分', emoji: '🍁', description: '昼夜等长，秋意渐浓', season: 'autumn', dayRange: [62.5, 66.67] },
  { name: '寒露', emoji: '🥶', description: '露水更冷', season: 'autumn', dayRange: [66.67, 70.83] },
  { name: '霜降', emoji: '🌫️', description: '开始降霜', season: 'autumn', dayRange: [70.83, 75] },
  { name: '立冬', emoji: '❄️', description: '冬天来了', season: 'winter', dayRange: [75, 79.17] },
  { name: '小雪', emoji: '🌨️', description: '开始下小雪', season: 'winter', dayRange: [79.17, 83.33] },
  { name: '大雪', emoji: '⛄', description: '雪量增大', season: 'winter', dayRange: [83.33, 87.5] },
  { name: '冬至', emoji: '🌙', description: '一年中夜晚最长', season: 'winter', dayRange: [87.5, 91.67] },
  { name: '小寒', emoji: '🧊', description: '天气寒冷', season: 'winter', dayRange: [91.67, 95.83] },
  { name: '大寒', emoji: '🥶', description: '一年最冷的时候', season: 'winter', dayRange: [95.83, 100] },
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

const SEASON_DURATION = 60000;
const WEATHER_CHANGE_INTERVAL = 15000;

const GardenSimulation = () => {
  const { collectedSeeds, getAllPlants, getPlantById, growSeed, gardenPlots, setGardenPlots, waterPlot, fertilizePlot, plantSeedInPlot, removePlotPlant } = useSeedVerse();
  const collectedPlants = collectedSeeds.map(s => getPlantById(s.plantId)).filter(Boolean) as Plant[];

  const [season, setSeason] = useState<Season>('spring');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [showPlantPicker, setShowPlantPicker] = useState<number | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [dayTime, setDayTime] = useState(0);
  const [currentSolarTerm, setCurrentSolarTerm] = useState<SolarTerm>(solarTerms[0]);

  // Season & solar term cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setDayTime(prev => {
        const next = (prev + 0.5) % 100;
        const seasonIndex = Math.floor((next / 100) * 4);
        const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
        setSeason(seasons[seasonIndex]);
        const term = solarTerms.find(t => next >= t.dayRange[0] && next < t.dayRange[1]) || solarTerms[0];
        setCurrentSolarTerm(term);
        return next;
      });
    }, SEASON_DURATION / 50);
    return () => clearInterval(interval);
  }, []);

  // Weather changes
  useEffect(() => {
    const changeWeather = () => {
      const options = weatherBySeason[season];
      setWeather(options[Math.floor(Math.random() * options.length)]);
    };
    changeWeather();
    const interval = setInterval(changeWeather, WEATHER_CHANGE_INTERVAL);
    return () => clearInterval(interval);
  }, [season]);

  // Growth tick — uses setGardenPlots from context
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

        const waterDrain = weather === 'rainy' ? -0.5 : weather === 'sunny' ? 0.8 : 0.4;
        const newWater = Math.max(0, Math.min(100, plot.waterLevel - waterDrain));
        const newGrowth = Math.min(100, plot.growthProgress + growthRate);
        return { ...plot, growthProgress: newGrowth, waterLevel: newWater };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [weather, season, setGardenPlots]);

  // Sync growth to context
  useEffect(() => {
    gardenPlots.forEach(plot => {
      if (!plot.plantId) return;
      const plant = getPlantById(plot.plantId);
      if (!plant) return;
      const stageIndex = Math.min(plant.stages.length - 1, Math.floor((plot.growthProgress / 100) * plant.stages.length));
      const seed = collectedSeeds.find(s => s.plantId === plot.plantId);
      if (seed && stageIndex > seed.currentStage) {
        growSeed(plot.plantId);
      }
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
      {/* Sky & Weather with effects */}
      <div className={`relative rounded-3xl p-4 bg-gradient-to-b ${sInfo.bg} overflow-hidden min-h-[140px]`}>
        <GardenWeatherEffects weather={weather} season={season} />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{sInfo.emoji}</span>
              <span className={`font-bold ${sInfo.colors}`}>{sInfo.name}</span>
            </div>
            {/* Solar term */}
            <div className="flex items-center gap-1.5 mt-1 bg-background/40 rounded-full px-2 py-0.5 w-fit">
              <span className="text-sm">{currentSolarTerm.emoji}</span>
              <span className="text-xs font-bold text-foreground">{currentSolarTerm.name}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{currentSolarTerm.description}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <WeatherIcon size={14} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{weatherInfo[weather].name} · {weatherInfo[weather].effect}</span>
            </div>
          </div>
          <div className="text-4xl">
            {weather === 'sunny' ? '☀️' : weather === 'rainy' ? '🌧️' : weather === 'cloudy' ? '☁️' : weather === 'windy' ? '💨' : '🌨️'}
          </div>
        </div>

        {/* Season + solar term progress */}
        <div className="mt-3 relative z-10">
          <div className="flex justify-between text-[8px] text-muted-foreground mb-1">
            <span>🌸立春</span><span>☀️立夏</span><span>🍂立秋</span><span>❄️立冬</span>
          </div>
          <div className="h-2.5 rounded-full bg-background/50 overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-leaf via-sun to-sky"
              animate={{ width: `${dayTime}%` }}
              transition={{ duration: 0.5 }}
            />
            {/* Current position indicator */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border-2 border-foreground/30 shadow-sm"
              animate={{ left: `calc(${dayTime}% - 6px)` }}
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
