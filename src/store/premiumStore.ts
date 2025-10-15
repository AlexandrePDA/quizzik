import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREMIUM_FEATURES } from '../constants/premium';

interface PremiumState {
  isPremium: boolean;
  picksPerPlayer: number; // Pour les utilisateurs premium qui choisissent
  
  // Actions
  setPremium: (value: boolean) => void;
  setPicksPerPlayer: (value: number) => void;
  loadPremiumStatus: () => Promise<void>;
  
  // Helpers
  getMaxPlayers: () => number;
  getPicksPerPlayer: () => number;
  getMinPicksPerPlayer: () => number;
  getMaxPicksPerPlayer: () => number;
  canAccessHistory: () => boolean;
  canAccessStats: () => boolean;
  canAccessThemes: () => boolean;
}

const PREMIUM_STORAGE_KEY = '@quizzik_premium';

export const usePremiumStore = create<PremiumState>((set, get) => ({
  isPremium: false,
  picksPerPlayer: 3, // Par défaut 3 titres

  setPremium: async (value: boolean) => {
    set({ isPremium: value });
    await AsyncStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(value));
  },

  setPicksPerPlayer: (value: number) => {
    set({ picksPerPlayer: value });
  },

  loadPremiumStatus: async () => {
    try {
      const stored = await AsyncStorage.getItem(PREMIUM_STORAGE_KEY);
      if (stored) {
        set({ isPremium: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  },

  // Helper methods
  getMaxPlayers: () => {
    const { isPremium } = get();
    return isPremium ? PREMIUM_FEATURES.PREMIUM.maxPlayers : PREMIUM_FEATURES.FREE.maxPlayers;
  },

  getPicksPerPlayer: () => {
    const { isPremium, picksPerPlayer } = get();
    if (isPremium) {
      // Les premium peuvent choisir entre 3 et 5
      return picksPerPlayer;
    }
    // Les gratuits ont toujours 3
    return PREMIUM_FEATURES.FREE.picksPerPlayer;
  },

  getMinPicksPerPlayer: () => {
    const { isPremium } = get();
    return isPremium ? PREMIUM_FEATURES.PREMIUM.minPicksPerPlayer : PREMIUM_FEATURES.FREE.picksPerPlayer;
  },

  getMaxPicksPerPlayer: () => {
    const { isPremium } = get();
    return isPremium ? PREMIUM_FEATURES.PREMIUM.maxPicksPerPlayer : PREMIUM_FEATURES.FREE.picksPerPlayer;
  },

  canAccessHistory: () => {
    const { isPremium } = get();
    return isPremium ? PREMIUM_FEATURES.PREMIUM.hasHistory : PREMIUM_FEATURES.FREE.hasHistory;
  },

  canAccessStats: () => {
    const { isPremium } = get();
    return isPremium ? PREMIUM_FEATURES.PREMIUM.hasStats : PREMIUM_FEATURES.FREE.hasStats;
  },

  canAccessThemes: () => {
    const { isPremium } = get();
    return isPremium ? PREMIUM_FEATURES.PREMIUM.hasThemes : PREMIUM_FEATURES.FREE.hasThemes;
  },
}));
