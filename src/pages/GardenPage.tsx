import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Link } from 'react-router-dom';
import { Sprout, LayoutGrid, Flower2 } from 'lucide-react';
import GardenSimulation from '@/components/garden/GardenSimulation';
import { Plant } from '@/data/plants';
import GrowthStage from '@/components/GrowthStage';

type ViewMode = 'garden' | 'list';

const GardenPage = () => {
  const { collectedSeeds, growSeed, getPlantById } = useSeedVerse();
  const [viewMode, setViewMode] = useState<ViewMode>('garden');

  return (
    <div className="min-h-screen pb-24">
      <div className="gradient-nature-bg pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <h1 className="text-2xl font-bold text-primary-foreground mb-1">🌿 成长花园</h1>
        <p className="text-sm text-primary-foreground/70">
          已收集 {collectedSeeds.length} 棵植物
        </p>
        {/* View toggle */}
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
  );
};

export default GardenPage;
