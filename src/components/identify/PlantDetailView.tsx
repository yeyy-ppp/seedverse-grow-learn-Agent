import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Plant } from '@/data/plants';
import QuizItem from './QuizItem';

interface Props {
  plant: Plant;
  onBack: () => void;
}

const PlantDetailView = ({ plant, onBack }: Props) => {
  return (
    <div className="min-h-screen pb-24">
      <div className="gradient-nature-bg pt-10 pb-14 px-4 rounded-b-[3rem]">
        <button onClick={onBack} className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-4">
          <ArrowLeft size={16} /> 返回
        </button>
        <div className="text-center">
          <span className="text-7xl block mb-3 animate-float">{plant.emoji}</span>
          <h1 className="text-3xl font-bold text-primary-foreground">{plant.name}</h1>
          <p className="text-primary-foreground/70 italic text-sm">{plant.scientificName}</p>
        </div>
      </div>
      <div className="px-4 -mt-8 space-y-4">
        <div className="card-nature p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">📋 基本信息</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-leaf-light rounded-xl p-2"><span className="font-bold text-leaf">分类：</span>{plant.category}</div>
            <div className="bg-sky-light rounded-xl p-2"><span className="font-bold text-sky">科属：</span>{plant.family}</div>
          </div>
          <div className="bg-sun-light rounded-xl p-3 text-xs">
            <span className="font-bold text-secondary-foreground">🌍 生长环境：</span>
            <span className="text-muted-foreground">{plant.environment}</span>
          </div>
          <div className="bg-petal-light rounded-xl p-3 text-xs">
            <span className="font-bold text-petal">✨ 特征：</span>
            <span className="text-muted-foreground">{plant.features}</span>
          </div>
        </div>

        <div className="card-nature p-4 space-y-2">
          <h3 className="font-bold text-foreground">📖 趣味故事</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{plant.story}</p>
        </div>

        <div className="card-nature p-4 space-y-2">
          <h3 className="font-bold text-foreground">🔬 知识讲解</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{plant.knowledge}</p>
        </div>

        <div className="card-nature p-4 space-y-2 bg-gradient-to-br from-petal-light to-sky-light">
          <h3 className="font-bold text-foreground">🎋 诗词典故</h3>
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-display text-base">{plant.poem}</p>
        </div>

        <div className="card-nature p-4 space-y-2">
          <h3 className="font-bold text-foreground">🏞️ 情境故事 · {plant.scene.name}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{plant.scene.description}</p>
        </div>

        <div className="card-nature p-4 space-y-3">
          <h3 className="font-bold text-foreground">❓ 互动问答</h3>
          {plant.quiz.map((q, i) => (
            <QuizItem key={i} quiz={q} />
          ))}
        </div>

        <div className="text-center pb-4">
          <Link to={`/plant/${plant.id}`} className="btn-nature inline-block text-sm">
            🌱 查看生命周期
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailView;
