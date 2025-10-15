export const PREMIUM_FEATURES = {
  FREE: {
    maxPlayers: 4,
    picksPerPlayer: 3,
    hasHistory: false,
    hasStats: false,
    hasThemes: false,
    maxHistoryItems: 0,
  },
  PREMIUM: {
    maxPlayers: 10,
    minPicksPerPlayer: 3,
    maxPicksPerPlayer: 5,
    hasHistory: true,
    hasStats: true,
    hasThemes: true,
    maxHistoryItems: -1, // unlimited
  },
} as const;

export const PREMIUM_PRICE = '2,99 €';

export const PREMIUM_BENEFITS = [
  {
    emoji: '👥',
    title: 'Jusqu\'à 10 joueurs',
    description: 'Invitez tous vos amis !',
  },
  {
    emoji: '🎵',
    title: '3 à 5 titres par joueur',
    description: 'Choisissez la durée de vos parties',
  },
  {
    emoji: '📜',
    title: 'Historique illimité',
    description: 'Gardez toutes vos parties',
  },
  {
    emoji: '📊',
    title: 'Statistiques avancées',
    description: 'Qui est le meilleur bluffeur ?',
  },
  {
    emoji: '🎨',
    title: 'Thèmes personnalisés',
    description: 'Personnalisez votre expérience',
  },
  {
    emoji: '💎',
    title: 'Achat unique',
    description: 'Pas d\'abonnement, c\'est à vous pour toujours',
  },
] as const;
