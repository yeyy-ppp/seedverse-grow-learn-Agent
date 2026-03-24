import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import { Puzzle, BookOpen, Palette, ArrowLeft, Lock, Unlock } from 'lucide-react';
import SlidingPuzzle from '@/components/games/SlidingPuzzle';
import PlantPoemGame from '@/components/games/PlantPoemGame';
import MatchGame from '@/components/games/MatchGame';

type GameType = 'puzzle' | 'poem' | 'match' | null;

const GamesPage = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const { getAllPlants, getSeed } = useSeedVerse();
  const allPlants = getAllPlants();

  const games = [
    { type: 'puzzle' as const, icon: Puzzle, name: '场景拼图', desc: '拼出植物的生长场景图片，解锁新种子', color: 'bg-leaf-light text-leaf', needsPlant: true },
    { type: 'poem' as const, icon: BookOpen, name: '诗词填空', desc: '针对每种植物的相关诗词进行填空', color: 'bg-petal-light text-petal', needsPlant: true },
    { type: 'match' as const, icon: Palette, name: '配对游戏', desc: '找到对应的植物', color: 'bg-sun-light text-sun', needsPlant: false },
  ];

  const renderPlantSelect = (gameType: GameType) => (
    <motion.div key="plant-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <button onClick={() => setActiveGame(null)} className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
        <ArrowLeft size={14} /> 返回游戏列表
      </button>
      <h3 className="font-bold text-foreground mb-3">
        选择一个植物进行{gameType === 'puzzle' ? '拼图' : '诗词'}挑战
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {allPlants.map(plant => {
          const collected = !!getSeed(plant.id);
          return (
            <motion.button
              key={plant.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPlant(plant as Plant)}
              className="card-nature p-3 flex flex-col items-center gap-2 relative"
            >
              {collected ? (
                <span className="absolute top-1.5 right-1.5 text-[8px] bg-leaf-light text-leaf px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                  <Unlock size={8} /> 已解锁
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 text-[8px] bg-sun-light text-sun px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                  <Lock size={8} /> 待解锁
                </span>
              )}
              <span className="text-3xl mt-2">{plant.emoji}</span>
              <span className="text-xs font-bold text-foreground">{plant.name}</span>
              <span className="text-[9px] text-muted-foreground">{plant.scene.name}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-br from-sun-light to-petal-light pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <h1 className="text-2xl font-bold text-foreground mb-1">🎮 趣味游戏</h1>
        <p className="text-sm text-muted-foreground">边玩边学，探索植物奥秘</p>
      </div>

      <div className="px-4 -mt-8 space-y-4">
        <AnimatePresence mode="wait">
          {activeGame === null && !selectedPlant ? (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {games.map((g, i) => (
                <motion.button
                  key={g.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveGame(g.type)}
                  className="card-nature p-4 flex items-center gap-4 w-full text-left"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${g.color}`}>
                    <g.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{g.name}</h3>
                    <p className="text-xs text-muted-foreground">{g.desc}</p>
                  </div>
                  {g.needsPlant && (
                    <span className="text-[9px] bg-sun-light text-sun px-2 py-0.5 rounded-full font-bold">可解锁种子</span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          ) : (activeGame === 'puzzle' || activeGame === 'poem') && !selectedPlant ? (
            renderPlantSelect(activeGame)
          ) : (
            <motion.div key={activeGame} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button
                onClick={() => { setSelectedPlant(null); if (activeGame !== 'match') { /* stay on plant select */ } else setActiveGame(null); }}
                className="text-sm text-muted-foreground mb-3 flex items-center gap-1"
              >
                <ArrowLeft size={14} /> {activeGame === 'match' ? '返回游戏列表' : '返回选择植物'}
              </button>
              {activeGame === 'puzzle' && selectedPlant && <SlidingPuzzle plant={selectedPlant} onBack={() => setSelectedPlant(null)} />}
              {activeGame === 'poem' && selectedPlant && <PlantPoemGame plant={selectedPlant} onBack={() => setSelectedPlant(null)} />}
              {activeGame === 'match' && <MatchGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamesPage;
