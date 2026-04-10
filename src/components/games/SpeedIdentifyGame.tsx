import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Timer, RotateCcw, Zap, Coins } from 'lucide-react';

const ROUND_TIME = 10; // seconds per round
const TOTAL_ROUNDS = 5;

const SpeedIdentifyGame = () => {
  const { getAllPlants, incrementGame, addPoints } = useSeedVerse();
  const allPlants = getAllPlants();

  const rounds = useMemo(() => {
    const shuffled = [...allPlants].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, TOTAL_ROUNDS).map(plant => {
      const others = allPlants.filter(p => p.id !== plant.id).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...others, plant].sort(() => Math.random() - 0.5);
      // Random clue type
      const clueTypes = ['emoji', 'description', 'scene'] as const;
      const clueType = clueTypes[Math.floor(Math.random() * clueTypes.length)];
      let clue = '';
      if (clueType === 'emoji') clue = plant.emoji;
      else if (clueType === 'description') clue = plant.features;
      else clue = plant.scene.name;
      return { plant, options, clue, clueType };
    });
  }, [allPlants]);

  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (finished || selected !== null) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // Time's up
          handleTimeout();
          return ROUND_TIME;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [round, finished, selected]);

  const handleTimeout = useCallback(() => {
    setStreak(0);
    nextRound();
  }, [round]);

  const nextRound = useCallback(() => {
    setTimeout(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        setFinished(true);
        incrementGame();
        addPoints(3);
      } else {
        setRound(r => r + 1);
        setSelected(null);
        setTimeLeft(ROUND_TIME);
      }
    }, 800);
  }, [round, incrementGame]);

  const handleSelect = (plantId: string) => {
    if (selected !== null) return;
    setSelected(plantId);
    const correct = plantId === rounds[round].plant.id;
    if (correct) {
      const bonus = Math.ceil(timeLeft / 2);
      setScore(s => s + 10 + bonus);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    nextRound();
  };

  const restart = () => {
    setRound(0);
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setStreak(0);
  };

  if (finished) {
    return (
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="card-nature p-6 text-center space-y-4">
        <span className="text-5xl block">⚡</span>
        <h3 className="font-bold text-lg text-foreground">挑战完成！</h3>
        <p className="text-3xl font-bold text-sun">{score} 分</p>
        <p className="text-xs text-sun flex items-center justify-center gap-1"><Coins size={14} /> +3 积分</p>
        <p className="text-xs text-muted-foreground">速度越快，得分越高</p>
        <button onClick={restart} className="btn-sun text-sm">
          <RotateCcw size={14} className="inline mr-1" /> 再来一局
        </button>
      </motion.div>
    );
  }

  const current = rounds[round];
  if (!current) return null;

  return (
    <div className="card-nature p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-foreground flex items-center gap-1">
          <Zap size={16} className="text-sun" /> 极速识别
        </h3>
        <div className="flex items-center gap-3">
          {streak >= 2 && <span className="text-[10px] bg-petal-light text-petal px-2 py-0.5 rounded-full font-bold">🔥{streak}连对</span>}
          <span className="text-xs font-bold bg-leaf-light text-leaf px-2 py-0.5 rounded-full">{score}分</span>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <Timer size={14} className={timeLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'} />
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${timeLeft <= 3 ? 'bg-destructive' : 'bg-leaf'}`}
            animate={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className={`text-xs font-bold ${timeLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'}`}>{timeLeft}s</span>
      </div>

      {/* Round indicator */}
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i < round ? 'bg-leaf' : i === round ? 'bg-sun' : 'bg-muted'}`} />
        ))}
      </div>

      {/* Clue */}
      <AnimatePresence mode="wait">
        <motion.div key={round} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-3 space-y-2">
          {current.clueType === 'emoji' ? (
            <>
              <span className="text-6xl block">{current.clue}</span>
              <p className="text-xs text-muted-foreground">这是什么植物？</p>
            </>
          ) : current.clueType === 'description' ? (
            <>
              <p className="text-sm font-bold text-foreground">"{current.clue}"</p>
              <p className="text-xs text-muted-foreground">这描述的是哪种植物？</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-foreground">🏞️ {current.clue}</p>
              <p className="text-xs text-muted-foreground">这个场景对应哪种植物？</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {current.options.map(opt => {
          let style = 'bg-muted/50';
          if (selected) {
            if (opt.id === current.plant.id) style = 'bg-leaf-light border-2 border-leaf';
            else if (opt.id === selected) style = 'bg-destructive/10 border-2 border-destructive';
          }
          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt.id)}
              className={`p-3 rounded-xl text-center ${style}`}
            >
              <span className="text-2xl block">{opt.emoji}</span>
              <span className="text-xs font-bold text-foreground">{opt.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SpeedIdentifyGame;
