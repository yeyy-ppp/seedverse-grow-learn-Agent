import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Plant } from '@/data/plants';
import QuizItem from './QuizItem';
import PlantDiagramView from './PlantDiagramView';
import SceneColoringGame from '@/components/games/SceneColoringGame';

interface Props {
  plant: Plant;
  onBack: () => void;
  showAll?: boolean;
  initialTab?: string;
}

const PlantDetailView = ({ plant, onBack, showAll = true, initialTab }: Props) => {
  const [showColoring, setShowColoring] = useState(false);

  const showSection = (key: string) => showAll || !initialTab || initialTab === key;

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
        {showSection('profile') && <PlantDiagramView plant={plant} />}

        {showSection('stories') && (
          <div className="card-nature p-4 space-y-2">
            <h3 className="font-bold text-foreground">📖 趣味故事</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{plant.story}</p>
          </div>
        )}

        {showSection('profile') && (
          <div className="card-nature p-4 space-y-2">
            <h3 className="font-bold text-foreground">🔬 知识讲解</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{plant.knowledge}</p>
          </div>
        )}

        {showSection('poems') && (
          <div className="card-nature p-4 space-y-2 bg-gradient-to-br from-petal-light to-sky-light">
            <h3 className="font-bold text-foreground">🎋 诗词典故</h3>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-display text-base">{plant.poem}</p>
          </div>
        )}

        {showSection('scenes') && (
          <div className="card-nature p-4 space-y-2">
            <h3 className="font-bold text-foreground">🎨 场景绘图 · {plant.scene.name}</h3>
            {showColoring ? (
              <SceneColoringGame plant={plant} onBack={() => setShowColoring(false)} />
            ) : (
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">{plant.scene.description}</p>
                <button onClick={() => setShowColoring(true)} className="btn-nature text-sm">
                  🎨 开始绘图
                </button>
              </div>
            )}
          </div>
        )}

        {showSection('quiz') && (
          <div className="card-nature p-4 space-y-3">
            <h3 className="font-bold text-foreground">❓ 互动问答</h3>
            {plant.quiz.map((q, i) => (
              <QuizItem key={i} quiz={q} />
            ))}
          </div>
        )}

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
