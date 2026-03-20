import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Search, ArrowLeft } from 'lucide-react';
import { plants, Plant } from '@/data/plants';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Link } from 'react-router-dom';

const IdentifyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [identified, setIdentified] = useState<Plant | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const { collectSeed, getSeed } = useSeedVerse();

  const filteredPlants = plants.filter(p =>
    p.name.includes(searchQuery) || p.category.includes(searchQuery)
  );

  const handleIdentify = (plant: Plant) => {
    setIdentified(plant);
    collectSeed(plant.id);
  };

  if (identified) {
    return (
      <div className="min-h-screen pb-24">
        <div className="gradient-nature-bg pt-10 pb-14 px-4 rounded-b-[3rem]">
          <button onClick={() => setIdentified(null)} className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-4">
            <ArrowLeft size={16} /> 返回
          </button>
          <div className="text-center">
            <span className="text-7xl block mb-3 animate-float">{identified.emoji}</span>
            <h1 className="text-3xl font-bold text-primary-foreground">{identified.name}</h1>
            <p className="text-primary-foreground/70 italic text-sm">{identified.scientificName}</p>
          </div>
        </div>
        <div className="px-4 -mt-8 space-y-4">
          {/* Info card */}
          <div className="card-nature p-4 space-y-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">📋 基本信息</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-leaf-light rounded-xl p-2"><span className="font-bold text-leaf">分类：</span>{identified.category}</div>
              <div className="bg-sky-light rounded-xl p-2"><span className="font-bold text-sky">科属：</span>{identified.family}</div>
            </div>
            <div className="bg-sun-light rounded-xl p-3 text-xs">
              <span className="font-bold text-secondary-foreground">🌍 生长环境：</span>
              <span className="text-muted-foreground">{identified.environment}</span>
            </div>
            <div className="bg-petal-light rounded-xl p-3 text-xs">
              <span className="font-bold text-petal">✨ 特征：</span>
              <span className="text-muted-foreground">{identified.features}</span>
            </div>
          </div>

          {/* Story */}
          <div className="card-nature p-4 space-y-2">
            <h3 className="font-bold text-foreground">📖 趣味故事</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{identified.story}</p>
          </div>

          {/* Knowledge */}
          <div className="card-nature p-4 space-y-2">
            <h3 className="font-bold text-foreground">🔬 知识讲解</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{identified.knowledge}</p>
          </div>

          {/* Poem */}
          <div className="card-nature p-4 space-y-2 bg-gradient-to-br from-petal-light to-sky-light">
            <h3 className="font-bold text-foreground">🎋 诗词典故</h3>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-display text-base">{identified.poem}</p>
          </div>

          {/* Scene */}
          <div className="card-nature p-4 space-y-2">
            <h3 className="font-bold text-foreground">🏞️ 情境故事 · {identified.scene.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{identified.scene.description}</p>
          </div>

          {/* Quiz */}
          <div className="card-nature p-4 space-y-3">
            <h3 className="font-bold text-foreground">❓ 互动问答</h3>
            {identified.quiz.map((q, i) => (
              <QuizItem key={i} quiz={q} />
            ))}
          </div>

          <div className="text-center pb-4">
            <Link to={`/plant/${identified.id}`} className="btn-nature inline-block text-sm">
              🌱 查看生命周期
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="gradient-sky-bg pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">🔍 植物识别</h1>
        <p className="text-sm text-foreground/60">拍照或搜索，认识新植物</p>

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => {
              setShowCamera(true);
              setTimeout(() => {
                const random = plants[Math.floor(Math.random() * plants.length)];
                handleIdentify(random);
                setShowCamera(false);
              }, 1500);
            }}
            className="btn-nature text-sm flex items-center gap-2"
          >
            <Camera size={16} /> 拍照识别
          </button>
          <button
            onClick={() => {
              const random = plants[Math.floor(Math.random() * plants.length)];
              handleIdentify(random);
            }}
            className="btn-sun text-sm flex items-center gap-2"
          >
            <Upload size={16} /> 上传图片
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Search */}
        <div className="glass-card p-3 flex items-center gap-2">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索植物名称..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm text-foreground w-full placeholder:text-muted-foreground"
          />
        </div>

        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-nature p-8 text-center"
          >
            <div className="text-4xl animate-wiggle mb-3">📷</div>
            <p className="text-sm text-muted-foreground">正在识别中...</p>
          </motion.div>
        )}

        {/* Plant grid */}
        <div className="grid grid-cols-3 gap-2">
          {filteredPlants.map(plant => (
            <motion.button
              key={plant.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleIdentify(plant)}
              className="card-nature p-3 flex flex-col items-center gap-1"
            >
              <span className="text-3xl">{plant.emoji}</span>
              <span className="text-xs font-bold text-foreground">{plant.name}</span>
              {getSeed(plant.id) && <span className="text-[8px] text-leaf font-bold">✓ 已收集</span>}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizItem = ({ quiz }: { quiz: { question: string; options: string[]; answer: number } }) => {
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

export default IdentifyPage;
