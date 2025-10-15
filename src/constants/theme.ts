export const theme = {
  colors: {
    // Backgrounds - Dark gradient avec effet profondeur
    background: '#0A0E27', // Bleu nuit profond
    backgroundSecondary: '#1A1F3A', // Bleu nuit moyen
    card: '#252B48', // Cartes avec effet glassmorphism
    cardHover: '#2D3454',
    
    // Accents - Gradient musical vibrant
    primary: '#FF6B9D', // Rose vibrant (musique/énergie)
    primaryLight: '#FFA8C5',
    primaryDark: '#E5527D',
    
    secondary: '#C44569', // Rose profond
    accent: '#A06CD5', // Violet (créativité musicale)
    accentLight: '#C89EF5',
    
    // Gradient pour boutons principaux
    gradientStart: '#FF6B9D',
    gradientEnd: '#C44569',
    
    // Textes
    text: '#FFFFFF',
    textSecondary: '#B8C1EC', // Bleu clair doux
    textMuted: '#6C7A9B',
    
    // États
    success: '#4ECDC4', // Turquoise
    warning: '#FFE66D',
    error: '#FF6B6B',
    
    // Glassmorphism overlay
    glassOverlay: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#FF6B9D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    large: {
      shadowColor: '#C44569',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12,
    },
  },
  
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
    round: 999,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};
