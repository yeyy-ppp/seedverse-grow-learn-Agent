import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw, CheckCircle } from 'lucide-react';

const PlantSortGame = () => {
  const { getAllPlants, incrementGame } = useSeedVerse();
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

  const handleDrop = (plantId: string, category: string) => {
    setPlacements(prev => ({ ...prev, [plantId]: category }));
    setDragItem(null);
  };

  const checkAnswers = () => {
    setChecked(true);
    const allCorrect = items.every(p => placements[p.id] === p.category);
    if (allCorrect) incrementGame();
  };

  const restart = () => {
    setPlacements({});
    setChecked(false);
  };

  const unplaced = items.filter(p => !placements[p.id]);
  const correctCount = items.filter(p => placements[p.id] === p.category).length;

  return (
    <div className="card-nature p-4 space-y-4">
      <h3 className="font-bold text-foreground text-center">🏷️ 植物分类挑战</h3>
      <p className="text-xs text-muted-foreground text-center">将植物拖放到正确的分类中</p>

      {/* Unplaced items */}
      <div className="flex flex-wrap gap-2 justify-center min-h-[40px]">
        {unplaced.map(plant => (
          <motion.button
            key={plant.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDragItem(dragItem === plant.id ? null : plant.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
              dragItem === plant.id ? 'bg-sun ring-2 ring-sun/50 text-secondary-foreground' : 'bg-leaf-light text-foreground'
            }`}
          >
            <span>{plant.emoji}</span> {plant.name}
          </motion.button>
        ))}
      </div>

      {/* Category bins */}
      <div className="grid grid-cols-2 gap-2">
        {categories.map(cat => {
          const placed = items.filter(p => placements[p.id] === cat);
          return (
            <motion.div
              key={cat}
              onClick={() => {
                if (dragItem && !checked) handleDrop(dragItem, cat);
              }}
              className={`rounded-xl border-2 border-dashed p-2 min-h-[80px] ${
                dragItem ? 'border-sun bg-sun-light/30 cursor-pointer' : 'border-border'
              }`}
            >
              <p className="text-[10px] font-bold text-muted-foreground text-center mb-1">{cat}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {placed.map(plant => (
                  <span
                    key={plant.id}
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      checked
                        ? plant.category === cat
                          ? 'bg-leaf-light text-leaf'
                          : 'bg-destructive/10 text-destructive line-through'
                        : 'bg-sky-light text-foreground'
                    }`}
                  >
                    {plant.emoji} {plant.name}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      {!checked ? (
        <button
          onClick={checkAnswers}
          disabled={Object.keys(placements).length < items.length}
          className={`w-full btn-nature text-sm ${Object.keys(placements).length < items.length ? 'opacity-50' : ''}`}
        >
          ✅ 检查答案
        </button>
      ) : (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={20} className="text-leaf" />
            <span className="font-bold text-foreground">{correctCount}/{items.length} 正确</span>
          </div>
          {correctCount === items.length && <p className="text-2xl">🎉 全对！太厉害了！</p>}
          <button onClick={restart} className="btn-sun text-sm">
            <RotateCcw size={14} className="inline mr-1" /> 再来一局
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PlantSortGame;
