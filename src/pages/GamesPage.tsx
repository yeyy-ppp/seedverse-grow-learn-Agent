import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import { Puzzle, BookOpen, Palette, RotateCcw, ArrowLeft, Lock, Unlock } from 'lucide-react';

type GameType = 'puzzle' | 'poem' | 'match' | null;

const GamesPage = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const { getAllPlants, getSeed, collectedSeeds } = useSeedVerse();
  const allPlants = getAllPlants();

  const games = [
    { type: 'puzzle' as const, icon: Puzzle, name: '场景拼图', desc: '拼出植物的生长场景，解锁新种子', color: 'bg-leaf-light text-leaf', needsPlant: true },
    { type: 'poem' as const, icon: BookOpen, name: '诗词填空', desc: '和植物有关的诗词', color: 'bg-petal-light text-petal', needsPlant: false },
    { type: 'match' as const, icon: Palette, name: '配对游戏', desc: '找到对应的植物', color: 'bg-sun-light text-sun', needsPlant: false },
  ];

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
                  onClick={() => {
                    if (g.needsPlant) {
                      setActiveGame(g.type);
                    } else {
                      setActiveGame(g.type);
                    }
                  }}
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
          ) : activeGame === 'puzzle' && !selectedPlant ? (
            <motion.div key="plant-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button onClick={() => setActiveGame(null)} className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                <ArrowLeft size={14} /> 返回游戏列表
              </button>
              <h3 className="font-bold text-foreground mb-3">选择一个植物进行拼图挑战</h3>
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
          ) : (
            <motion.div key={activeGame} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button
                onClick={() => { setSelectedPlant(null); if (activeGame === 'puzzle') setActiveGame('puzzle'); else setActiveGame(null); }}
                className="text-sm text-muted-foreground mb-3 flex items-center gap-1"
              >
                <ArrowLeft size={14} /> {activeGame === 'puzzle' ? '返回选择植物' : '返回游戏列表'}
              </button>
              {activeGame === 'puzzle' && selectedPlant && <ScenePuzzleGame plant={selectedPlant} onBack={() => setSelectedPlant(null)} />}
              {activeGame === 'poem' && <PoemGame />}
              {activeGame === 'match' && <MatchGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Scene Puzzle Game - split scene description into pieces to reassemble
const ScenePuzzleGame = ({ plant, onBack }: { plant: Plant; onBack: () => void }) => {
  const { collectSeed, incrementGame, getSeed } = useSeedVerse();
  const alreadyCollected = !!getSeed(plant.id);

  // Split scene description into puzzle pieces (sentences)
  const pieces = useMemo(() => {
    const desc = plant.scene.description;
    const sentences = desc.match(/[^。！？]+[。！？]/g) || [desc];
    return sentences.map((s, i) => ({ id: i, text: s.trim() }));
  }, [plant]);

  const [shuffled] = useState(() => [...pieces].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const handlePieceTap = (pieceId: number) => {
    if (placed.includes(pieceId) || completed) return;
    const nextExpected = pieces[placed.length]?.id;
    if (pieceId === nextExpected) {
      const newPlaced = [...placed, pieceId];
      setPlaced(newPlaced);
      if (newPlaced.length === pieces.length) {
        setCompleted(true);
        incrementGame();
        if (!alreadyCollected) {
          collectSeed(plant.id);
        }
      }
    }
  };

  return (
    <div className="card-nature p-4 space-y-4">
      <div className="text-center">
        <span className="text-4xl">{plant.emoji}</span>
        <h3 className="font-bold text-foreground mt-1">{plant.scene.name} · 场景拼图</h3>
        <p className="text-[10px] text-muted-foreground">按正确顺序点击句子，还原场景描述</p>
      </div>

      {/* Assembled area */}
      <div className="bg-muted rounded-xl p-3 min-h-[80px]">
        {placed.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">点击下方句子，按顺序拼出完整场景</p>
        ) : (
          <p className="text-xs text-foreground leading-relaxed">
            {placed.map(id => pieces.find(p => p.id === id)?.text).join('')}
          </p>
        )}
      </div>

      {/* Puzzle pieces */}
      {!completed && (
        <div className="space-y-2">
          {shuffled.map(piece => {
            const isPlaced = placed.includes(piece.id);
            const isNext = pieces[placed.length]?.id === piece.id;
            return (
              <motion.button
                key={piece.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePieceTap(piece.id)}
                disabled={isPlaced}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all ${
                  isPlaced
                    ? 'bg-leaf/20 text-leaf line-through opacity-50'
                    : 'bg-background border border-border text-foreground hover:border-leaf'
                }`}
              >
                {piece.text}
              </motion.button>
            );
          })}
        </div>
      )}

      {completed && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-3">
          <p className="text-3xl">🎉</p>
          <p className="font-bold text-foreground">拼图完成！</p>
          {!alreadyCollected && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-leaf font-bold"
            >
              🌱 解锁了新种子：{plant.name}！
            </motion.p>
          )}
          <button onClick={onBack} className="btn-sun text-sm">
            <RotateCcw size={14} className="inline mr-1" /> 继续挑战
          </button>
        </motion.div>
      )}
    </div>
  );
};

const PoemGame = () => {
  const { incrementGame, getAllPlants } = useSeedVerse();
  const allPlants = getAllPlants();

  const poems = useMemo(() => {
    const defaultPoems = [
      { line: '接天莲叶无穷___', answer: '碧', options: ['碧', '绿', '蓝', '青'] },
      { line: '墙角数枝___', answer: '梅', options: ['梅', '竹', '松', '兰'] },
      { line: '惟有葵花向日___', answer: '倾', options: ['倾', '开', '笑', '转'] },
      { line: '大雪压青___', answer: '松', options: ['松', '竹', '梅', '柏'] },
    ];
    return defaultPoems;
  }, [allPlants]);

  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const handleAnswer = (opt: string) => {
    const correct = opt === poems[current].answer;
    setAnswered(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current < poems.length - 1) {
        setCurrent(c => c + 1);
        setAnswered(null);
      } else {
        incrementGame();
      }
    }, 1000);
  };

  const done = current === poems.length - 1 && answered !== null;

  return (
    <div className="card-nature p-4 space-y-4">
      <h3 className="font-bold text-foreground text-center">📝 诗词填空</h3>
      <div className="text-center">
        <span className="text-xs text-muted-foreground">{current + 1} / {poems.length}</span>
        <p className="text-xl font-display mt-2 text-foreground">{poems[current].line}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {poems[current].options.map(opt => (
          <button
            key={opt}
            onClick={() => answered === null && handleAnswer(opt)}
            disabled={answered !== null}
            className={`p-3 rounded-xl text-lg font-display transition-all ${
              answered === null ? 'bg-muted hover:bg-petal-light text-foreground' :
              opt === poems[current].answer ? 'bg-leaf text-primary-foreground' :
              'bg-muted text-muted-foreground'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {answered !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center text-sm font-bold ${answered ? 'text-leaf' : 'text-destructive'}`}>
          {answered ? '🎉 答对啦！' : `正确答案是「${poems[current].answer}」`}
        </motion.p>
      )}
      {done && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-2">
          <p className="text-2xl">🏆</p>
          <p className="font-bold text-foreground">得分：{score} / {poems.length}</p>
          <button onClick={() => { setCurrent(0); setAnswered(null); setScore(0); }} className="btn-sun text-sm">
            <RotateCcw size={14} className="inline mr-1" /> 再玩一次
          </button>
        </motion.div>
      )}
    </div>
  );
};

const MatchGame = () => {
  const { incrementGame, getAllPlants } = useSeedVerse();
  const allPlants = getAllPlants();
  const items = allPlants.slice(0, 4);
  const [cards] = useState(() => {
    const pairs = items.flatMap(p => [
      { id: p.id + '-emoji', plantId: p.id, display: p.emoji, type: 'emoji' },
      { id: p.id + '-name', plantId: p.id, display: p.name, type: 'name' },
    ]);
    return pairs.sort(() => Math.random() - 0.5);
  });
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());

  const handleFlip = (id: string) => {
    if (flipped.length >= 2 || flipped.includes(id) || matched.has(id)) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      const [a, b] = next.map(fid => cards.find(c => c.id === fid)!);
      if (a.plantId === b.plantId) {
        setMatched(prev => new Set([...prev, a.id, b.id]));
        if (matched.size + 2 === cards.length) incrementGame();
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  return (
    <div className="card-nature p-4 space-y-4">
      <h3 className="font-bold text-foreground text-center">🎴 记忆配对</h3>
      <p className="text-xs text-muted-foreground text-center">翻开卡片，找到对应的植物和名字</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.has(card.id);
          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl flex items-center justify-center font-bold transition-all ${
                matched.has(card.id) ? 'bg-leaf text-primary-foreground' :
                isFlipped ? 'bg-sky-light text-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {isFlipped ? (
                <span className={card.type === 'emoji' ? 'text-2xl' : 'text-[10px]'}>{card.display}</span>
              ) : '?'}
            </motion.button>
          );
        })}
      </div>
      {matched.size === cards.length && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="text-2xl">🎉 全部找到！</p>
          <button
            onClick={() => { setFlipped([]); setMatched(new Set()); }}
            className="btn-sun text-sm mt-2"
          >
            <RotateCcw size={14} className="inline mr-1" /> 再来一局
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default GamesPage;
