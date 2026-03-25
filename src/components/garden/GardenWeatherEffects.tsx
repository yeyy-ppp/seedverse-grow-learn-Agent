import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Weather, Season } from './GardenSimulation';

interface Props {
  weather: Weather;
  season: Season;
}

const GardenWeatherEffects = ({ weather, season }: Props) => {
  const particles = useMemo(() => {
    const count = weather === 'sunny' ? 6 : 25;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      size: 8 + Math.random() * 12,
      swayAmount: 20 + Math.random() * 40,
    }));
  }, [weather]);

  // Autumn falling leaves
  if (season === 'autumn') {
    return (
      <>
        {particles.slice(0, 12).map(p => (
          <motion.div
            key={`leaf-${p.id}`}
            className="absolute pointer-events-none text-sm"
            style={{ left: `${p.x}%`, fontSize: p.size }}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{
              y: ['0%', '120%'],
              x: [0, p.swayAmount, -p.swayAmount / 2, p.swayAmount / 3],
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          >
            {['🍂', '🍁', '🍃', '🌿'][p.id % 4]}
          </motion.div>
        ))}
      </>
    );
  }

  // Winter snow
  if (weather === 'snowy' || season === 'winter') {
    return (
      <>
        {particles.map(p => (
          <motion.div
            key={`snow-${p.id}`}
            className="absolute pointer-events-none"
            style={{ left: `${p.x}%`, fontSize: Math.max(6, p.size * 0.6) }}
            initial={{ y: -10, opacity: 0 }}
            animate={{
              y: ['0%', '120%'],
              x: [0, p.swayAmount * 0.3, -p.swayAmount * 0.2],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          >
            ❄️
          </motion.div>
        ))}
      </>
    );
  }

  // Rain
  if (weather === 'rainy') {
    return (
      <>
        {particles.map(p => (
          <motion.div
            key={`rain-${p.id}`}
            className="absolute pointer-events-none text-xs"
            style={{ left: `${p.x}%` }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: '120%', opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          >
            💧
          </motion.div>
        ))}
      </>
    );
  }

  // Windy
  if (weather === 'windy') {
    return (
      <>
        {particles.slice(0, 8).map(p => (
          <motion.div
            key={`wind-${p.id}`}
            className="absolute pointer-events-none text-muted-foreground/30"
            style={{ top: `${10 + p.x * 0.8}%`, fontSize: p.size }}
            initial={{ x: '-10%', opacity: 0 }}
            animate={{ x: '110%', opacity: [0, 0.5, 0.5, 0] }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: p.delay,
            }}
          >
            〰️
          </motion.div>
        ))}
      </>
    );
  }

  // Sunny - light rays
  if (weather === 'sunny') {
    return (
      <>
        {particles.slice(0, 4).map(p => (
          <motion.div
            key={`sun-${p.id}`}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${20 + p.x * 0.6}%`,
              top: `${p.id * 15}%`,
              width: 2,
              height: 40 + p.id * 10,
              background: `linear-gradient(180deg, hsla(45, 95%, 55%, 0.3), transparent)`,
              transform: `rotate(${15 + p.id * 8}deg)`,
            }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: p.delay }}
          />
        ))}
      </>
    );
  }

  return null;
};

export default GardenWeatherEffects;
