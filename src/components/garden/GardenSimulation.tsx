import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import { Droplets, Sun, CloudRain, Cloud, Snowflake, Wind, X, Sprout, Plus } from 'lucide-react';

type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'snowy';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface GardenPlot {
  id: number;
  plantId: string | null;
  growthProgress: number; // 0-100
  waterLevel: number; // 0-100
  fertilized: boolean;
  lastWatered: number;
}

const SEASON_DURATION = 60000; // 60s per season for demo
const WEATHER_CHANGE_INTERVAL = 15000; // 15s

const seasonInfo: Record<Season, { name: string; emoji: string; bg: string; colors: string }> = {
  spring: { name: '春天', emoji: '🌸', bg: 'from-leaf-light to-petal-light', colors: 'text-leaf' },
  summer: { name: '夏天', emoji: '☀️', bg: 'from-sun-light to-sky-light', colors: 'text-sun' },
  autumn: { name: '秋天', emoji: '🍂', bg: 'from-fruit-light to-sun-light', colors: 'text-fruit' },
  winter: { name: '冬天', emoji: '❄️', bg: 'from-sky-light to-muted', colors: 'text-sky' },
};

const weatherInfo: Record<Weather, { name: string; icon: typeof Sun; effect: string }> = {
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

const GardenSimulation = () => {
  const { collectedSeeds, getAllPlants, getPlantById, growSeed } = useSeedVerse();
  const allPlants = getAllPlants();
  const collectedPlants = collectedSeeds.map(s => getPlantById(s.plantId)).filter(Boolean) as Plant[];

  const [plots, setPlots] = useState<GardenPlot[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      plantId: null,
      growthProgress: 0,
      waterLevel: 50,
      fertilized: false,
      lastWatered: Date.now(),
    }))
  );

  const [season, setSeason] = useState<Season>('spring');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [showPlantPicker, setShowPlantPicker] = useState<number | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [dayTime, setDayTime] = useState(0); // 0-100 progress through the "year"
  const [raindrops, setRaindrops] = useState<{ id: number; x: number; delay: number }[]>([]);

  // Season cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setDayTime(prev => {
        const next = prev + 1;
        if (next >= 100) return 0;
        const seasonIndex = Math.floor((next / 100) * 4);
        const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
        setSeason(seasons[seasonIndex]);
        return next;
      });
    }, SEASON_DURATION / 25);
    return () => clearInterval(interval);
  }, []);

  // Weather changes
  useEffect(() => {
    const changeWeather = () => {
      const options = weatherBySeason[season];
      const newWeather = options[Math.floor(Math.random() * options.length)];
      setWeather(newWeather);
    };
    changeWeather();
    const interval = setInterval(changeWeather, WEATHER_CHANGE_INTERVAL);
    return () => clearInterval(interval);
  }, [season]);

  // Rain effect
  useEffect(() => {
    if (weather === 'rainy' || weather === 'snowy') {
      setRaindrops(Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
      })));
    } else {
      setRaindrops([]);
    }
  }, [weather]);

  // Growth tick
  useEffect(() => {
    const interval = setInterval(() => {
      setPlots(prev => prev.map(plot => {
        if (!plot.plantId) return plot;
        let growthRate = 0.5;
        // Weather effects
        if (weather === 'sunny') growthRate = 1.0;
        if (weather === 'rainy') growthRate = 0.8;
        if (weather === 'windy') growthRate = 0.3;
        if (weather === 'snowy') growthRate = 0.1;
        // Season effects
        if (season === 'spring') growthRate *= 1.2;
        if (season === 'summer') growthRate *= 1.0;
        if (season === 'autumn') growthRate *= 0.7;
        if (season === 'winter') growthRate *= 0.3;
        // Water & fertilizer
        if (plot.waterLevel > 30) growthRate *= 1.2;
        if (plot.waterLevel < 15) growthRate *= 0.3;
        if (plot.fertilized) growthRate *= 1.5;

        const newWater = Math.max(0, plot.waterLevel - (weather === 'rainy' ? -0.5 : weather === 'sunny' ? 0.8 : 0.4));
        const newGrowth = Math.min(100, plot.growthProgress + growthRate);

        return { ...plot, growthProgress: newGrowth, waterLevel: Math.min(100, newWater) };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [weather, season]);

  // Sync growth to context
  useEffect(() => {
    plots.forEach(plot => {
      if (!plot.plantId) return;
      const plant = getPlantById(plot.plantId);
      if (!plant) return;
      const stageIndex = Math.min(plant.stages.length - 1, Math.floor((plot.growthProgress / 100) * plant.stages.length));
      const seed = collectedSeeds.find(s => s.plantId === plot.plantId);
      if (seed && stageIndex > seed.currentStage) {
        growSeed(plot.plantId);
      }
    });
  }, [plots, collectedSeeds, getPlantById, growSeed]);

  const waterPlot = useCallback((plotId: number) => {
    setPlots(prev => prev.map(p =>
      p.id === plotId ? { ...p, waterLevel: Math.min(100, p.waterLevel + 30), lastWatered: Date.now() } : p
    ));
  }, []);

  const fertilizePlot = useCallback((plotId: number) => {
    setPlots(prev => prev.map(p =>
      p.id === plotId ? { ...p, fertilized: true } : p
    ));
    setTimeout(() => {
      setPlots(prev => prev.map(p =>
        p.id === plotId ? { ...p, fertilized: false } : p
      ));
    }, 30000);
  }, []);

  const plantSeed = useCallback((plotId: number, plantId: string) => {
    setPlots(prev => prev.map(p =>
      p.id === plotId ? { ...p, plantId, growthProgress: 0, waterLevel: 60, fertilized: false } : p
    ));
    setShowPlantPicker(null);
  }, []);

  const removePlant = useCallback((plotId: number) => {
    setPlots(prev => prev.map(p =>
      p.id === plotId ? { ...p, plantId: null, growthProgress: 0 } : p
    ));
    setSelectedPlot(null);
  }, []);

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
      {/* Sky & Weather */}
      <div className={`relative rounded-3xl p-4 bg-gradient-to-b ${sInfo.bg} overflow-hidden min-h-[120px]`}>
        {/* Rain/Snow particles */}
        {raindrops.map(drop => (
          <motion.div
            key={drop.id}
            className="absolute text-sm pointer-events-none"
            initial={{ y: -20, x: `${drop.x}%`, opacity: 0 }}
            animate={{ y: '120%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: weather === 'snowy' ? 3 : 1.5, repeat: Infinity, delay: drop.delay }}
          >
            {weather === 'snowy' ? '❄️' : '💧'}
          </motion.div>
        ))}

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{sInfo.emoji}</span>
              <span className={`font-bold ${sInfo.colors}`}>{sInfo.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <WeatherIcon size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{weatherInfo[weather].name}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{weatherInfo[weather].effect}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl">{weather === 'sunny' ? '☀️' : weather === 'rainy' ? '🌧️' : weather === 'cloudy' ? '☁️' : weather === 'windy' ? '💨' : '🌨️'}</div>
          </div>
        </div>

        {/* Season progress bar */}
        <div className="mt-3 relative z-10">
          <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
            <span>🌸春</span><span>☀️夏</span><span>🍂秋</span><span>❄️冬</span>
          </div>
          <div className="h-2 rounded-full bg-background/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-leaf via-sun to-sky"
              animate={{ width: `${dayTime}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Garden Plots */}
      <div className="grid grid-cols-3 gap-3">
        {plots.map(plot => {
          const visual = getPlantVisual(plot);
          return (
            <motion.div
              key={plot.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => plot.plantId ? setSelectedPlot(plot.id) : setShowPlantPicker(plot.id)}
              className="relative"
            >
              {/* Pot */}
              <div className="card-nature rounded-2xl overflow-hidden cursor-pointer" style={{ aspectRatio: '1' }}>
                {/* Soil background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-earth-light/30 to-earth-light/60" />

                {/* Pot visual */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%]">
                  <div className="h-3 rounded-t-lg bg-gradient-to-r from-fruit/60 via-fruit/80 to-fruit/60" />
                  <div className="h-8 rounded-b-xl bg-gradient-to-b from-fruit/70 to-fruit/50" style={{ clipPath: 'polygon(5% 0, 95% 0, 85% 100%, 15% 100%)' }} />
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
                    <span className="text-[8px] font-bold text-foreground mt-0.5 bg-background/70 px-1.5 rounded-full">{visual.stage.name}</span>
                    {/* Water indicator */}
                    <div className="absolute top-1 right-1 flex items-center gap-0.5">
                      <Droplets size={8} className={plot.waterLevel > 30 ? 'text-sky' : 'text-destructive'} />
                      <span className="text-[7px]">{Math.round(plot.waterLevel)}%</span>
                    </div>
                    {plot.fertilized && (
                      <span className="absolute top-1 left-1 text-[8px]">✨</span>
                    )}
                    {/* Growth bar */}
                    <div className="absolute bottom-10 left-2 right-2">
                      <div className="h-1 rounded-full bg-muted/50">
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
            </motion.div>
          );
        })}
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
                    const alreadyPlanted = plots.some(p => p.plantId === plant.id);
                    return (
                      <motion.button
                        key={plant.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !alreadyPlanted && plantSeed(showPlantPicker, plant.id)}
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
          const plot = plots.find(p => p.id === selectedPlot);
          if (!plot || !plot.plantId) return null;
          const visual = getPlantVisual(plot);
          if (!visual) return null;
          const { plant, stage, stageIndex } = visual;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/30 flex items-center justify-center p-4"
              onClick={() => setSelectedPlot(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm bg-background rounded-3xl p-5 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{plant.emoji} {plant.name}</h3>
                    <p className="text-xs text-muted-foreground italic">{plant.scientificName}</p>
                  </div>
                  <button onClick={() => setSelectedPlot(null)}><X size={20} className="text-muted-foreground" /></button>
                </div>

                {/* Stage visual */}
                <div className="text-center">
                  <motion.span className="text-6xl block" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    {stage.emoji}
                  </motion.span>
                  <p className="font-bold text-foreground mt-2">{stage.name}阶段</p>
                  <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
                </div>

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
                  <button onClick={() => waterPlot(plot.id)} className="flex-1 btn-nature text-xs py-2">
                    💧 浇水
                  </button>
                  <button
                    onClick={() => fertilizePlot(plot.id)}
                    disabled={plot.fertilized}
                    className={`flex-1 btn-sun text-xs py-2 ${plot.fertilized ? 'opacity-50' : ''}`}
                  >
                    {plot.fertilized ? '✨ 已施肥' : '🌿 施肥'}
                  </button>
                </div>
                <button onClick={() => removePlant(plot.id)} className="w-full text-xs text-destructive/70 py-1">
                  🗑️ 移除植物
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default GardenSimulation;
