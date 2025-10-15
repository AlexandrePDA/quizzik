import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game, GameResult } from '../types';

const GAME_KEY = 'current_game';
const PREMIUM_KEY = 'premium_enabled';
const HISTORY_KEY = 'game_history';
const ONBOARDING_KEY = 'onboarding_completed';

export const storage = {
  saveGame: async (game: Game) => {
    try {
      await AsyncStorage.setItem(GAME_KEY, JSON.stringify(game));
    } catch (error) {
      console.error('Error saving game:', error);
    }
  },

  loadGame: async (): Promise<Game | null> => {
    try {
      const gameData = await AsyncStorage.getItem(GAME_KEY);
      if (!gameData) return null;
      return JSON.parse(gameData);
    } catch (error) {
      console.error('Error loading game:', error);
      return null;
    }
  },

  clearGame: async () => {
    try {
      await AsyncStorage.removeItem(GAME_KEY);
    } catch (error) {
      console.error('Error clearing game:', error);
    }
  },

  setPremium: async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(PREMIUM_KEY, enabled.toString());
    } catch (error) {
      console.error('Error setting premium:', error);
    }
  },

  isPremium: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(PREMIUM_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error getting premium:', error);
      return false;
    }
  },

  saveGameResult: async (result: GameResult) => {
    try {
      const historyData = await AsyncStorage.getItem(HISTORY_KEY);
      const history: GameResult[] = historyData ? JSON.parse(historyData) : [];
      
      // Add new result at the beginning
      history.unshift(result);
      
      // Keep only last 5 games
      const trimmedHistory = history.slice(0, 5);
      
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  },

  getGameHistory: async (): Promise<GameResult[]> => {
    try {
      const historyData = await AsyncStorage.getItem(HISTORY_KEY);
      const history: GameResult[] = historyData ? JSON.parse(historyData) : [];
      
      // Filter out invalid entries (games without players or scores)
      const validHistory = history.filter(game => 
        game.players && 
        game.players.length > 0 && 
        game.players.every(p => p.name && p.score !== undefined)
      );
      
      // If we filtered out invalid entries, save the cleaned history
      if (validHistory.length !== history.length) {
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(validHistory));
      }
      
      return validHistory;
    } catch (error) {
      console.error('Error getting game history:', error);
      return [];
    }
  },

  clearHistory: async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  hasCompletedOnboarding: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding:', error);
      return false;
    }
  },

  setOnboardingCompleted: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error setting onboarding:', error);
    }
  },
};
