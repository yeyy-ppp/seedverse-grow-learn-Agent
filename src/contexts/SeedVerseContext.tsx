import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SeedCard, plants } from '@/data/plants';

interface SeedVerseState {
  collectedSeeds: SeedCard[];
  quizCount: number;
  gameCount: number;
  collectSeed: (plantId: string) => void;
  growSeed: (plantId: string) => void;
  incrementQuiz: () => void;
  incrementGame: () => void;
  getSeed: (plantId: string) => SeedCard | undefined;
}

const SeedVerseContext = createContext<SeedVerseState | null>(null);

export const useSeedVerse = () => {
  const ctx = useContext(SeedVerseContext);
  if (!ctx) throw new Error('useSeedVerse must be used within SeedVerseProvider');
  return ctx;
};

export const SeedVerseProvider = ({ children }: { children: ReactNode }) => {
  const [collectedSeeds, setCollectedSeeds] = useState<SeedCard[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);

  const collectSeed = useCallback((plantId: string) => {
    setCollectedSeeds(prev => {
      if (prev.find(s => s.plantId === plantId)) return prev;
      const plant = plants.find(p => p.id === plantId);
      if (!plant) return prev;
      return [...prev, {
        plantId,
        collectedAt: new Date().toISOString(),
        currentStage: 0,
        unlocked: plant.stages.map((_, i) => i === 0),
      }];
    });
  }, []);

  const growSeed = useCallback((plantId: string) => {
    setCollectedSeeds(prev => prev.map(s => {
      if (s.plantId !== plantId) return s;
      const plant = plants.find(p => p.id === plantId);
      if (!plant || s.currentStage >= plant.stages.length - 1) return s;
      const next = s.currentStage + 1;
      const unlocked = [...s.unlocked];
      unlocked[next] = true;
      return { ...s, currentStage: next, unlocked };
    }));
  }, []);

  const incrementQuiz = useCallback(() => setQuizCount(c => c + 1), []);
  const incrementGame = useCallback(() => setGameCount(c => c + 1), []);
  const getSeed = useCallback((plantId: string) => collectedSeeds.find(s => s.plantId === plantId), [collectedSeeds]);

  return (
    <SeedVerseContext.Provider value={{ collectedSeeds, quizCount, gameCount, collectSeed, growSeed, incrementQuiz, incrementGame, getSeed }}>
      {children}
    </SeedVerseContext.Provider>
  );
};
