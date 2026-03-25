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

interface SeedCardWithNew extends SeedCard {
  isNew?: boolean;
}

export interface GardenPlot {
  id: number;
  plantId: string | null;
  growthProgress: number;
  waterLevel: number;
  fertilized: boolean;
  lastWatered: number;
}

interface SeedVerseState {
  collectedSeeds: SeedCardWithNew[];
  customPlants: CustomPlant[];
  quizCount: number;
  gameCount: number;
  gardenPlots: GardenPlot[];
  collectSeed: (plantId: string) => void;
  addCustomPlant: (plant: CustomPlant) => void;
  growSeed: (plantId: string) => void;
  incrementQuiz: () => void;
  incrementGame: () => void;
  getSeed: (plantId: string) => SeedCardWithNew | undefined;
  getAllPlants: () => Plant[];
  getPlantById: (id: string) => Plant | CustomPlant | undefined;
  markSeedViewed: (plantId: string) => void;
  setGardenPlots: React.Dispatch<React.SetStateAction<GardenPlot[]>>;
  waterPlot: (plotId: number) => void;
  fertilizePlot: (plotId: number) => void;
  plantSeedInPlot: (plotId: number, plantId: string) => void;
  removePlotPlant: (plotId: number) => void;
}

const SeedVerseContext = createContext<SeedVerseState | null>(null);

export const useSeedVerse = () => {
  const ctx = useContext(SeedVerseContext);
  if (!ctx) throw new Error('useSeedVerse must be used within SeedVerseProvider');
  return ctx;
};

const createInitialPlots = (): GardenPlot[] =>
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    plantId: null,
    growthProgress: 0,
    waterLevel: 50,
    fertilized: false,
    lastWatered: Date.now(),
  }));

export const SeedVerseProvider = ({ children }: { children: ReactNode }) => {
  const [collectedSeeds, setCollectedSeeds] = useState<SeedCardWithNew[]>([]);
  const [customPlants, setCustomPlants] = useState<CustomPlant[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [gardenPlots, setGardenPlots] = useState<GardenPlot[]>(createInitialPlots);

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
    setCollectedSeeds(prev => {
      if (prev.find(s => s.plantId === plant.id)) return prev;
      return [...prev, {
        plantId: plant.id,
        collectedAt: new Date().toISOString(),
        currentStage: 0,
        unlocked: plant.stages.map((_, i) => i === 0),
        isNew: true,
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
        isNew: true,
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

  const markSeedViewed = useCallback((plantId: string) => {
    setCollectedSeeds(prev => prev.map(s =>
      s.plantId === plantId ? { ...s, isNew: false } : s
    ));
  }, []);

  const waterPlot = useCallback((plotId: number) => {
    setGardenPlots(prev => prev.map(p =>
      p.id === plotId ? { ...p, waterLevel: Math.min(100, p.waterLevel + 30), lastWatered: Date.now() } : p
    ));
  }, []);

  const fertilizePlot = useCallback((plotId: number) => {
    setGardenPlots(prev => prev.map(p =>
      p.id === plotId ? { ...p, fertilized: true } : p
    ));
    setTimeout(() => {
      setGardenPlots(prev => prev.map(p =>
        p.id === plotId ? { ...p, fertilized: false } : p
      ));
    }, 30000);
  }, []);

  const plantSeedInPlot = useCallback((plotId: number, plantId: string) => {
    setGardenPlots(prev => prev.map(p =>
      p.id === plotId ? { ...p, plantId, growthProgress: 0, waterLevel: 60, fertilized: false } : p
    ));
  }, []);

  const removePlotPlant = useCallback((plotId: number) => {
    setGardenPlots(prev => prev.map(p =>
      p.id === plotId ? { ...p, plantId: null, growthProgress: 0, waterLevel: 50, fertilized: false } : p
    ));
  }, []);

  const incrementQuiz = useCallback(() => setQuizCount(c => c + 1), []);
  const incrementGame = useCallback(() => setGameCount(c => c + 1), []);
  const getSeed = useCallback((plantId: string) => collectedSeeds.find(s => s.plantId === plantId), [collectedSeeds]);

  return (
    <SeedVerseContext.Provider value={{
      collectedSeeds, customPlants, quizCount, gameCount, gardenPlots,
      collectSeed, addCustomPlant, growSeed, incrementQuiz, incrementGame, getSeed,
      getAllPlants, getPlantById, markSeedViewed,
      setGardenPlots, waterPlot, fertilizePlot, plantSeedInPlot, removePlotPlant,
    }}>
      {children}
    </SeedVerseContext.Provider>
  );
};
