export const theme = {
  colors: {
    // Backgrounds - Deep space avec vinyl vibes
    background: '#0D0221', // Violet très profond (presque noir)
    backgroundSecondary: '#1A0B2E', // Violet nuit
    backgroundTertiary: '#2D1B4E', // Violet moyen
    
    // Cards avec glassmorphism fort
    card: 'rgba(123, 44, 191, 0.15)', // Violet transparent
    cardElevated: 'rgba(123, 44, 191, 0.25)',
    cardHover: 'rgba(123, 44, 191, 0.35)',
    
    // Palette principale - Vinyl sunset
    primary: '#FF0A78', // Rose néon électrique
    primaryLight: '#FF4D9E',
    primaryDark: '#D10060',
    
    secondary: '#7B2CBF', // Violet profond (vinyl)
    secondaryLight: '#9D4EDD',
    secondaryDark: '#5A189A',
    
    accent: '#00F5FF', // Cyan néon (ondes sonores)
    accentLight: '#5FFBF1',
    accentDark: '#00D9E8',
    
    tertiary: '#FFB800', // Or (awards/scores)
    
    // Gradients signature
    gradientPrimary: ['#FF0A78', '#7B2CBF'] as const, // Rose -> Violet
    gradientSecondary: ['#7B2CBF', '#00F5FF'] as const, // Violet -> Cyan
    gradientAccent: ['#FF0A78', '#FFB800'] as const, // Rose -> Or
    gradientVinyl: ['#0D0221', '#2D1B4E', '#7B2CBF'] as const, // Background vinyl
    
    // Textes
    text: '#FFFFFF',
    textSecondary: '#C8B6FF', // Violet clair
    textMuted: '#8B7BA8',
    textNeon: '#00F5FF', // Cyan néon pour highlights
    
    // États
    success: '#00F5A0', // Vert néon
    warning: '#FFB800',
    error: '#FF0A78',
    
    // Glassmorphism avancé
    glassOverlay: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',
    glassGlow: 'rgba(123, 44, 191, 0.4)',
    
    // Vinyl effects
    vinylGroove: 'rgba(0, 0, 0, 0.3)',
    vinylShine: 'rgba(255, 255, 255, 0.1)',
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    medium: {
      shadowColor: '#FF0A78',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    large: {
      shadowColor: '#7B2CBF',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 12,
    },
    neon: {
      shadowColor: '#00F5FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 15,
      elevation: 15,
    },
  },
  
  borderRadius: {
    small: 12,
    medium: 16,
    large: 24,
    xl: 32,
    round: 999,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  typography: {
    // Tailles avec impact
    hero: 72,
    title: 48,
    heading: 32,
    subheading: 24,
    body: 18,
    caption: 14,
    small: 12,
  },
};
