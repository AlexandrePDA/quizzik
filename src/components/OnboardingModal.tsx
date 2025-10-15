import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 48; // padding de 24 de chaque côté

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
}

const slides = [
  {
    emoji: '🎵',
    title: 'Bienvenue sur Quizzik',
    description: 'Le blind test musical nouvelle génération avec enquête !',
  },
  {
    emoji: '👥',
    title: 'Ajoutez les joueurs',
    description: 'Minimum 2 joueurs. Le jeu se joue sur un seul téléphone qui passe de main en main.',
  },
  {
    emoji: '🎼',
    title: 'Choisissez vos titres',
    description: 'Chaque joueur sélectionne 3 morceaux secrets. Personne ne doit voir les choix des autres !',
  },
  {
    emoji: '🔍',
    title: 'Écoutez et enquêtez',
    description: 'Un titre est joué au hasard. Discutez et essayez de deviner à qui il appartient.',
  },
  {
    emoji: '🗳️',
    title: 'Votez',
    description: 'Chaque joueur vote pour désigner le propriétaire du titre. Ceux qui trouvent gagnent 1 point !',
  },
  {
    emoji: '🏆',
    title: 'Gagnez des points',
    description: 'Si personne ne trouve, c\'est le propriétaire qui gagne 1 point. Le meilleur gagne !',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 112));
    setCurrentSlide(slideIndex);
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onClose();
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slideContainer}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.flatListWrapper}>
            <FlatList
              ref={flatListRef}
              data={slides}
              renderItem={renderSlide}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
              style={styles.flatList}
            />
          </View>

          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {currentSlide === slides.length - 1 && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleClose}
            >
              <Text style={styles.startButtonText}>Commencer 🚀</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.large,
    height: 500,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  flatListWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  flatList: {
    flex: 1,
  },
  slideContainer: {
    width: width - 112,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  emoji: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textMuted,
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  startButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
