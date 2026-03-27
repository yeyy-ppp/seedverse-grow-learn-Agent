import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import PlantDetailView from '@/components/identify/PlantDetailView';

type FilterMode = 'collected' | 'total' | 'undiscovered';

const SeedAtlasPage = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('filter') as FilterMode) || 'collected';
  const [filter, setFilter] = useState<FilterMode>(initialFilter);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const { collectedSeeds, getAllPlants, getSeed, markSeedViewed, gardenPlots } = useSeedVerse();

  const allPlants = getAllPlants();

  const filters: { key: FilterMode; label: string; count: number }[] = [
    { key: 'collected', label: '已收集', count: collectedSeeds.length },
    { key: 'total', label: '全部图鉴', count: allPlants.length },
    { key: 'undiscovered', label: '待探索', count: allPlants.length - collectedSeeds.length },
  ];

  const getDisplayPlants = () => {
    switch (filter) {
      case 'collected':
        return allPlants.filter(p => getSeed(p.id));
      case 'undiscovered':
        return allPlants.filter(p => !getSeed(p.id));
      case 'total':
      default:
        return allPlants;
    }
  };

  const displayPlants = getDisplayPlants();

  const handlePlantClick = (plant: Plant) => {
    const seed = getSeed(plant.id);
    if (!seed) return;
    if (seed.isNew) markSeedViewed(plant.id);
    setSelectedPlant(plant);
  };

  if (selectedPlant) {
    return <PlantDetailView plant={selectedPlant} onBack={() => setSelectedPlant(null)} showAll={true} />;
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-br from-leaf-light to-sky-light pt-10 pb-14 px-4 rounded-b-[3rem]">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center">
            <ArrowLeft size={18} className="text-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">🏷️ 种子图鉴</h1>
        </div>
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f.key
                  ? 'bg-leaf text-primary-foreground shadow-sm'
                  : 'bg-background/50 text-foreground/70'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-3 gap-3"
          >
            {displayPlants.length === 0 ? (
              <div className="col-span-3 card-nature p-8 text-center">
                <Sparkles size={32} className="mx-auto text-sun mb-2" />
                <p className="text-sm text-muted-foreground">
                  {filter === 'collected' ? '还没有收集种子哦，去识别植物吧！' :
                   filter === 'undiscovered' ? '太棒了，全部探索完毕！' : '暂无植物'}
                </p>
              </div>
            ) : (
              displayPlants.map((plant, i) => {
                const seed = getSeed(plant.id);
                const isCollected = !!seed;
                const isNew = seed?.isNew;
                const gardenPlot = gardenPlots.find(gp => gp.plantId === plant.id);

                return (
                  <motion.button
                    key={plant.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handlePlantClick(plant as Plant)}
                    disabled={!isCollected}
                    className={`card-nature p-3 flex flex-col items-center gap-1 relative transition-all ${
                      isCollected ? 'cursor-pointer' : 'opacity-40 grayscale cursor-not-allowed'
                    }`}
                  >
                    {isNew && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-pulse" />
                    )}
                    <span className={`text-3xl ${isCollected ? '' : 'blur-[2px]'}`}>
                      {isCollected ? plant.emoji : '❓'}
                    </span>
                    <span className={`text-[10px] font-bold truncate w-full text-center ${
                      isCollected ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {isCollected ? plant.name : '???'}
                    </span>
                    <span className="text-[8px] text-muted-foreground">
                      {isCollected ? plant.category : '未收集'}
                    </span>
                    {/* Growth sync from garden */}
                    {gardenPlot && (
                      <div className="w-full mt-0.5">
                        <div className="h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-leaf" style={{ width: `${gardenPlot.growthProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SeedAtlasPage;
