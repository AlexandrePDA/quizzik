export const GAME_CONSTANTS = {
  MIN_PLAYERS: 3,
  DEFAULT_PICKS_PER_PLAYER: 3,
  VINYL_ROTATION_DURATION: 8000,
} as const;

export const POINTS = {
  CORRECT_GUESS: 1,
  UNDETECTED_OWNER: 2,
} as const;

export const VOTING_PHASES = {
  LISTENING: 'listening',
  VOTING: 'voting',
  REVEALED: 'revealed',
} as const;

export const GAME_STATUS = {
  SETUP: 'setup',
  ADDING_PICKS: 'adding_picks',
  PLAYING: 'playing',
  FINISHED: 'finished',
} as const;
