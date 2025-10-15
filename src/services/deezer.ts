import { DeezerSearchResponse, DeezerTrack } from '../types';

const DEEZER_API_BASE = 'https://api.deezer.com';
const CORS_PROXY = 'https://corsproxy.io/?'; // Fallback si CORS pose problème

export const deezerService = {
  searchTracks: async (query: string, limit: number = 20): Promise<DeezerTrack[]> => {
    try {
      const url = `${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Deezer API error');
      }

      const data: DeezerSearchResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Deezer search error:', error);
      throw error;
    }
  },

  getTrackById: async (trackId: string): Promise<DeezerTrack | null> => {
    try {
      const url = `${DEEZER_API_BASE}/track/${trackId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Deezer API error');
      }

      const data: DeezerTrack = await response.json();
      return data;
    } catch (error) {
      console.error('Deezer get track error:', error);
      return null;
    }
  },
};
