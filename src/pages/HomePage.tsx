import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Sprout, BookOpen, Gamepad2, Sparkles } from 'lucide-react';
import { useSeedVerse } from '@/contexts/SeedVerseContext';

const features = [
  { icon: Camera, label: '拍照识花', desc: '拍一拍，认识新植物', path: '/identify', color: 'bg-sky-light text-sky' },
  { icon: Sprout, label: '成长花园', desc: '培育你的植物', path: '/garden', color: 'bg-leaf-light text-leaf' },
  { icon: BookOpen, label: '知识探索', desc: '听故事，学知识', path: '/knowledge', color: 'bg-sun-light text-sun' },
  { icon: Gamepad2, label: '趣味游戏', desc: '边玩边学', path: '/games', color: 'bg-petal-light text-petal' },
];

const HomePage = () => {
  const { collectedSeeds, getAllPlants } = useSeedVerse();
  const allPlants = getAllPlants();

  const stats = [
    { value: collectedSeeds.length, label: '种子收集', color: 'text-leaf', filter: 'collected' },
    { value: allPlants.length, label: '图鉴总数', color: 'text-sun', filter: 'total' },
    { value: allPlants.length - collectedSeeds.length, label: '等待探索', color: 'text-petal', filter: 'undiscovered' },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="gradient-sky-bg pt-12 pb-16 px-6 rounded-b-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {['🌿', '🌸', '🍃', '🌻', '🦋', '🐝'].map((e, i) => (
            <span key={i} className="absolute animate-float text-3xl" style={{
              left: `${(i * 17 + 5) % 90}%`,
              top: `${(i * 23 + 10) % 80}%`,
              animationDelay: `${i * 0.5}s`,
            }}>{e}</span>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center">
          <h1 className="text-4xl font-display text-foreground mb-2">🌱 SeedVerse</h1>
          <p className="text-foreground/70 font-semibold text-sm">种子宇宙 · 探索奇妙植物世界</p>
          <div className="flex justify-center gap-6 mt-6">
            {stats.map(s => (
              <Link
                key={s.filter}
                to={`/atlas?filter=${s.filter}`}
                className="glass-card px-4 py-2 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-4 -mt-8 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={f.path} className="card-nature p-4 flex flex-col items-center gap-2 block">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.color}`}>
                  <f.icon size={24} />
                </div>
                <h3 className="font-bold text-sm text-foreground">{f.label}</h3>
                <p className="text-[10px] text-muted-foreground">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent collections */}
        <div>
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-sun" /> {collectedSeeds.length > 0 ? '最近收集' : '热门植物'}
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {(collectedSeeds.length > 0
              ? collectedSeeds.slice(-4).reverse().map(s => allPlants.find(p => p.id === s.plantId)).filter(Boolean)
              : allPlants.slice(0, 4)
            ).map((plant, i) => plant && (
              <motion.div key={plant.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/plant/${plant.id}`} className="card-nature p-3 flex flex-col items-center gap-1 min-w-[100px]">
                  <span className="text-4xl">{plant.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{plant.name}</span>
                  <span className="text-[9px] text-muted-foreground">{plant.category}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="card-nature p-5 bg-gradient-to-br from-sun-light to-petal-light">
          <h3 className="font-bold text-sm text-foreground mb-1">🌟 每日小知识</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            你知道吗？世界上最大的花是大王花，直径可达1米！它闻起来像腐肉，用气味吸引苍蝇来帮忙传粉。大自然真是充满奇妙的智慧！
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
