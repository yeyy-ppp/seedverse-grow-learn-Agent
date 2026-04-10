import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Link } from 'react-router-dom';
import { Sprout, LayoutGrid, Flower2, Coins } from 'lucide-react';
import GardenSimulation from '@/components/garden/GardenSimulation';
import GardenWeatherEffects from '@/components/garden/GardenWeatherEffects';
import type { Weather, Season } from '@/components/garden/GardenSimulation';

type ViewMode = 'garden' | 'cards';

const CYCLE_MS = 12 * 60 * 60 * 1000;
const weatherBySeason: Record<Season, Weather[]> = {
  spring: ['sunny', 'light_rain', 'rainy', 'cloudy', 'windy', 'foggy'],
  summer: ['sunny', 'sunny', 'rainy', 'heavy_rain', 'cloudy', 'foggy'],
  autumn: ['sunny', 'cloudy', 'windy', 'light_rain', 'rainy', 'foggy'],
  winter: ['cloudy', 'snowy', 'snowy', 'windy', 'sleet', 'foggy'],
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
  const { collectedSeeds, collectedCards, points } = useSeedVerse();
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
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className={`text-sm ${envState.isNight ? 'text-sky-300/70' : 'text-primary-foreground/70'}`}>
              已收集 {collectedSeeds.length} 棵植物
            </p>
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              envState.isNight ? 'bg-sun/20 text-sun' : 'bg-primary-foreground/20 text-primary-foreground'
            }`}>
              <Coins size={12} /> {points}
            </span>
          </div>
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
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'cards' ? 'bg-primary-foreground text-primary' : 'bg-primary-foreground/20 text-primary-foreground'
              }`}
            >
              <LayoutGrid size={14} /> 花卡收集 ({collectedCards.length})
            </button>
          </div>
        </div>

        <div className="px-4 -mt-8">
          {viewMode === 'garden' ? (
            <GardenSimulation />
          ) : (
            <div className="space-y-4">
              {collectedCards.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-nature p-8 text-center space-y-3">
                  <Sprout size={48} className="mx-auto text-leaf animate-float" />
                  <h3 className="font-bold text-foreground">还没有收集花卡</h3>
                  <p className="text-xs text-muted-foreground">当花园中的植物开花时，可以收集为精美花卡！</p>
                  <Link to="/identify" className="btn-nature inline-block text-sm">🔍 去识别植物</Link>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {collectedCards.map((card, i) => (
                    <motion.div
                      key={card.plantId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="card-nature p-4 text-center space-y-2 relative overflow-hidden"
                    >
                      {/* Decorative flower frame */}
                      <div className="absolute inset-0 border-2 border-dashed border-petal/20 rounded-2xl m-1" />
                      <div className="absolute top-1 left-1 text-[8px]">🌸</div>
                      <div className="absolute top-1 right-1 text-[8px]">🌺</div>
                      <div className="absolute bottom-1 left-1 text-[8px]">🌼</div>
                      <div className="absolute bottom-1 right-1 text-[8px]">🏵️</div>
                      
                      <motion.span
                        className="text-5xl block"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {card.plantEmoji}
                      </motion.span>
                      <h4 className="font-bold text-foreground text-sm">{card.plantName}</h4>
                      <span className="text-[8px] bg-petal-light text-petal px-2 py-0.5 rounded-full font-bold">
                        🌸 盛开状态
                      </span>
                      <p className="text-[9px] text-muted-foreground">
                        {new Date(card.collectedAt).toLocaleDateString('zh-CN')} 收集
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GardenPage;
