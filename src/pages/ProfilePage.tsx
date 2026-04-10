import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { useAuth } from '@/contexts/AuthContext';
import { achievements, Plant } from '@/data/plants';
import { Trophy, BookOpen, Gamepad2, Sprout, ArrowLeft, ChevronRight, LogOut, LogIn, Coins } from 'lucide-react';
import PlantDetailView from '@/components/identify/PlantDetailView';

type ReviewMode = null | 'seeds' | 'quiz' | 'games';

const ProfilePage = () => {
  const { collectedSeeds, quizCount, gameCount, getAllPlants, getSeed, getPlantById, points, collectedCards } = useSeedVerse();
  const { user, profile, signOut, loading } = useAuth();
  const allPlants = getAllPlants();
  const navigate = useNavigate();
  const [reviewMode, setReviewMode] = useState<ReviewMode>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const stats = [
    { icon: Sprout, label: '种子收集', value: collectedSeeds.length, color: 'text-leaf', mode: 'seeds' as const },
    { icon: BookOpen, label: '问答完成', value: quizCount, color: 'text-sky', mode: 'quiz' as const },
    { icon: Gamepad2, label: '游戏完成', value: gameCount, color: 'text-sun', mode: 'games' as const },
  ];

  const checkAchievement = (a: typeof achievements[0]) => {
    switch (a.type) {
      case 'collect': return collectedSeeds.length >= a.requirement;
      case 'learn': return quizCount >= a.requirement;
      case 'game': return gameCount >= a.requirement;
    }
  };

  if (selectedPlant) {
    return <PlantDetailView plant={selectedPlant} onBack={() => setSelectedPlant(null)} />;
  }

  if (reviewMode === 'seeds') {
    const collectedPlants = collectedSeeds.map(s => getPlantById(s.plantId)).filter(Boolean);
    return (
      <div className="min-h-screen pb-24">
        <div className="bg-gradient-to-br from-leaf-light to-sky-light pt-10 pb-14 px-4 rounded-b-[3rem]">
          <button onClick={() => setReviewMode(null)} className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
            <ArrowLeft size={16} /> 返回
          </button>
          <h1 className="text-2xl font-bold text-foreground text-center">🌱 种子收集</h1>
          <p className="text-sm text-muted-foreground text-center">已收集 {collectedSeeds.length} 颗种子</p>
        </div>
        <div className="px-4 -mt-6 space-y-3">
          {collectedPlants.map(plant => plant && (
            <motion.div key={plant.id} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPlant(plant as Plant)}
              className="card-nature p-4 flex items-center gap-3 cursor-pointer">
              <span className="text-3xl">{plant.emoji}</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-sm">{plant.name}</h3>
                <p className="text-[10px] text-muted-foreground">{plant.category} · {plant.family}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </motion.div>
          ))}
          {collectedSeeds.length === 0 && (
            <div className="card-nature p-8 text-center">
              <p className="text-sm text-muted-foreground">还没有收集到种子，去识别或游戏中获取吧！</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (reviewMode === 'quiz') {
    const collectedPlants = collectedSeeds.map(s => getPlantById(s.plantId)).filter(Boolean);
    return (
      <div className="min-h-screen pb-24">
        <div className="bg-gradient-to-br from-sky-light to-petal-light pt-10 pb-14 px-4 rounded-b-[3rem]">
          <button onClick={() => setReviewMode(null)} className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
            <ArrowLeft size={16} /> 返回
          </button>
          <h1 className="text-2xl font-bold text-foreground text-center">📝 问答回顾</h1>
          <p className="text-sm text-muted-foreground text-center">已完成 {quizCount} 次问答</p>
        </div>
        <div className="px-4 -mt-6 space-y-3">
          <p className="text-xs text-muted-foreground">点击植物可进入查看问答内容：</p>
          {collectedPlants.map(plant => plant && (
            <motion.div key={plant.id} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPlant(plant as Plant)}
              className="card-nature p-4 flex items-center gap-3 cursor-pointer">
              <span className="text-3xl">{plant.emoji}</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-sm">{plant.name}</h3>
                <p className="text-[10px] text-muted-foreground">{plant.quiz.length} 道问答题</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </motion.div>
          ))}
          {collectedSeeds.length === 0 && (
            <div className="card-nature p-8 text-center">
              <p className="text-sm text-muted-foreground">还没有完成任何问答</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (reviewMode === 'games') {
    return (
      <div className="min-h-screen pb-24">
        <div className="bg-gradient-to-br from-sun-light to-petal-light pt-10 pb-14 px-4 rounded-b-[3rem]">
          <button onClick={() => setReviewMode(null)} className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
            <ArrowLeft size={16} /> 返回
          </button>
          <h1 className="text-2xl font-bold text-foreground text-center">🎮 游戏记录</h1>
          <p className="text-sm text-muted-foreground text-center">已完成 {gameCount} 个游戏</p>
        </div>
        <div className="px-4 -mt-6 space-y-3">
          <div className="card-nature p-4 text-center space-y-3">
            <p className="text-4xl">🏆</p>
            <p className="text-2xl font-bold text-sun">{gameCount}</p>
            <p className="text-sm text-muted-foreground">累计完成游戏次数</p>
            <button onClick={() => navigate('/games')} className="btn-sun text-sm">去玩更多游戏</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-br from-petal-light to-sky-light pt-10 pb-14 px-4 rounded-b-[3rem] text-center">
        <div className="w-20 h-20 rounded-full gradient-nature-bg flex items-center justify-center mx-auto mb-3 text-4xl">
          {profile?.avatar_emoji || '🧒'}
        </div>
        <h1 className="text-xl font-bold text-foreground">{profile?.nickname || '小小植物学家'}</h1>
        {user ? (
          <p className="text-xs text-muted-foreground">{user.email}</p>
        ) : (
          <p className="text-xs text-muted-foreground">探索植物世界的旅程才刚开始</p>
        )}
        {/* Points display */}
        <div className="flex items-center justify-center gap-1 mt-2 bg-sun text-primary-foreground px-3 py-1 rounded-full text-xs font-bold w-fit mx-auto">
          <Coins size={14} /> 积分：{points}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {user ? (
            <button onClick={signOut} className="flex items-center gap-1 bg-destructive/10 text-destructive px-4 py-1.5 rounded-full text-xs font-bold">
              <LogOut size={14} /> 退出登录
            </button>
          ) : (
            <button onClick={() => navigate('/auth')} className="flex items-center gap-1 btn-nature px-4 py-1.5 text-xs font-bold">
              <LogIn size={14} /> 登录 / 注册
            </button>
          )}
        </div>
      </div>

      <div className="px-4 -mt-8 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {stats.map(s => (
            <motion.button key={s.label} whileTap={{ scale: 0.95 }} onClick={() => setReviewMode(s.mode)}
              className="card-nature p-3 text-center cursor-pointer">
              <s.icon size={20} className={`mx-auto ${s.color}`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[9px] text-muted-foreground font-semibold">{s.label}</p>
              <p className="text-[8px] text-primary mt-0.5">点击查看 →</p>
            </motion.button>
          ))}
        </div>

        {/* Flower Cards count */}
        <div className="card-nature p-4 flex items-center gap-3">
          <span className="text-3xl">🌸</span>
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-sm">花卡收集</h3>
            <p className="text-[10px] text-muted-foreground">在花园中收集开花植物的精美花卡</p>
          </div>
          <span className="text-xl font-bold text-petal">{collectedCards.length}</span>
        </div>

        <div className="card-nature p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Trophy size={16} className="text-sun" /> 成就徽章
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map(a => {
              const unlocked = checkAchievement(a);
              return (
                <motion.div key={a.id} whileHover={{ scale: 1.02 }} className={`rounded-xl p-3 text-center ${unlocked ? 'bg-sun-light' : 'bg-muted opacity-60'}`}>
                  <span className="text-2xl block">{unlocked ? a.emoji : '🔒'}</span>
                  <p className="text-xs font-bold text-foreground mt-1">{a.name}</p>
                  <p className="text-[9px] text-muted-foreground">{a.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="card-nature p-4 space-y-3">
          <h3 className="font-bold text-foreground">🌱 收集图鉴 ({collectedSeeds.length}/{allPlants.length})</h3>
          <div className="grid grid-cols-6 gap-2">
            {allPlants.map(p => {
              const collected = getSeed(p.id);
              return (
                <motion.button key={p.id} whileTap={collected ? { scale: 0.9 } : undefined}
                  onClick={() => collected && setSelectedPlant(p as Plant)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-2xl ${collected ? 'bg-leaf-light cursor-pointer' : 'bg-muted cursor-default'}`}>
                  {collected ? p.emoji : '❓'}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
