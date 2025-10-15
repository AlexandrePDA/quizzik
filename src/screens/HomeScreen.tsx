import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../constants/theme';
import { OnboardingModal } from '../components/OnboardingModal';
import { storage } from '../services/storage';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { game, createGame, loadGame } = useGameStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadGame();
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const completed = await storage.hasCompletedOnboarding();
    if (!completed) {
      setShowOnboarding(true);
    }
  };

  const handleCloseOnboarding = async () => {
    await storage.setOnboardingCompleted();
    setShowOnboarding(false);
  };

  const handleCreateGame = () => {
    createGame();
    navigation.navigate('AddPlayers');
  };

  const handleContinueGame = () => {
    if (game) {
      if (game.status === 'setup') {
        navigation.navigate('AddPlayers');
      } else if (game.status === 'adding_picks') {
        navigation.navigate('AddPicks');
      } else if (game.status === 'playing') {
        navigation.navigate('Play');
      } else if (game.status === 'finished') {
        navigation.navigate('Scores');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.infoButton}
        onPress={() => setShowOnboarding(true)}
      >
        <Text style={styles.infoButtonText}>ℹ️</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Quizzik</Text>
      <Text style={styles.subtitle}>Blind Test Musical</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateGame}>
          <Text style={styles.buttonText}>Nouvelle Partie</Text>
        </TouchableOpacity>

        {game && (
          <TouchableOpacity style={styles.buttonSecondary} onPress={handleContinueGame}>
            <Text style={styles.buttonTextSecondary}>Continuer</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.buttonSecondary} 
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonTextSecondary}>📜 Historique</Text>
        </TouchableOpacity>
      </View>

      <OnboardingModal 
        visible={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  infoButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.small,
  },
  infoButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 60,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  buttonTextSecondary: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
