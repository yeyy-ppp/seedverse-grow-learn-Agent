import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Weather, Season } from './GardenSimulation';

interface Props {
  weather: Weather;
  season: Season;
  isNight: boolean;
}

const GardenWeatherEffects = ({ weather, season, isNight }: Props) => {
  // Light rain particles
  const lightRainDrops = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 3, size: 8 + Math.random() * 6, duration: 1.5 + Math.random() * 1,
    })), []);

  // Heavy rain particles
  const heavyRainDrops = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 1.5, size: 10 + Math.random() * 8, duration: 0.6 + Math.random() * 0.5,
    })), []);

  // Snow particles
  const snowFlakes = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 5, size: 10 + Math.random() * 14,
      sway: 15 + Math.random() * 30, duration: 5 + Math.random() * 5,
    })), []);

  // Leaves
  const leaves = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 6, size: 12 + Math.random() * 10,
      sway: 20 + Math.random() * 40, duration: 4 + Math.random() * 4,
    })), []);

  // Stars
  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 60,
      size: 1 + Math.random() * 2.5, delay: Math.random() * 5, twinkle: 2 + Math.random() * 3,
    })), []);

  // Wind streaks
  const windStreaks = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i, y: 5 + Math.random() * 85, delay: Math.random() * 4, duration: 1.5 + Math.random() * 2,
      width: 30 + Math.random() * 60,
    })), []);

  // Sun rays
  const sunRays = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i, x: 15 + Math.random() * 60, y: i * 12, height: 50 + i * 15,
      angle: 10 + i * 10, delay: Math.random() * 3,
    })), []);

  // Fog particles
  const fogClouds = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i, y: 10 + Math.random() * 70, delay: Math.random() * 6,
      width: 200 + Math.random() * 300, duration: 15 + Math.random() * 10,
    })), []);

  // Sleet (rain+snow mix)
  const sleetDrops = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 2,
      duration: 0.8 + Math.random() * 0.8, isSnow: i % 3 === 0,
    })), []);

  return (
    <>
      {/* ===== NIGHT SKY ===== */}
      {isNight && weather !== 'heavy_rain' && (
        <>
          {stars.map(s => (
            <motion.div
              key={`star-${s.id}`}
              className="absolute pointer-events-none rounded-full"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: 'hsl(45, 80%, 90%)' }}
              animate={{ opacity: [0.15, 0.9, 0.15] }}
              transition={{ duration: s.twinkle, repeat: Infinity, delay: s.delay }}
            />
          ))}
          <motion.div
            className="absolute pointer-events-none text-4xl"
            style={{ right: '8%', top: '6%' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
          >🌙</motion.div>
          {/* Shooting stars */}
          <motion.div
            className="absolute pointer-events-none w-1 h-1 rounded-full"
            style={{ background: 'hsl(45, 90%, 85%)', boxShadow: '0 0 8px 3px hsl(45, 90%, 85%)' }}
            initial={{ left: '85%', top: '4%', opacity: 0 }}
            animate={{ left: ['85%', '15%'], top: ['4%', '45%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 10, delay: 2 }}
          />
          <motion.div
            className="absolute pointer-events-none w-0.5 h-0.5 rounded-full"
            style={{ background: 'hsl(200, 80%, 85%)', boxShadow: '0 0 4px 1px hsl(200, 80%, 85%)' }}
            initial={{ left: '55%', top: '2%', opacity: 0 }}
            animate={{ left: ['55%', '5%'], top: ['2%', '35%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 15, delay: 8 }}
          />
        </>
      )}

      {/* ===== FOG ===== */}
      {weather === 'foggy' && fogClouds.map(f => (
        <motion.div
          key={`fog-${f.id}`}
          className="absolute pointer-events-none rounded-full"
          style={{
            top: `${f.y}%`, width: f.width, height: 60 + Math.random() * 40,
            background: isNight
              ? 'radial-gradient(ellipse, hsla(220,15%,60%,0.25), transparent 70%)'
              : 'radial-gradient(ellipse, hsla(0,0%,100%,0.45), transparent 70%)',
            filter: 'blur(20px)',
          }}
          initial={{ left: '-20%', opacity: 0 }}
          animate={{ left: ['-20%', '120%'], opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'linear' }}
        />
      ))}

      {/* ===== LIGHT RAIN (小雨) ===== */}
      {weather === 'light_rain' && lightRainDrops.map(p => (
        <motion.div
          key={`lr-${p.id}`}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`, width: 1.5, height: 10,
            background: isNight ? 'hsla(210,50%,70%,0.4)' : 'hsla(210,60%,70%,0.5)',
            borderRadius: 1,
          }}
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}

      {/* ===== RAINY (中雨, legacy "rainy") ===== */}
      {weather === 'rainy' && (
        <>
          {lightRainDrops.map(p => (
            <motion.div
              key={`rain-${p.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}%`, width: 2, height: 14,
                background: isNight ? 'hsla(210,50%,70%,0.45)' : 'hsla(210,60%,70%,0.55)',
                borderRadius: 1,
              }}
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: '110vh', opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: 1 + Math.random() * 0.5, repeat: Infinity, delay: p.delay, ease: 'linear' }}
            />
          ))}
        </>
      )}

      {/* ===== HEAVY RAIN (大雨/暴雨) ===== */}
      {weather === 'heavy_rain' && (
        <>
          {heavyRainDrops.map(p => (
            <motion.div
              key={`hr-${p.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}%`, width: 2.5, height: 20,
                background: 'hsla(210,50%,65%,0.6)',
                borderRadius: 1, transform: 'rotate(-8deg)',
              }}
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: '110vh', opacity: [0, 0.8, 0.8, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
            />
          ))}
          {/* Rain mist at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(0deg, hsla(210,30%,70%,0.2), transparent)' }} />
        </>
      )}

      {/* ===== SLEET (雨夹雪) ===== */}
      {weather === 'sleet' && sleetDrops.map(p => (
        p.isSnow ? (
          <motion.div
            key={`sleet-s-${p.id}`}
            className="absolute pointer-events-none text-xs"
            style={{ left: `${Math.random() * 100}%` }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: '110vh', x: [0, 15, -10], opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          >❄️</motion.div>
        ) : (
          <motion.div
            key={`sleet-r-${p.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`, width: 2, height: 14,
              background: 'hsla(210,50%,70%,0.5)', borderRadius: 1,
            }}
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: '110vh', opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          />
        )
      ))}

      {/* ===== SNOW ===== */}
      {(weather === 'snowy' || (season === 'winter' && !['rainy', 'heavy_rain', 'sleet', 'foggy'].includes(weather))) && weather !== 'windy' && (
        snowFlakes.map(p => (
          <motion.div
            key={`snow-${p.id}`}
            className="absolute pointer-events-none"
            style={{ left: `${p.x}%`, fontSize: Math.max(8, p.size * 0.5) }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: '110vh', x: [0, p.sway * 0.3, -p.sway * 0.2], opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          >❄️</motion.div>
        ))
      )}

      {/* ===== AUTUMN LEAVES ===== */}
      {season === 'autumn' && !isNight && !['heavy_rain', 'rainy'].includes(weather) && leaves.map(p => (
        <motion.div
          key={`leaf-${p.id}`}
          className="absolute pointer-events-none"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
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
          className="absolute pointer-events-none"
          style={{
            top: `${w.y}%`, height: 2, width: w.width,
            background: isNight
              ? 'linear-gradient(90deg, transparent, hsla(210,20%,80%,0.35), transparent)'
              : 'linear-gradient(90deg, transparent, hsla(200,30%,70%,0.45), transparent)',
            borderRadius: 2,
          }}
          initial={{ x: '-15%', opacity: 0 }}
          animate={{ x: '110vw', opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: w.duration, repeat: Infinity, delay: w.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* ===== SUNNY RAYS ===== */}
      {weather === 'sunny' && !isNight && sunRays.map(r => (
        <motion.div
          key={`sun-${r.id}`}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${r.x}%`, top: `${r.y}%`, width: 2.5, height: r.height,
            background: 'linear-gradient(180deg, hsla(45, 95%, 55%, 0.25), transparent)',
            transform: `rotate(${r.angle}deg)`, transformOrigin: 'top center',
          }}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: r.delay }}
        />
      ))}

      {/* ===== CLOUDY OVERLAY ===== */}
      {weather === 'cloudy' && !isNight && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, hsla(210,15%,80%,0.3), transparent)',
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      )}
    </>
  );
};

export default GardenWeatherEffects;
