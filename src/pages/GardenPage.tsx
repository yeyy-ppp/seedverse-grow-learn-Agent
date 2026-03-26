import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Link } from 'react-router-dom';
import { Sprout, LayoutGrid, Flower2 } from 'lucide-react';
import GardenSimulation from '@/components/garden/GardenSimulation';
import GardenWeatherEffects from '@/components/garden/GardenWeatherEffects';
import { Plant } from '@/data/plants';
import GrowthStage from '@/components/GrowthStage';
import type { Weather, Season } from '@/components/garden/GardenSimulation';

type ViewMode = 'garden' | 'list';

// Reuse the same deterministic time logic
const CYCLE_MS = 12 * 60 * 60 * 1000;
const weatherBySeason: Record<Season, Weather[]> = {
  spring: ['sunny', 'rainy', 'cloudy', 'windy'],
  summer: ['sunny', 'sunny', 'rainy', 'cloudy'],
  autumn: ['sunny', 'cloudy', 'windy', 'rainy'],
  winter: ['cloudy', 'snowy', 'snowy', 'windy'],
};

function getPageTimeState() {
  const now = Date.now();
  const cyclePos = (now % CYCLE_MS) / CYCLE_MS;
  const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
  const season = seasons[Math.floor(cyclePos * 4) % 4];
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 19;
  const weatherBlock = Math.floor(now / (15 * 60 * 1000));
  const options = weatherBySeason[season];
  const weather: Weather = (() => {
    const w = options[weatherBlock % options.length];
    return isNight && w === 'sunny' ? 'cloudy' : w;
  })();
  return { season, weather, isNight };
}

const GardenPage = () => {
  const { collectedSeeds, growSeed, getPlantById } = useSeedVerse();
  const [viewMode, setViewMode] = useState<ViewMode>('garden');
  const [envState, setEnvState] = useState(getPageTimeState);

  useEffect(() => {
    const iv = setInterval(() => setEnvState(getPageTimeState()), 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className={`min-h-screen pb-24 relative overflow-hidden transition-colors duration-1000 ${
      envState.isNight ? 'bg-[hsl(230,25%,8%)]' : ''
    }`}>
      {/* Fullscreen weather effects layer */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <GardenWeatherEffects weather={envState.weather} season={envState.season} isNight={envState.isNight} />
      </div>

      <div className="relative z-20">
        <div className={`pt-10 pb-14 px-4 rounded-b-[3rem] text-center transition-colors duration-1000 ${
          envState.isNight
            ? 'bg-gradient-to-br from-[hsl(230,30%,15%)] to-[hsl(250,25%,20%)]'
            : 'gradient-nature-bg'
        }`}>
          <h1 className={`text-2xl font-bold mb-1 ${envState.isNight ? 'text-sky-200' : 'text-primary-foreground'}`}>
            🌿 成长花园
          </h1>
          <p className={`text-sm ${envState.isNight ? 'text-sky-300/70' : 'text-primary-foreground/70'}`}>
            已收集 {collectedSeeds.length} 棵植物
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => setViewMode('garden')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'garden' ? 'bg-primary-foreground text-primary' : 'bg-primary-foreground/20 text-primary-foreground'
              }`}
            >
              <Flower2 size={14} /> 模拟种植
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-primary-foreground text-primary' : 'bg-primary-foreground/20 text-primary-foreground'
              }`}
            >
              <LayoutGrid size={14} /> 收集列表
            </button>
          </div>
        </div>

        <div className="px-4 -mt-8">
          {viewMode === 'garden' ? (
            <GardenSimulation />
          ) : (
            <div className="space-y-4">
              {collectedSeeds.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-nature p-8 text-center space-y-3">
                  <Sprout size={48} className="mx-auto text-leaf animate-float" />
                  <h3 className="font-bold text-foreground">花园还是空的哦</h3>
                  <p className="text-xs text-muted-foreground">去识别植物，收集你的第一颗种子吧！</p>
                  <Link to="/identify" className="btn-nature inline-block text-sm">🔍 去识别植物</Link>
                </motion.div>
              ) : (
                collectedSeeds.map((seed, i) => {
                  const plant = getPlantById(seed.plantId);
                  if (!plant) return null;
                  return (
                    <motion.div
                      key={seed.plantId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="card-nature p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">
                          {plant.emoji} {plant.name}
                          {plant.id.startsWith('custom-') && (
                            <span className="text-[8px] bg-sun-light text-sun px-1.5 py-0.5 rounded-full font-bold ml-2">AI</span>
                          )}
                        </h3>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(seed.collectedAt).toLocaleDateString('zh-CN')}收集
                        </span>
                      </div>
                      <GrowthStage
                        plant={plant as Plant}
                        currentStage={seed.currentStage}
                        unlocked={seed.unlocked}
                        onGrow={() => growSeed(seed.plantId)}
                      />
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GardenPage;
