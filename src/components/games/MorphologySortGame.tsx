import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { RotateCcw, CheckCircle, Coins } from 'lucide-react';

type SortMode = 'rootType' | 'leafShape' | 'family';

const modeLabels: Record<SortMode, { label: string; emoji: string }> = {
  rootType: { label: '根系分类', emoji: '🌱' },
  leafShape: { label: '叶形分类', emoji: '🍃' },
  family: { label: '科属分类', emoji: '🧬' },
};

const MorphologySortGame = () => {
  const { getAllPlants, incrementGame, addPoints } = useSeedVerse();
  const allPlants = getAllPlants();
  const [mode, setMode] = useState<SortMode>('rootType');
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  const { categories, items, getAnswer } = useMemo(() => {
    const getter = (p: any): string => {
      if (mode === 'rootType') return p.morphology?.rootType || '直根系';
      if (mode === 'leafShape') return p.morphology?.leafShape || '—';
      return p.family || '—';
    };
    const cats = [...new Set(allPlants.map(getter))].slice(0, 4);
    const plantItems = allPlants.filter(p => cats.includes(getter(p))).slice(0, 8).sort(() => Math.random() - 0.5);
    return { categories: cats, items: plantItems, getAnswer: getter };
  }, [allPlants, mode]);

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = items.every(p => placements[p.id] === getAnswer(p));
    if (allCorrect) {
      incrementGame();
      if (!rewarded) { addPoints(1); setRewarded(true); }
    }
  };

  const allCorrect = checked && items.every(p => placements[p.id] === getAnswer(p));

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground text-center">🔬 形态分类挑战</h3>
      <div className="flex gap-2 justify-center">
        {(Object.keys(modeLabels) as SortMode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setPlacements({}); setChecked(false); setRewarded(false); }}
            className={`text-xs px-3 py-1 rounded-full font-bold ${mode === m ? 'bg-leaf text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {modeLabels[m].emoji} {modeLabels[m].label}
          </button>
        ))}
      </div>

      {allCorrect && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="text-2xl">🎉</p>
          <p className="font-bold text-leaf">全部正确！</p>
          <p className="text-xs text-sun flex items-center justify-center gap-1"><Coins size={14} /> +1 积分</p>
        </motion.div>
      )}

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

      <div className="grid grid-cols-2 gap-2">
        {categories.map(cat => {
          const placed = items.filter(p => placements[p.id] === cat);
          return (
            <div key={cat}
              onClick={() => { if (dragItem) { setPlacements(prev => ({ ...prev, [dragItem]: cat })); setDragItem(null); } }}
              className={`card-nature p-3 min-h-[70px] ${dragItem ? 'border-2 border-dashed border-leaf cursor-pointer' : ''}`}>
              <p className="text-xs font-bold text-foreground mb-1">{cat}</p>
              <div className="flex flex-wrap gap-1">
                {placed.map(p => (
                  <span key={p.id} className={`text-[10px] px-1 py-0.5 rounded-full ${
                    checked ? (getAnswer(p) === cat ? 'bg-leaf-light text-leaf' : 'bg-destructive/20 text-destructive') : 'bg-muted text-foreground'
                  }`}>
                    {p.emoji} {p.name}
                    {checked && getAnswer(p) === cat && <CheckCircle size={8} className="inline ml-0.5" />}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-center">
        {!checked && Object.keys(placements).length === items.length && (
          <button onClick={handleCheck} className="btn-nature text-sm">检查答案</button>
        )}
        <button onClick={() => { setPlacements({}); setChecked(false); setRewarded(false); }}
          className="text-xs text-muted-foreground flex items-center gap-1">
          <RotateCcw size={12} /> 重新开始
        </button>
      </div>
    </div>
  );
};

export default MorphologySortGame;
