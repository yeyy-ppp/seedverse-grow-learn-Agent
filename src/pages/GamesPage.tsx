import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { plants, Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Puzzle, Palette, BookOpen, RotateCcw, Check, X } from 'lucide-react';

type GameType = 'puzzle' | 'poem' | 'match' | null;

const GamesPage = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const games = [
    { type: 'puzzle' as const, icon: Puzzle, name: '植物拼图', desc: '认识植物的各个部分', color: 'bg-leaf-light text-leaf' },
    { type: 'poem' as const, icon: BookOpen, name: '诗词填空', desc: '和植物有关的诗词', color: 'bg-petal-light text-petal' },
    { type: 'match' as const, icon: Palette, name: '配对游戏', desc: '找到对应的植物', color: 'bg-sun-light text-sun' },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-br from-sun-light to-petal-light pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <h1 className="text-2xl font-bold text-foreground mb-1">🎮 趣味游戏</h1>
        <p className="text-sm text-muted-foreground">边玩边学，探索植物奥秘</p>
      </div>

      <div className="px-4 -mt-8 space-y-4">
        <AnimatePresence mode="wait">
          {activeGame === null ? (
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
                  <div>
                    <h3 className="font-bold text-foreground">{g.name}</h3>
                    <p className="text-xs text-muted-foreground">{g.desc}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key={activeGame} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button onClick={() => setActiveGame(null)} className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                ← 返回游戏列表
              </button>
              {activeGame === 'puzzle' && <PuzzleGame />}
              {activeGame === 'poem' && <PoemGame />}
              {activeGame === 'match' && <MatchGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PuzzleGame = () => {
  const { incrementGame } = useSeedVerse();
  const parts = [
    { name: '根', emoji: '🌱', desc: '吸收水分和养分' },
    { name: '茎', emoji: '🪵', desc: '运输水分和养分' },
    { name: '叶', emoji: '🍃', desc: '进行光合作用' },
    { name: '花', emoji: '🌸', desc: '繁殖后代' },
    { name: '果实', emoji: '🍎', desc: '保护和传播种子' },
    { name: '种子', emoji: '🫘', desc: '长出新植物' },
  ];
  const [shuffled] = useState(() => [...parts].sort(() => Math.random() - 0.5));
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [selectedDesc, setSelectedDesc] = useState<number | null>(null);

  const checkMatch = useCallback((pIdx: number, dIdx: number) => {
    if (shuffled[dIdx].name === parts[pIdx].name) {
      setMatched(prev => new Set([...prev, pIdx]));
      if (matched.size + 1 === parts.length) incrementGame();
    }
    setTimeout(() => { setSelectedPart(null); setSelectedDesc(null); }, 500);
  }, [shuffled, matched, incrementGame]);

  return (
    <div className="card-nature p-4 space-y-4">
      <h3 className="font-bold text-foreground text-center">🧩 植物结构配对</h3>
      <p className="text-xs text-muted-foreground text-center">点击左边的部位，再点击右边对应的功能</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {parts.map((p, i) => (
            <button
              key={i}
              onClick={() => { setSelectedPart(i); if (selectedDesc !== null) checkMatch(i, selectedDesc); }}
              disabled={matched.has(i)}
              className={`w-full p-2 rounded-xl text-sm font-semibold transition-all ${
                matched.has(i) ? 'bg-leaf text-primary-foreground' :
                selectedPart === i ? 'bg-sky-light ring-2 ring-sky' : 'bg-muted text-foreground'
              }`}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {shuffled.map((p, i) => (
            <button
              key={i}
              onClick={() => { setSelectedDesc(i); if (selectedPart !== null) checkMatch(selectedPart, i); }}
              disabled={matched.has(parts.findIndex(pp => pp.name === p.name))}
              className={`w-full p-2 rounded-xl text-[11px] transition-all ${
                matched.has(parts.findIndex(pp => pp.name === p.name)) ? 'bg-leaf text-primary-foreground' :
                selectedDesc === i ? 'bg-sky-light ring-2 ring-sky' : 'bg-muted text-foreground'
              }`}
            >
              {p.desc}
            </button>
          ))}
        </div>
      </div>
      {matched.size === parts.length && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-2xl">
          🎉 全部配对成功！
        </motion.div>
      )}
    </div>
  );
};

const PoemGame = () => {
  const { incrementGame } = useSeedVerse();
  const poems = [
    { line: '接天莲叶无穷___', answer: '碧', options: ['碧', '绿', '蓝', '青'] },
    { line: '墙角数枝___', answer: '梅', options: ['梅', '竹', '松', '兰'] },
    { line: '惟有葵花向日___', answer: '倾', options: ['倾', '开', '笑', '转'] },
    { line: '大雪压青___', answer: '松', options: ['松', '竹', '梅', '柏'] },
  ];
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
  const { incrementGame } = useSeedVerse();
  const items = plants.slice(0, 4);
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
