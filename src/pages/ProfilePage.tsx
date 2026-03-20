import { motion } from 'framer-motion';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { achievements, plants } from '@/data/plants';
import { Trophy, BookOpen, Gamepad2, Sprout } from 'lucide-react';

const ProfilePage = () => {
  const { collectedSeeds, quizCount, gameCount } = useSeedVerse();

  const stats = [
    { icon: Sprout, label: '种子收集', value: collectedSeeds.length, color: 'text-leaf' },
    { icon: BookOpen, label: '问答完成', value: quizCount, color: 'text-sky' },
    { icon: Gamepad2, label: '游戏完成', value: gameCount, color: 'text-sun' },
  ];

  const checkAchievement = (a: typeof achievements[0]) => {
    switch (a.type) {
      case 'collect': return collectedSeeds.length >= a.requirement;
      case 'learn': return quizCount >= a.requirement;
      case 'game': return gameCount >= a.requirement;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-br from-petal-light to-sky-light pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <div className="w-20 h-20 rounded-full gradient-nature-bg flex items-center justify-center mx-auto mb-3 text-4xl">
          🧒
        </div>
        <h1 className="text-xl font-bold text-foreground">小小植物学家</h1>
        <p className="text-xs text-muted-foreground">探索植物世界的旅程才刚开始</p>
      </div>

      <div className="px-4 -mt-8 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map(s => (
            <div key={s.label} className="card-nature p-3 text-center">
              <s.icon size={20} className={`mx-auto ${s.color}`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[9px] text-muted-foreground font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="card-nature p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Trophy size={16} className="text-sun" /> 成就徽章
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map(a => {
              const unlocked = checkAchievement(a);
              return (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl p-3 text-center ${unlocked ? 'bg-sun-light' : 'bg-muted opacity-60'}`}
                >
                  <span className="text-2xl block">{unlocked ? a.emoji : '🔒'}</span>
                  <p className="text-xs font-bold text-foreground mt-1">{a.name}</p>
                  <p className="text-[9px] text-muted-foreground">{a.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Collection */}
        <div className="card-nature p-4 space-y-3">
          <h3 className="font-bold text-foreground">🌱 收集图鉴</h3>
          <div className="grid grid-cols-6 gap-2">
            {plants.map(p => {
              const collected = collectedSeeds.some(s => s.plantId === p.id);
              return (
                <div
                  key={p.id}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl ${
                    collected ? 'bg-leaf-light' : 'bg-muted'
                  }`}
                >
                  {collected ? p.emoji : '❓'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
