import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSeedVerse } from '@/contexts/SeedVerseContext';
import { Plant } from '@/data/plants';
import GrowthStage from '@/components/GrowthStage';
import { motion } from 'framer-motion';

const PlantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getSeed, collectSeed, growSeed, getPlantById } = useSeedVerse();
  const plant = getPlantById(id || '');

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">植物未找到</p>
      </div>
    );
  }

  const seed = getSeed(plant.id);

  return (
    <div className="min-h-screen pb-24">
      <div className="gradient-nature-bg pt-10 pb-14 px-4 rounded-b-[3rem]">
        <Link to="/garden" className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-4">
          <ArrowLeft size={16} /> 返回花园
        </Link>
        <div className="text-center">
          <span className="text-7xl block mb-3 animate-float">{plant.emoji}</span>
          <h1 className="text-3xl font-bold text-primary-foreground">{plant.name}</h1>
          <p className="text-primary-foreground/70 italic text-sm">{plant.scientificName}</p>
        </div>
      </div>

      <div className="px-4 -mt-8 space-y-4">
        {!seed ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-nature p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">你还没有收集这颗种子</p>
            <button onClick={() => collectSeed(plant.id)} className="btn-nature text-sm">🌱 收集种子</button>
          </motion.div>
        ) : (
          <div className="card-nature p-4">
            <h3 className="font-bold text-foreground mb-3">🌿 生命周期</h3>
            <GrowthStage
              plant={plant as Plant}
              currentStage={seed.currentStage}
              unlocked={seed.unlocked}
              onGrow={() => growSeed(plant.id)}
            />
          </div>
        )}

        <div className="card-nature p-4 space-y-2 bg-gradient-to-br from-sky-light to-leaf-light">
          <h3 className="font-bold text-foreground">🏞️ {plant.scene.name}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{plant.scene.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailPage;
