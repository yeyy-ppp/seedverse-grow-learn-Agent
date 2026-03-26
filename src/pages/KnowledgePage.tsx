import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, TreePine, Leaf, Cherry, ChevronRight, Sparkles } from 'lucide-react';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import PlantDetailView from '@/components/identify/PlantDetailView';

// Dynamic categories built from actual plant data
const categoryMeta: Record<string, { icon: typeof Flower2 }> = {
  '草本植物': { icon: Flower2 },
  '乔木': { icon: TreePine },
  '水生植物': { icon: Leaf },
  '水果': { icon: Cherry },
  '蔬菜': { icon: Leaf },
};

type Tab = 'profile' | 'stories' | 'poems' | 'quiz' | 'scenes';

const KnowledgePage = () => {
  const { getAllPlants, collectedSeeds, getSeed } = useSeedVerse();
  const [activeCategory, setActiveCategory] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('stories');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const allPlants = getAllPlants();

  // Build categories dynamically from all plants (including custom)
  const categories = useMemo(() => {
    const catSet = new Set<string>();
    allPlants.forEach(p => { if (p.category) catSet.add(p.category); });
    const cats = [{ label: '全部', icon: Sparkles, filter: '' }];
    catSet.forEach(cat => {
      const meta = categoryMeta[cat];
      cats.push({ label: cat, icon: meta?.icon || Leaf, filter: cat });
    });
    return cats;
  }, [allPlants]);

  const filtered = activeCategory
    ? allPlants.filter(p => p.category === activeCategory)
    : allPlants;

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'profile', label: '植物档案', emoji: '🌿' },
    { key: 'stories', label: '趣味故事', emoji: '📖' },
    { key: 'poems', label: '诗词典故', emoji: '🎋' },
    { key: 'quiz', label: '知识问答', emoji: '❓' },
    { key: 'scenes', label: '情境探索', emoji: '🏞️' },
  ];

  if (selectedPlant) {
    return <PlantDetailView plant={selectedPlant} onBack={() => setSelectedPlant(null)} />;
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-br from-sun-light to-petal-light pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <h1 className="text-2xl font-bold text-foreground mb-1">📚 知识探索</h1>
        <p className="text-sm text-muted-foreground">探索植物世界的奥秘</p>
        <div className="flex gap-4 justify-center mt-4 text-xs">
          <div className="glass-card px-3 py-1">
            <span className="font-bold text-leaf">{allPlants.length}</span> 种植物
          </div>
          <div className="glass-card px-3 py-1">
            <span className="font-bold text-sun">{collectedSeeds.length}</span> 已学习
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Category filter - dynamically built */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map(c => (
            <button
              key={c.label}
              onClick={() => setActiveCategory(c.filter)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === c.filter
                  ? 'bg-leaf text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <c.icon size={14} /> {c.label}
            </button>
          ))}
        </div>

        {/* Content tabs */}
        <div className="flex gap-1 bg-muted rounded-2xl p-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 text-xs py-2 rounded-xl font-bold transition-all ${
                activeTab === t.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Content list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {filtered.length === 0 ? (
              <div className="card-nature p-8 text-center">
                <p className="text-sm text-muted-foreground">该分类暂无植物</p>
              </div>
            ) : (
              filtered.map(plant => (
                <motion.div
                  key={plant.id}
                  whileTap={{ scale: 0.98 }}
                  className="card-nature p-4 cursor-pointer"
                  onClick={() => setSelectedPlant(plant as Plant)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{plant.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-sm">{plant.name}</h3>
                        <span className="text-[8px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-bold">{plant.category}</span>
                        {getSeed(plant.id) && (
                          <span className="text-[8px] bg-leaf-light text-leaf px-1.5 py-0.5 rounded-full font-bold">已收集</span>
                        )}
                        {plant.id.startsWith('custom-') && (
                          <span className="text-[8px] bg-sun-light text-sun px-1.5 py-0.5 rounded-full font-bold">AI生成</span>
                        )}
                      </div>
                      {activeTab === 'stories' && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{plant.story}</p>
                      )}
                      {activeTab === 'poems' && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-display">{plant.poem}</p>
                      )}
                      {activeTab === 'quiz' && (
                        <p className="text-xs text-muted-foreground">
                          {plant.quiz.length} 道问答题 · 点击开始答题
                        </p>
                      )}
                      {activeTab === 'scenes' && (
                        <div>
                          <p className="text-xs font-bold text-sun mb-0.5">{plant.scene.name}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{plant.scene.description}</p>
                        </div>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground mt-1 shrink-0" />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KnowledgePage;
