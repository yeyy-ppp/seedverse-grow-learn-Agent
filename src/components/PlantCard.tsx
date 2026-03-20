import { motion } from 'framer-motion';
import { Plant } from '@/data/plants';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
  collected?: boolean;
}

const PlantCard = ({ plant, onClick, collected }: PlantCardProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="card-nature p-4 flex flex-col items-center gap-2 relative overflow-hidden w-full text-left"
  >
    {collected && (
      <div className="absolute top-2 right-2 badge-glow text-[10px]">已收集</div>
    )}
    <span className="text-5xl animate-float">{plant.emoji}</span>
    <h3 className="font-bold text-foreground text-sm">{plant.name}</h3>
    <p className="text-[10px] text-muted-foreground italic">{plant.scientificName}</p>
    <span className="text-[10px] bg-leaf-light text-leaf px-2 py-0.5 rounded-full font-semibold">
      {plant.category}
    </span>
  </motion.button>
);

export default PlantCard;
