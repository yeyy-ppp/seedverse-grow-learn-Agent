import { motion } from 'framer-motion';
import { Plant } from '@/data/plants';

interface GrowthStageProps {
  plant: Plant;
  currentStage: number;
  unlocked: boolean[];
  onGrow?: () => void;
}

const GrowthStage = ({ plant, currentStage, unlocked, onGrow }: GrowthStageProps) => {
  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {plant.stages.map((stage, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                ${i <= currentStage ? 'gradient-nature-bg shadow-lg' : 'bg-muted'}
                ${i === currentStage ? 'ring-4 ring-sun/50' : ''}
              `}
            >
              {unlocked[i] ? stage.emoji : '🔒'}
            </motion.div>
            <span className={`text-[9px] font-semibold ${i <= currentStage ? 'text-leaf' : 'text-muted-foreground'}`}>
              {stage.name}
            </span>
          </div>
        ))}
      </div>

      {/* Current stage detail */}
      <motion.div
        key={currentStage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-nature p-4 text-center space-y-3"
      >
        <span className="text-6xl block animate-float">{plant.stages[currentStage].emoji}</span>
        <h4 className="font-bold text-lg text-foreground">{plant.stages[currentStage].name}阶段</h4>
        <p className="text-sm text-muted-foreground">{plant.stages[currentStage].description}</p>
        <div className="bg-sun-light rounded-xl p-3">
          <p className="text-xs font-semibold text-secondary-foreground">💡 {plant.stages[currentStage].unlockContent}</p>
        </div>
        {onGrow && currentStage < plant.stages.length - 1 && (
          <button onClick={onGrow} className="btn-nature text-sm">
            🌱 浇水施肥，促进成长
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default GrowthStage;
