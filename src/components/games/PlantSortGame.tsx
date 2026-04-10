import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw, CheckCircle, Coins } from 'lucide-react';

const PlantSortGame = () => {
  const { getAllPlants, incrementGame, addPoints } = useSeedVerse();
  const allPlants = getAllPlants();

  const categories = useMemo(() => {
    const cats = [...new Set(allPlants.map(p => p.category))];
    return cats.slice(0, 4);
  }, [allPlants]);

  const [items] = useState(() =>
    allPlants.slice(0, 6).sort(() => Math.random() - 0.5)
  );
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const handleDrop = (plantId: string, category: string) => {
    setPlacements(prev => ({ ...prev, [plantId]: category }));
    setDragItem(null);
  };

  const checkAnswers = () => {
    setChecked(true);
    const allCorrect = items.every(p => placements[p.id] === p.category);
    if (allCorrect) {
      incrementGame();
      if (!rewarded) { addPoints(1); setRewarded(true); }
    }
  };

  const allCorrect = checked && items.every(p => placements[p.id] === p.category);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground text-center">🏷️ 分类挑战</h3>
      <p className="text-xs text-muted-foreground text-center">把植物拖入正确的分类中</p>

      {allCorrect && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="text-2xl">🎉</p>
          <p className="font-bold text-leaf">全部正确！</p>
          <p className="text-xs text-sun flex items-center justify-center gap-1"><Coins size={14} /> +1 积分</p>
        </motion.div>
      )}

      {/* Plants to sort */}
      <div className="flex flex-wrap gap-2 justify-center">
        {items.filter(p => !placements[p.id]).map(plant => (
          <motion.button key={plant.id} whileTap={{ scale: 0.9 }}
            onClick={() => setDragItem(dragItem === plant.id ? null : plant.id)}
            className={`card-nature px-3 py-2 flex items-center gap-1 text-xs ${dragItem === plant.id ? 'ring-2 ring-leaf' : ''}`}>
            <span>{plant.emoji}</span>
            <span className="font-bold text-foreground">{plant.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-2">
        {categories.map(cat => {
          const placed = items.filter(p => placements[p.id] === cat);
          return (
            <div key={cat}
              onClick={() => { if (dragItem) handleDrop(dragItem, cat); }}
              className={`card-nature p-3 min-h-[80px] ${dragItem ? 'border-2 border-dashed border-leaf cursor-pointer' : ''}`}>
              <p className="text-xs font-bold text-foreground mb-2">{cat}</p>
              <div className="flex flex-wrap gap-1">
                {placed.map(p => (
                  <span key={p.id} className={`text-xs px-1.5 py-0.5 rounded-full ${
                    checked ? (p.category === cat ? 'bg-leaf-light text-leaf' : 'bg-destructive/20 text-destructive') : 'bg-muted text-foreground'
                  }`}>
                    {p.emoji} {p.name}
                    {checked && p.category === cat && <CheckCircle size={10} className="inline ml-0.5" />}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-center">
        {!checked && Object.keys(placements).length === items.length && (
          <button onClick={checkAnswers} className="btn-nature text-sm">检查答案</button>
        )}
        <button onClick={() => window.location.reload()} className="text-xs text-muted-foreground flex items-center gap-1">
          <RotateCcw size={12} /> 重新开始
        </button>
      </div>
    </div>
  );
};

export default PlantSortGame;
