import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw } from 'lucide-react';

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

export default MatchGame;
