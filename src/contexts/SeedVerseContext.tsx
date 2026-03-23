import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SeedCard, plants, Plant } from '@/data/plants';

export interface CustomPlant {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  family: string;
  environment: string;
  features: string;
  emoji: string;
  color: string;
  story: string;
  knowledge: string;
  poem: string;
  quiz: { question: string; options: string[]; answer: number }[];
  scene: { name: string; description: string };
  stages: { name: string; emoji: string; description: string; unlockContent: string }[];
}

interface SeedVerseState {
  collectedSeeds: SeedCard[];
  customPlants: CustomPlant[];
  quizCount: number;
  gameCount: number;
  collectSeed: (plantId: string) => void;
  addCustomPlant: (plant: CustomPlant) => void;
  growSeed: (plantId: string) => void;
  incrementQuiz: () => void;
  incrementGame: () => void;
  getSeed: (plantId: string) => SeedCard | undefined;
  getAllPlants: () => Plant[];
  getPlantById: (id: string) => Plant | CustomPlant | undefined;
}

const SeedVerseContext = createContext<SeedVerseState | null>(null);

export const useSeedVerse = () => {
  const ctx = useContext(SeedVerseContext);
  if (!ctx) throw new Error('useSeedVerse must be used within SeedVerseProvider');
  return ctx;
};

export const SeedVerseProvider = ({ children }: { children: ReactNode }) => {
  const [collectedSeeds, setCollectedSeeds] = useState<SeedCard[]>([]);
  const [customPlants, setCustomPlants] = useState<CustomPlant[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);

  const getAllPlants = useCallback((): Plant[] => {
    return [...plants, ...customPlants as Plant[]];
  }, [customPlants]);

  const getPlantById = useCallback((id: string): Plant | CustomPlant | undefined => {
    return plants.find(p => p.id === id) || customPlants.find(p => p.id === id);
  }, [customPlants]);

  const addCustomPlant = useCallback((plant: CustomPlant) => {
    setCustomPlants(prev => {
      if (prev.find(p => p.id === plant.id)) return prev;
      return [...prev, plant];
    });
    // Also collect the seed automatically
    setCollectedSeeds(prev => {
      if (prev.find(s => s.plantId === plant.id)) return prev;
      return [...prev, {
        plantId: plant.id,
        collectedAt: new Date().toISOString(),
        currentStage: 0,
        unlocked: plant.stages.map((_, i) => i === 0),
      }];
    });
  }, []);

  const collectSeed = useCallback((plantId: string) => {
    setCollectedSeeds(prev => {
      if (prev.find(s => s.plantId === plantId)) return prev;
      const plant = plants.find(p => p.id === plantId) || customPlants.find(p => p.id === plantId);
      if (!plant) return prev;
      return [...prev, {
        plantId,
        collectedAt: new Date().toISOString(),
        currentStage: 0,
        unlocked: plant.stages.map((_, i) => i === 0),
      }];
    });
  }, [customPlants]);

  const growSeed = useCallback((plantId: string) => {
    setCollectedSeeds(prev => prev.map(s => {
      if (s.plantId !== plantId) return s;
      const plant = plants.find(p => p.id === plantId) || customPlants.find(p => p.id === plantId);
      if (!plant || s.currentStage >= plant.stages.length - 1) return s;
      const next = s.currentStage + 1;
      const unlocked = [...s.unlocked];
      unlocked[next] = true;
      return { ...s, currentStage: next, unlocked };
    }));
  }, [customPlants]);

  const incrementQuiz = useCallback(() => setQuizCount(c => c + 1), []);
  const incrementGame = useCallback(() => setGameCount(c => c + 1), []);
  const getSeed = useCallback((plantId: string) => collectedSeeds.find(s => s.plantId === plantId), [collectedSeeds]);

  return (
    <SeedVerseContext.Provider value={{
      collectedSeeds, customPlants, quizCount, gameCount,
      collectSeed, addCustomPlant, growSeed, incrementQuiz, incrementGame, getSeed,
      getAllPlants, getPlantById,
    }}>
      {children}
    </SeedVerseContext.Provider>
  );
};
