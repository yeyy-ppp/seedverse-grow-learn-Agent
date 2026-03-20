import { useState } from 'react';
import { useSeedVerse } from '@/contexts/SeedVerseContext';

interface Props {
  quiz: { question: string; options: string[]; answer: number };
}

const QuizItem = ({ quiz }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const { incrementQuiz } = useSeedVerse();

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-foreground">{quiz.question}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {quiz.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); if (i === quiz.answer) incrementQuiz(); }}
            disabled={selected !== null}
            className={`text-xs p-2 rounded-xl font-semibold transition-all ${
              selected === null
                ? 'bg-muted text-foreground hover:bg-leaf-light'
                : i === quiz.answer
                  ? 'bg-leaf text-primary-foreground'
                  : i === selected
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-muted text-muted-foreground'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className={`text-[10px] font-bold ${selected === quiz.answer ? 'text-leaf' : 'text-destructive'}`}>
          {selected === quiz.answer ? '🎉 回答正确！' : `❌ 正确答案是：${quiz.options[quiz.answer]}`}
        </p>
      )}
    </div>
  );
};

export default QuizItem;
