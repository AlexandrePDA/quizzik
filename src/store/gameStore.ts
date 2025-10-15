import { create } from 'zustand';
import { Game, Player, TrackPick, Vote, Round } from '../types';
import { storage } from '../services/storage';

interface GameState {
  game: Game | null;
  
  // Actions
  createGame: () => void;
  addPlayer: (name: string, color?: string) => void;
  removePlayer: (playerId: string) => void;
  addTrackPick: (ownerId: string, track: Omit<TrackPick, 'id' | 'ownerId'>) => void;
  removeTrackPick: (pickId: string) => void;
  startGame: () => void;
  submitVote: (voterId: string, targetPlayerId: string) => void;
  revealRound: () => void;
  nextRound: () => void;
  resetGame: () => void;
  loadGame: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  game: null,

  createGame: () => {
    const newGame: Game = {
      id: Date.now().toString(),
      players: [],
      picks: [],
      rounds: [],
      settings: {
        picksPerPlayer: 3,
        premiumEnabled: false,
      },
      status: 'setup',
      currentRoundIndex: 0,
    };
    set({ game: newGame });
    storage.saveGame(newGame);
  },

  addPlayer: (name: string, color?: string) => {
    const { game } = get();
    if (!game) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      color: color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };

    const updatedGame = {
      ...game,
      players: [...game.players, newPlayer],
    };

    set({ game: updatedGame });
    storage.saveGame(updatedGame);
  },

  removePlayer: (playerId: string) => {
    const { game } = get();
    if (!game) return;

    const updatedGame = {
      ...game,
      players: game.players.filter(p => p.id !== playerId),
      picks: game.picks.filter(p => p.ownerId !== playerId),
    };

    set({ game: updatedGame });
    storage.saveGame(updatedGame);
  },

  addTrackPick: (ownerId: string, track: Omit<TrackPick, 'id' | 'ownerId'>) => {
    const { game } = get();
    if (!game) return;

    const playerPicks = game.picks.filter(p => p.ownerId === ownerId);
    if (playerPicks.length >= game.settings.picksPerPlayer) return;

    const newPick: TrackPick = {
      ...track,
      id: Date.now().toString(),
      ownerId,
    };

    const updatedGame = {
      ...game,
      picks: [...game.picks, newPick],
    };

    set({ game: updatedGame });
    storage.saveGame(updatedGame);
  },

  removeTrackPick: (pickId: string) => {
    const { game } = get();
    if (!game) return;

    const updatedGame = {
      ...game,
      picks: game.picks.filter(p => p.id !== pickId),
    };

    set({ game: updatedGame });
    storage.saveGame(updatedGame);
  },

  startGame: () => {
    const { game } = get();
    if (!game) return;

    // Shuffle picks
    const shuffledPicks = [...game.picks].sort(() => Math.random() - 0.5);

    // Create first round
    const firstRound: Round = {
      id: Date.now().toString(),
      trackPickId: shuffledPicks[0].id,
      votes: [],
      pointsAwarded: [],
      playedAt: Date.now(),
    };

    const updatedGame = {
      ...game,
      picks: shuffledPicks,
      status: 'playing' as const,
      currentRoundIndex: 0,
      rounds: [firstRound],
    };

    set({ game: updatedGame });
    storage.saveGame(updatedGame);
  },

  submitVote: (voterId: string, targetPlayerId: string) => {
    const { game } = get();
    if (!game || game.status !== 'playing') return;

    const currentRound = game.rounds[game.currentRoundIndex];
    if (!currentRound) return;

    // Check if voter already voted
    const existingVoteIndex = currentRound.votes.findIndex(v => v.voterId === voterId);
    
    let updatedVotes: Vote[];
    if (existingVoteIndex >= 0) {
      updatedVotes = [...currentRound.votes];
      updatedVotes[existingVoteIndex] = { voterId, targetPlayerId };
    } else {
      updatedVotes = [...currentRound.votes, { voterId, targetPlayerId }];
    }

    const updatedRounds = [...game.rounds];
    updatedRounds[game.currentRoundIndex] = {
      ...currentRound,
      votes: updatedVotes,
    };

    const updatedGame = {
      ...game,
      rounds: updatedRounds,
    };

    set({ game: updatedGame });
    storage.saveGame(updatedGame);
  },

  revealRound: () => {
    const { game } = get();
    if (!game || game.status !== 'playing') return;

    const currentRound = game.rounds[game.currentRoundIndex];
    if (!currentRound || currentRound.revealedOwnerId) return;

    const currentTrack = game.picks[game.currentRoundIndex];
    const ownerId = currentTrack.ownerId;

    // Calculate points - Nouveau système type "loup-garou"
    const pointsAwarded: Array<{ playerId: string; delta: number }> = [];
    
    // 1. Chaque joueur qui devine correctement gagne 1 point
    const correctVoters = currentRound.votes.filter(v => v.targetPlayerId === ownerId);
    correctVoters.forEach(v => {
      pointsAwarded.push({ playerId: v.voterId, delta: 1 });
    });

    // 2. Le propriétaire gagne 2 points SEULEMENT si PERSONNE ne l'a démasqué (bluff parfait)
    if (correctVoters.length === 0) {
      pointsAwarded.push({ playerId: ownerId, delta: 2 });
    }

    const updatedRounds = [...game.rounds];
    updatedRounds[game.currentRoundIndex] = {
      ...currentRound,
      revealedOwnerId: ownerId,
      pointsAwarded,
    };

    const updatedGame = {
      ...game,
      rounds: updatedRounds,
    };

    set({ game: updatedGame });
    storage.saveGame(updatedGame);
  },

  nextRound: () => {
    const { game } = get();
    if (!game || game.status !== 'playing') return;

    const nextIndex = game.currentRoundIndex + 1;

    if (nextIndex >= game.picks.length) {
      // Game finished
      const updatedGame = {
        ...game,
        status: 'finished' as const,
      };
      set({ game: updatedGame });
      storage.saveGame(updatedGame);
      return;
    }

    // Create new round
    const newRound: Round = {
      id: Date.now().toString(),
      trackPickId: game.picks[nextIndex].id,
      votes: [],
      pointsAwarded: [],
      playedAt: Date.now(),
    };

    const updatedGame = {
      ...game,
      currentRoundIndex: nextIndex,
      rounds: [...game.rounds, newRound],
    };

    set({ game: updatedGame });
    storage.saveGame(updatedGame);
  },

  resetGame: () => {
    set({ game: null });
    storage.clearGame();
  },

  loadGame: async () => {
    const savedGame = await storage.loadGame();
    if (savedGame) {
      set({ game: savedGame });
    }
  },
}));
