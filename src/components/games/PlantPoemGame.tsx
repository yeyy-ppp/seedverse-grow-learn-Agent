import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Coins } from 'lucide-react';
import { RotateCcw } from 'lucide-react';

interface Props {
  plant: Plant;
  onBack: () => void;
}

// Extract fill-in-the-blank from poem text
const generatePoemQuestions = (plant: Plant) => {
  const poem = plant.poem;
  // Try to extract individual lines from the poem
  const lines = poem.split(/[。！？\n]/).filter(l => l.trim().length > 4);

  if (lines.length === 0) return [];

  return lines.slice(0, 3).map(line => {
    const trimmed = line.trim().replace(/^[——、·\s]+/, '');
    if (trimmed.length < 2) return null;
    // Pick a random character to blank out (avoid first/last)
    const chars = [...trimmed];
    const blankIdx = 1 + Math.floor(Math.random() * Math.max(1, chars.length - 2));
    const answer = chars[blankIdx];
    const display = chars.map((c, i) => i === blankIdx ? '___' : c).join('');

    // Generate wrong options
    const pool = '花草木叶风雪月水云山鸟虫春夏秋冬红绿蓝紫白青黄金银碧翠香甜苦酸'.split('');
    const wrongSet = new Set<string>();
    while (wrongSet.size < 3) {
      const r = pool[Math.floor(Math.random() * pool.length)];
      if (r !== answer) wrongSet.add(r);
    }
    const options = [answer, ...wrongSet].sort(() => Math.random() - 0.5);

    return { line: display, answer, options };
  }).filter(Boolean) as { line: string; answer: string; options: string[] }[];
};

const PlantPoemGame = ({ plant, onBack }: Props) => {
  const { incrementGame, collectSeed, getSeed, addPoints } = useSeedVerse();
  const alreadyCollected = !!getSeed(plant.id);

  const questions = useMemo(() => generatePoemQuestions(plant), [plant]);

  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="card-nature p-4 text-center space-y-3">
        <span className="text-4xl">{plant.emoji}</span>
        <p className="text-sm text-muted-foreground">该植物暂无诗词填空内容</p>
        <button onClick={onBack} className="btn-sun text-sm">返回</button>
      </div>
    );
  }

  const handleAnswer = (opt: string) => {
    if (answered !== null) return;
    const correct = opt === questions[current].answer;
    setAnswered(correct);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setAnswered(null);
      } else {
        setDone(true);
        incrementGame();
        addPoints(2);
        if (!alreadyCollected) collectSeed(plant.id);
      }
    }, 1000);
  };

  return (
    <div className="card-nature p-4 space-y-4">
      <div className="text-center">
        <span className="text-4xl">{plant.emoji}</span>
        <h3 className="font-bold text-foreground mt-1">{plant.name} · 诗词填空</h3>
        <p className="text-[10px] text-muted-foreground">填出缺失的字</p>
      </div>

      {!done ? (
        <>
          <div className="text-center">
            <span className="text-xs text-muted-foreground">{current + 1} / {questions.length}</span>
            <p className="text-xl font-display mt-2 text-foreground">{questions[current].line}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {questions[current].options.map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={answered !== null}
                className={`p-3 rounded-xl text-lg font-display transition-all ${
                  answered === null ? 'bg-muted hover:bg-petal-light text-foreground' :
                  opt === questions[current].answer ? 'bg-leaf text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {answered !== null && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center text-sm font-bold ${answered ? 'text-leaf' : 'text-destructive'}`}>
              {answered ? '🎉 答对啦！' : `正确答案是「${questions[current].answer}」`}
            </motion.p>
          )}
        </>
      ) : (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-3">
          <p className="text-3xl">🏆</p>
          <p className="font-bold text-foreground">得分：{score} / {questions.length}</p>
          <p className="text-xs text-sun flex items-center justify-center gap-1"><Coins size={14} /> +2 积分</p>
          {!alreadyCollected && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-leaf font-bold">
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

export default PlantPoemGame;
