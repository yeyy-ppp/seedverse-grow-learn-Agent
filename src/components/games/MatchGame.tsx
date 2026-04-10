import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw, Coins } from 'lucide-react';

const MatchGame = () => {
  const { incrementGame, getAllPlants, addPoints } = useSeedVerse();
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
  const [rewarded, setRewarded] = useState(false);

  const handleFlip = (id: string) => {
    if (flipped.length >= 2 || flipped.includes(id) || matched.has(id)) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      const [a, b] = next.map(fid => cards.find(c => c.id === fid)!);
      if (a.plantId === b.plantId) {
        const newMatched = new Set([...matched, a.id, b.id]);
        setMatched(newMatched);
        if (newMatched.size === cards.length) {
          incrementGame();
          if (!rewarded) { addPoints(1); setRewarded(true); }
        }
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  const isComplete = matched.size === cards.length;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground text-center">🃏 记忆配对</h3>
      {isComplete && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-1">
          <p className="text-2xl">🎉</p>
          <p className="font-bold text-leaf">全部配对成功！</p>
          <p className="text-xs text-sun flex items-center justify-center gap-1"><Coins size={14} /> +1 积分</p>
        </motion.div>
      )}
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.has(card.id);
          return (
            <motion.button key={card.id} whileTap={{ scale: 0.9 }} onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                isFlipped ? 'bg-leaf-light text-foreground' : 'bg-muted text-muted-foreground'
              } ${matched.has(card.id) ? 'opacity-60' : ''}`}>
              {isFlipped ? card.display : '?'}
            </motion.button>
          );
        })}
      </div>
      <button onClick={() => window.location.reload()} className="text-xs text-muted-foreground flex items-center gap-1 mx-auto">
        <RotateCcw size={12} /> 重新开始
      </button>
    </div>
  );
};

export default MatchGame;
