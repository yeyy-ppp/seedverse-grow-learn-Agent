import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Weather, Season } from './GardenSimulation';

interface Props {
  weather: Weather;
  season: Season;
  isNight: boolean;
}

const GardenWeatherEffects = ({ weather, season, isNight }: Props) => {
  const lightRainDrops = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 2, duration: 1.2 + Math.random() * 0.8,
    })), []);

  const heavyRainDrops = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 1, duration: 0.5 + Math.random() * 0.4,
    })), []);

  const snowFlakes = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 5,
      sway: 20 + Math.random() * 40, duration: 5 + Math.random() * 5,
      size: 10 + Math.random() * 12,
    })), []);

  const leaves = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 6,
      sway: 25 + Math.random() * 50, duration: 5 + Math.random() * 5,
      size: 14 + Math.random() * 10,
    })), []);

  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 60,
      size: 2 + Math.random() * 3, delay: Math.random() * 5, twinkle: 2 + Math.random() * 3,
    })), []);

  const windStreaks = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i, y: 5 + Math.random() * 85, delay: Math.random() * 3, duration: 1.2 + Math.random() * 1.5,
      width: 60 + Math.random() * 120,
    })), []);

  const sunRays = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i, x: 10 + Math.random() * 70, y: i * 10, height: 80 + i * 20,
      angle: 8 + i * 12, delay: Math.random() * 3,
    })), []);

  const fogClouds = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i, y: 5 + Math.random() * 80, delay: Math.random() * 8,
      width: 300 + Math.random() * 400, height: 80 + Math.random() * 60,
      duration: 12 + Math.random() * 10,
    })), []);

  const sleetDrops = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 2,
      duration: 0.7 + Math.random() * 0.7, isSnow: i % 3 === 0,
    })), []);

  return (
    <>
      {/* ===== NIGHT SKY ===== */}
      {isNight && weather !== 'heavy_rain' && (
        <>
          {stars.map(s => (
            <motion.div
              key={`star-${s.id}`}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.size, height: s.size,
                background: 'radial-gradient(circle, hsl(45 90% 90%), hsl(45 80% 70%))',
                boxShadow: `0 0 ${s.size * 2}px ${s.size * 0.5}px hsla(45, 80%, 85%, 0.5)`,
              }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: s.twinkle, repeat: Infinity, delay: s.delay }}
            />
          ))}
          {/* Moon */}
          <motion.div
            className="absolute text-5xl"
            style={{ right: '10%', top: '5%', filter: 'drop-shadow(0 0 20px hsla(45, 80%, 70%, 0.6))' }}
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 4, repeat: Infinity }}
          >🌙</motion.div>
          {/* Shooting stars */}
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: 'hsl(45, 90%, 85%)',
              boxShadow: '0 0 12px 4px hsla(45, 90%, 85%, 0.8), -20px 0 30px 2px hsla(45, 90%, 85%, 0.3)',
            }}
            initial={{ left: '85%', top: '4%', opacity: 0 }}
            animate={{ left: ['85%', '15%'], top: ['4%', '45%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 12, delay: 3 }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: 'hsl(200, 80%, 85%)',
              boxShadow: '0 0 8px 2px hsla(200, 80%, 85%, 0.6), -15px 0 20px 1px hsla(200, 80%, 85%, 0.2)',
            }}
            initial={{ left: '60%', top: '2%', opacity: 0 }}
            animate={{ left: ['60%', '10%'], top: ['2%', '35%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 18, delay: 9 }}
          />
        </>
      )}

      {/* ===== FOG ===== */}
      {weather === 'foggy' && fogClouds.map(f => (
        <motion.div
          key={`fog-${f.id}`}
          className="absolute rounded-full"
          style={{
            top: `${f.y}%`, width: f.width, height: f.height,
            background: isNight
              ? 'radial-gradient(ellipse, hsla(220,15%,60%,0.35), transparent 70%)'
              : 'radial-gradient(ellipse, hsla(0,0%,100%,0.55), transparent 70%)',
            filter: 'blur(25px)',
          }}
          initial={{ left: '-30%', opacity: 0 }}
          animate={{ left: ['-30%', '120%'], opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'linear' }}
        />
      ))}

      {/* ===== LIGHT RAIN ===== */}
      {weather === 'light_rain' && lightRainDrops.map(p => (
        <motion.div
          key={`lr-${p.id}`}
          className="absolute"
          style={{
            left: `${p.x}%`, width: 2, height: 16,
            background: isNight
              ? 'linear-gradient(180deg, transparent, hsla(210,60%,75%,0.6))'
              : 'linear-gradient(180deg, transparent, hsla(210,70%,75%,0.7))',
            borderRadius: 2,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: '105vh', opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}

      {/* ===== RAINY (中雨) ===== */}
      {weather === 'rainy' && lightRainDrops.map(p => (
        <motion.div
          key={`rain-${p.id}`}
          className="absolute"
          style={{
            left: `${p.x}%`, width: 2.5, height: 22,
            background: isNight
              ? 'linear-gradient(180deg, transparent, hsla(210,55%,70%,0.7))'
              : 'linear-gradient(180deg, transparent, hsla(210,65%,70%,0.8))',
            borderRadius: 2,
          }}
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: '105vh', opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}

      {/* ===== HEAVY RAIN ===== */}
      {weather === 'heavy_rain' && (
        <>
          {heavyRainDrops.map(p => (
            <motion.div
              key={`hr-${p.id}`}
              className="absolute"
              style={{
                left: `${p.x}%`, width: 3, height: 28,
                background: 'linear-gradient(180deg, transparent, hsla(210,55%,65%,0.8))',
                borderRadius: 2, transform: 'rotate(-8deg)',
              }}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: '105vh', opacity: [0, 0.9, 0.9, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
            />
          ))}
          {/* Mist at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: 'linear-gradient(0deg, hsla(210,30%,70%,0.3), transparent)' }} />
          {/* Screen-wide rain overlay */}
          <div className="absolute inset-0"
            style={{ background: 'hsla(210,20%,50%,0.08)' }} />
        </>
      )}

      {/* ===== SLEET ===== */}
      {weather === 'sleet' && sleetDrops.map(p => (
        p.isSnow ? (
          <motion.div
            key={`sleet-s-${p.id}`}
            className="absolute"
            style={{ left: `${p.x}%`, fontSize: 12 }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: '105vh', x: [0, 15, -10], opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          >❄️</motion.div>
        ) : (
          <motion.div
            key={`sleet-r-${p.id}`}
            className="absolute"
            style={{
              left: `${p.x}%`, width: 2.5, height: 18,
              background: 'linear-gradient(180deg, transparent, hsla(210,55%,70%,0.7))',
              borderRadius: 2, transform: 'rotate(-5deg)',
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: '105vh', opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          />
        )
      ))}

      {/* ===== SNOW ===== */}
      {(weather === 'snowy' || (season === 'winter' && !['rainy', 'heavy_rain', 'sleet', 'foggy'].includes(weather) && weather !== 'windy')) && (
        snowFlakes.map(p => (
          <motion.div
            key={`snow-${p.id}`}
            className="absolute"
            style={{ left: `${p.x}%`, fontSize: Math.max(10, p.size * 0.6) }}
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: '105vh', x: [0, p.sway * 0.4, -p.sway * 0.3], opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          >❄️</motion.div>
        ))
      )}

      {/* ===== AUTUMN LEAVES ===== */}
      {season === 'autumn' && !['heavy_rain', 'rainy'].includes(weather) && leaves.map(p => (
        <motion.div
          key={`leaf-${p.id}`}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: -25, opacity: 0, rotate: 0 }}
          animate={{
            y: '105vh',
            x: [0, p.sway, -p.sway / 2, p.sway / 3],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: p.duration + 2, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        >
          {['🍂', '🍁', '🍃', '🌿'][p.id % 4]}
        </motion.div>
      ))}

      {/* ===== WIND ===== */}
      {weather === 'windy' && windStreaks.map(w => (
        <motion.div
          key={`wind-${w.id}`}
          className="absolute"
          style={{
            top: `${w.y}%`, height: 3, width: w.width,
            background: isNight
              ? 'linear-gradient(90deg, transparent, hsla(210,25%,80%,0.5), transparent)'
              : 'linear-gradient(90deg, transparent, hsla(200,35%,75%,0.6), transparent)',
            borderRadius: 3,
          }}
          initial={{ left: '-15%', opacity: 0 }}
          animate={{ left: '110%', opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: w.duration, repeat: Infinity, delay: w.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* ===== SUNNY RAYS ===== */}
      {weather === 'sunny' && !isNight && sunRays.map(r => (
        <motion.div
          key={`sun-${r.id}`}
          className="absolute rounded-full"
          style={{
            left: `${r.x}%`, top: `${r.y}%`, width: 3, height: r.height,
            background: 'linear-gradient(180deg, hsla(45, 95%, 55%, 0.35), transparent)',
            transform: `rotate(${r.angle}deg)`, transformOrigin: 'top center',
          }}
          animate={{ opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: r.delay }}
        />
      ))}

      {/* ===== CLOUDY ===== */}
      {weather === 'cloudy' && !isNight && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-2/5"
          style={{
            background: 'linear-gradient(180deg, hsla(210,15%,80%,0.4), transparent)',
          }}
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      )}
    </>
  );
};

export default GardenWeatherEffects;
