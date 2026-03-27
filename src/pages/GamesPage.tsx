import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import { Puzzle, BookOpen, Palette, ArrowLeft, Lock, Unlock, Brain, Tags, Zap, Microscope } from 'lucide-react';
import SlidingPuzzle from '@/components/games/SlidingPuzzle';
import PlantPoemGame from '@/components/games/PlantPoemGame';
import MatchGame from '@/components/games/MatchGame';
import PlantQuizGame from '@/components/games/PlantQuizGame';
import PlantSortGame from '@/components/games/PlantSortGame';
import SpeedIdentifyGame from '@/components/games/SpeedIdentifyGame';
import SceneColoringGame from '@/components/games/SceneColoringGame';
import MorphologySortGame from '@/components/games/MorphologySortGame';

type GameType = 'puzzle' | 'poem' | 'match' | 'quiz' | 'sort' | 'speed' | 'coloring' | 'morphSort' | null;

const GamesPage = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const { getAllPlants, getSeed } = useSeedVerse();
  const allPlants = getAllPlants();

  const games = [
    { type: 'puzzle' as const, icon: Puzzle, name: '场景拼图', desc: '拼出植物场景图片，解锁新种子', color: 'bg-leaf-light text-leaf', needsPlant: true },
    { type: 'coloring' as const, icon: Palette, name: '场景绘图', desc: '给植物场景填上美丽的颜色', color: 'bg-sun-light text-sun', needsPlant: true },
    { type: 'poem' as const, icon: BookOpen, name: '诗词填空', desc: '针对每种植物进行诗词挑战', color: 'bg-petal-light text-petal', needsPlant: true },
    { type: 'quiz' as const, icon: Brain, name: '知识问答', desc: '回答植物知识问题，答对解锁种子', color: 'bg-sky-light text-sky', needsPlant: true },
    { type: 'match' as const, icon: Palette, name: '记忆配对', desc: '翻卡片找到对应的植物', color: 'bg-sun-light text-sun', needsPlant: false },
    { type: 'sort' as const, icon: Tags, name: '分类挑战', desc: '将植物放入正确的分类', color: 'bg-fruit-light text-fruit', needsPlant: false },
    { type: 'morphSort' as const, icon: Microscope, name: '形态分类', desc: '按根系/叶形/科属分类植物', color: 'bg-leaf-light text-leaf', needsPlant: false },
    { type: 'speed' as const, icon: Zap, name: '极速识别', desc: '限时识别植物，速度越快分数越高', color: 'bg-petal-light text-petal', needsPlant: false },
  ];

  const plantSelectGames: GameType[] = ['puzzle', 'poem', 'quiz', 'coloring'];

  const renderPlantSelect = (gameType: GameType) => (
    <motion.div key="plant-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <button onClick={() => setActiveGame(null)} className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
        <ArrowLeft size={14} /> 返回游戏列表
      </button>
      <h3 className="font-bold text-foreground mb-3">
        选择一个植物进行{gameType === 'puzzle' ? '拼图' : gameType === 'poem' ? '诗词' : gameType === 'coloring' ? '绘图' : '问答'}挑战
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
                  transition={{ delay: i * 0.08 }}
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
          ) : plantSelectGames.includes(activeGame) && !selectedPlant ? (
            renderPlantSelect(activeGame)
          ) : (
            <motion.div key={activeGame} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button
                onClick={() => {
                  setSelectedPlant(null);
                  if (!plantSelectGames.includes(activeGame)) setActiveGame(null);
                }}
                className="text-sm text-muted-foreground mb-3 flex items-center gap-1"
              >
                <ArrowLeft size={14} /> {plantSelectGames.includes(activeGame) ? '返回选择植物' : '返回游戏列表'}
              </button>
              {activeGame === 'puzzle' && selectedPlant && <SlidingPuzzle plant={selectedPlant} onBack={() => setSelectedPlant(null)} />}
              {activeGame === 'coloring' && selectedPlant && <SceneColoringGame plant={selectedPlant} onBack={() => setSelectedPlant(null)} />}
              {activeGame === 'poem' && selectedPlant && <PlantPoemGame plant={selectedPlant} onBack={() => setSelectedPlant(null)} />}
              {activeGame === 'quiz' && selectedPlant && <PlantQuizGame plant={selectedPlant} onBack={() => setSelectedPlant(null)} />}
              {activeGame === 'match' && <MatchGame />}
              {activeGame === 'sort' && <PlantSortGame />}
              {activeGame === 'morphSort' && <MorphologySortGame />}
              {activeGame === 'speed' && <SpeedIdentifyGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamesPage;
