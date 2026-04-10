import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import { CheckCircle, XCircle, RotateCcw, Coins } from 'lucide-react';

interface Props {
  plant: Plant;
  onBack: () => void;
}

const PlantQuizGame = ({ plant, onBack }: Props) => {
  const { incrementQuiz, collectSeed, getSeed, addPoints } = useSeedVerse();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const quiz = plant.quiz;
  const q = quiz[currentQ];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.answer;
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQ + 1 < quiz.length) {
        setCurrentQ(c => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
        incrementQuiz();
        addPoints(2);
        if (!getSeed(plant.id) && score + (correct ? 1 : 0) >= Math.ceil(quiz.length * 0.6)) {
          collectSeed(plant.id);
        }
      }
    }, 1200);
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const passed = score >= Math.ceil(quiz.length * 0.6);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-nature p-6 text-center space-y-4">
        <span className="text-5xl block">{passed ? '🎉' : '😅'}</span>
        <h3 className="font-bold text-lg text-foreground">
          {passed ? '太棒了！' : '再试一次吧！'}
        </h3>
        <p className="text-sm text-muted-foreground">
          答对 <span className="font-bold text-leaf">{score}</span> / {quiz.length} 题
        </p>
        <p className="text-xs text-sun flex items-center justify-center gap-1"><Coins size={14} /> +2 积分</p>
        {passed && !getSeed(plant.id) && (
          <div className="bg-leaf-light rounded-xl p-3">
            <p className="text-xs font-bold text-leaf">🌱 恭喜！已解锁{plant.name}种子！</p>
          </div>
        )}
        <div className="flex gap-2 justify-center">
          <button onClick={restart} className="btn-sun text-sm">
            <RotateCcw size={14} className="inline mr-1" /> 再来一次
          </button>
          <button onClick={onBack} className="btn-nature text-sm">返回</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="card-nature p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-foreground">{plant.emoji} {plant.name}问答</h3>
        <span className="text-xs bg-leaf-light text-leaf px-2 py-0.5 rounded-full font-bold">
          {currentQ + 1}/{quiz.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        {quiz.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i < currentQ ? 'bg-leaf' : i === currentQ ? 'bg-sun' : 'bg-muted'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <p className="font-bold text-foreground text-sm mb-3">❓ {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let style = 'bg-muted/50';
              if (selected !== null) {
                if (i === q.answer) style = 'bg-leaf-light border-2 border-leaf';
                else if (i === selected) style = 'bg-destructive/10 border-2 border-destructive';
              }
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-3 rounded-xl text-sm font-semibold text-foreground flex items-center gap-2 transition-all ${style}`}
                >
                  <span className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {selected !== null && i === q.answer && <CheckCircle size={16} className="ml-auto text-leaf" />}
                  {selected !== null && i === selected && i !== q.answer && <XCircle size={16} className="ml-auto text-destructive" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PlantQuizGame;
