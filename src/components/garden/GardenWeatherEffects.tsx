import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Weather, Season } from './GardenSimulation';

interface Props {
  weather: Weather;
  season: Season;
  isNight: boolean;
}

const GardenWeatherEffects = ({ weather, season, isNight }: Props) => {
  const particles = useMemo(() => {
    const count = 30;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      size: 8 + Math.random() * 12,
      swayAmount: 20 + Math.random() * 40,
      duration: 3 + Math.random() * 4,
    }));
  }, []);

  const stars = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 5,
      twinkle: 2 + Math.random() * 3,
    }))
  , []);

  return (
    <>
      {/* NIGHT OVERLAY */}
      {isNight && weather !== 'rainy' && weather !== 'snowy' && (
        <>
          {/* Stars */}
          {stars.map(s => (
            <motion.div
              key={`star-${s.id}`}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                background: 'hsl(45, 80%, 90%)',
              }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: s.twinkle, repeat: Infinity, delay: s.delay }}
            />
          ))}
          {/* Moon */}
          <motion.div
            className="absolute pointer-events-none text-3xl"
            style={{ right: '10%', top: '8%' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🌙
          </motion.div>
          {/* Shooting star */}
          <motion.div
            className="absolute pointer-events-none w-1 h-1 rounded-full"
            style={{ background: 'hsl(45, 90%, 85%)', boxShadow: '0 0 6px 2px hsl(45, 90%, 85%)' }}
            initial={{ left: '80%', top: '5%', opacity: 0 }}
            animate={{
              left: ['80%', '20%'],
              top: ['5%', '40%'],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 8, delay: 3 }}
          />
          {/* Second shooting star */}
          <motion.div
            className="absolute pointer-events-none w-0.5 h-0.5 rounded-full"
            style={{ background: 'hsl(200, 80%, 85%)', boxShadow: '0 0 4px 1px hsl(200, 80%, 85%)' }}
            initial={{ left: '60%', top: '2%', opacity: 0 }}
            animate={{
              left: ['60%', '10%'],
              top: ['2%', '30%'],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 12, delay: 7 }}
          />
        </>
      )}

      {/* AUTUMN LEAVES */}
      {season === 'autumn' && !isNight && particles.slice(0, 12).map(p => (
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
          transition={{ duration: p.duration + 2, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        >
          {['🍂', '🍁', '🍃', '🌿'][p.id % 4]}
        </motion.div>
      ))}

      {/* SNOW */}
      {(weather === 'snowy' || (season === 'winter' && weather !== 'rainy')) && particles.map(p => (
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
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        >
          ❄️
        </motion.div>
      ))}

      {/* RAIN */}
      {weather === 'rainy' && particles.map(p => (
        <motion.div
          key={`rain-${p.id}`}
          className="absolute pointer-events-none text-xs"
          style={{ left: `${p.x}%` }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: '120%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        >
          💧
        </motion.div>
      ))}

      {/* WIND */}
      {weather === 'windy' && !isNight && particles.slice(0, 8).map(p => (
        <motion.div
          key={`wind-${p.id}`}
          className="absolute pointer-events-none text-muted-foreground/30"
          style={{ top: `${10 + p.x * 0.8}%`, fontSize: p.size }}
          initial={{ x: '-10%', opacity: 0 }}
          animate={{ x: '110%', opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: p.delay }}
        >
          〰️
        </motion.div>
      ))}

      {/* SUNNY RAYS */}
      {weather === 'sunny' && !isNight && particles.slice(0, 4).map(p => (
        <motion.div
          key={`sun-${p.id}`}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${20 + p.x * 0.6}%`,
            top: `${p.id * 15}%`,
            width: 2,
            height: 40 + p.id * 10,
            background: 'linear-gradient(180deg, hsla(45, 95%, 55%, 0.3), transparent)',
            transform: `rotate(${15 + p.id * 8}deg)`,
          }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  );
};

export default GardenWeatherEffects;
