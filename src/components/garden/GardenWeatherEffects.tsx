import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Weather, Season } from './GardenSimulation';

interface Props {
  weather: Weather;
  season: Season;
  isNight: boolean;
}

const GardenWeatherEffects = ({ weather, season, isNight }: Props) => {
  // All particles start from top (y: -20 or above) and fall/move downward

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
      id: i, x: 10 + Math.random() * 70, height: 80 + i * 20,
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

  // Insect companions
  const bees = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      startX: 10 + Math.random() * 80,
      startY: -5 - Math.random() * 10,
      endY: 60 + Math.random() * 30,
      delay: i * 3 + Math.random() * 2,
      duration: 8 + Math.random() * 6,
    })), []);

  const butterflies = useMemo(() =>
    Array.from({ length: 2 }, (_, i) => ({
      id: i,
      startX: 20 + Math.random() * 60,
      startY: -8 - Math.random() * 10,
      endY: 50 + Math.random() * 40,
      delay: i * 5 + Math.random() * 3,
      duration: 12 + Math.random() * 8,
    })), []);

  const ladybugs = useMemo(() =>
    Array.from({ length: 2 }, (_, i) => ({
      id: i,
      startX: 15 + Math.random() * 70,
      startY: -3 - Math.random() * 8,
      endY: 70 + Math.random() * 20,
      delay: i * 7 + Math.random() * 4,
      duration: 15 + Math.random() * 10,
    })), []);

  const showInsects = !isNight && !['heavy_rain', 'snowy', 'sleet'].includes(weather);

  return (
    <>
      {/* ===== INSECT COMPANIONS - from top ===== */}
      {showInsects && (
        <>
          {/* Bees */}
          {bees.map(b => (
            <motion.div
              key={`bee-${b.id}`}
              className="absolute text-lg"
              style={{ left: `${b.startX}%`, zIndex: 15 }}
              initial={{ top: `${b.startY}%`, opacity: 0 }}
              animate={{
                top: [`${b.startY}%`, `${b.endY * 0.3}%`, `${b.endY * 0.6}%`, `${b.endY}%`],
                left: [`${b.startX}%`, `${b.startX + 15}%`, `${b.startX - 10}%`, `${b.startX + 5}%`],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: 'linear' }}
            >🐝</motion.div>
          ))}
          {/* Butterflies */}
          {butterflies.map(bf => (
            <motion.div
              key={`bf-${bf.id}`}
              className="absolute text-xl"
              style={{ left: `${bf.startX}%`, zIndex: 15 }}
              initial={{ top: `${bf.startY}%`, opacity: 0 }}
              animate={{
                top: [`${bf.startY}%`, `${bf.endY * 0.4}%`, `${bf.endY * 0.7}%`, `${bf.endY}%`],
                left: [`${bf.startX}%`, `${bf.startX - 20}%`, `${bf.startX + 25}%`, `${bf.startX}%`],
                opacity: [0, 1, 1, 0],
                rotate: [0, -10, 10, 0],
              }}
              transition={{ duration: bf.duration, repeat: Infinity, delay: bf.delay, ease: 'linear' }}
            >🦋</motion.div>
          ))}
          {/* Ladybugs */}
          {ladybugs.map(lb => (
            <motion.div
              key={`lb-${lb.id}`}
              className="absolute text-sm"
              style={{ left: `${lb.startX}%`, zIndex: 15 }}
              initial={{ top: `${lb.startY}%`, opacity: 0 }}
              animate={{
                top: [`${lb.startY}%`, `${lb.endY * 0.5}%`, `${lb.endY}%`],
                left: [`${lb.startX}%`, `${lb.startX + 8}%`, `${lb.startX - 5}%`],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: lb.duration, repeat: Infinity, delay: lb.delay, ease: 'linear' }}
            >🐞</motion.div>
          ))}
        </>
      )}

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
          <motion.div
            className="absolute text-5xl"
            style={{ right: '10%', top: '5%', filter: 'drop-shadow(0 0 20px hsla(45, 80%, 70%, 0.6))' }}
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 4, repeat: Infinity }}
          >🌙</motion.div>
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
        </>
      )}

      {/* ===== FOG - from top ===== */}
      {weather === 'foggy' && fogClouds.map(f => (
        <motion.div
          key={`fog-${f.id}`}
          className="absolute rounded-full"
          style={{
            width: f.width, height: f.height,
            background: isNight
              ? 'radial-gradient(ellipse, hsla(220,15%,60%,0.35), transparent 70%)'
              : 'radial-gradient(ellipse, hsla(0,0%,100%,0.55), transparent 70%)',
            filter: 'blur(25px)',
          }}
          initial={{ left: '-30%', top: `${f.y}%`, opacity: 0 }}
          animate={{ left: ['-30%', '120%'], opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'linear' }}
        />
      ))}

      {/* ===== LIGHT RAIN - from top ===== */}
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
          initial={{ top: -20, opacity: 0 }}
          animate={{ top: '105%', opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}

      {/* ===== RAINY - from top ===== */}
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
          initial={{ top: -25, opacity: 0 }}
          animate={{ top: '105%', opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}

      {/* ===== HEAVY RAIN - from top ===== */}
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
              initial={{ top: -30, opacity: 0 }}
              animate={{ top: '105%', opacity: [0, 0.9, 0.9, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
            />
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: 'linear-gradient(0deg, hsla(210,30%,70%,0.3), transparent)' }} />
          <div className="absolute inset-0"
            style={{ background: 'hsla(210,20%,50%,0.08)' }} />
        </>
      )}

      {/* ===== SLEET - from top ===== */}
      {weather === 'sleet' && sleetDrops.map(p => (
        p.isSnow ? (
          <motion.div
            key={`sleet-s-${p.id}`}
            className="absolute"
            style={{ left: `${p.x}%`, fontSize: 12 }}
            initial={{ top: -10, opacity: 0 }}
            animate={{ top: '105%', x: [0, 15, -10], opacity: [0, 0.8, 0.8, 0] }}
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
            initial={{ top: -20, opacity: 0 }}
            animate={{ top: '105%', opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          />
        )
      ))}

      {/* ===== SNOW - from top ===== */}
      {(weather === 'snowy' || (season === 'winter' && !['rainy', 'heavy_rain', 'sleet', 'foggy'].includes(weather) && weather !== 'windy')) && (
        snowFlakes.map(p => (
          <motion.div
            key={`snow-${p.id}`}
            className="absolute"
            style={{ left: `${p.x}%`, fontSize: Math.max(10, p.size * 0.6) }}
            initial={{ top: -15, opacity: 0 }}
            animate={{ top: '105%', x: [0, p.sway * 0.4, -p.sway * 0.3], opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          >❄️</motion.div>
        ))
      )}

      {/* ===== AUTUMN LEAVES - from top ===== */}
      {season === 'autumn' && !['heavy_rain', 'rainy'].includes(weather) && leaves.map(p => (
        <motion.div
          key={`leaf-${p.id}`}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ top: -25, opacity: 0, rotate: 0 }}
          animate={{
            top: '105%',
            x: [0, p.sway, -p.sway / 2, p.sway / 3],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: p.duration + 2, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        >
          {['🍂', '🍁', '🍃', '🌿'][p.id % 4]}
        </motion.div>
      ))}

      {/* ===== WIND - from top-left to right ===== */}
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

      {/* ===== SUNNY RAYS - from top ===== */}
      {weather === 'sunny' && !isNight && sunRays.map(r => (
        <motion.div
          key={`sun-${r.id}`}
          className="absolute rounded-full"
          style={{
            left: `${r.x}%`, top: 0, width: 3, height: r.height,
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
