export interface Player {
  id: string;
  name: string;
  color?: string;
}

export interface TrackPick {
  id: string;
  ownerId: string;
  deezerTrackId: string;
  title: string;
  artist: string;
  previewUrl: string;
  albumCover?: string;
}

export interface Vote {
  voterId: string;
  targetPlayerId: string;
}

export interface Round {
  id: string;
  trackPickId: string;
  votes: Vote[];
  revealedOwnerId?: string;
  pointsAwarded: Array<{ playerId: string; delta: number }>;
  playedAt: number;
}

export interface GameSettings {
  picksPerPlayer: number;
  discussionSeconds?: number;
  premiumEnabled: boolean;
}

export interface Game {
  id: string;
  players: Player[];
  picks: TrackPick[];
  rounds: Round[];
  settings: GameSettings;
  status: 'setup' | 'adding_picks' | 'playing' | 'finished';
  currentRoundIndex: number;
}

export interface DeezerTrack {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album: {
    cover_medium: string;
  };
  preview: string;
}

export interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
}

export interface GameResult {
  id: string;
  date: number;
  players: Array<{
    name: string;
    score: number;
    color?: string;
  }>;
}
