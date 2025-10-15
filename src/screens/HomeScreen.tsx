import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGameStore } from "../store/gameStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { theme } from "../constants/theme";
import { OnboardingModal } from "../components/OnboardingModal";
import { storage } from "../services/storage";
import { GAME_CONSTANTS, GAME_STATUS } from "../constants/game";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { game, createGame, loadGame } = useGameStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const spinValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGame();
    checkOnboarding();
    
    // Animation de rotation du vinyle
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: GAME_CONSTANTS.VINYL_ROTATION_DURATION,
        useNativeDriver: true,
      })
    ).start();
  }, [loadGame, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

  const handleCreateGame = useCallback(() => {
    createGame();
    navigation.navigate("AddPlayers");
  }, [createGame, navigation]);

  const handleContinueGame = useCallback(() => {
    if (game) {
      if (game.status === GAME_STATUS.SETUP) {
        navigation.navigate("AddPlayers");
      } else if (game.status === GAME_STATUS.ADDING_PICKS) {
        navigation.navigate("AddPicks");
      } else if (game.status === GAME_STATUS.PLAYING) {
        navigation.navigate("Play");
      } else if (game.status === GAME_STATUS.FINISHED) {
        navigation.navigate("Scores");
      }
    }
  }, [game, navigation]);

  return (
    <LinearGradient
      colors={theme.colors.gradientVinyl}
      style={styles.container}
    >
      {/* Vinyl decorative circles */}
      <View style={styles.vinylCircle1} />
      <View style={styles.vinylCircle2} />

      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setShowOnboarding(true)}
      >
        <Text style={styles.infoButtonText}>ℹ️</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Animated.View style={[styles.vinylIcon, { transform: [{ rotate: spin }] }]}>
          <View style={styles.vinylGroove1} />
          <View style={styles.vinylGroove2} />
          <View style={styles.vinylCenter} />
          <View style={styles.vinylDot} />
        </Animated.View>

        <Text style={styles.title}>QUIZZIK</Text>
        <LinearGradient
          colors={[theme.colors.accent, theme.colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.subtitleGradient}
        >
          <Text style={styles.subtitle}>
            Sauras-tu deviner qui a choisi le titre ?
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateGame}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>🎵 NOUVELLE PARTIE</Text>
          </LinearGradient>
        </TouchableOpacity>

        {game && game.status !== GAME_STATUS.SETUP && (
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={handleContinueGame}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonTextSecondary}>▶️ Continuer</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate("History")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonTextSecondary}>📜 Historique</Text>
        </TouchableOpacity>
      </View>

      <OnboardingModal
        visible={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  vinylCircle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.colors.secondary,
    opacity: 0.1,
  },
  vinylCircle2: {
    position: "absolute",
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: theme.colors.primary,
    opacity: 0.08,
  },
  infoButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.small,
  },
  infoButtonText: {
    fontSize: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  vinylIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    ...theme.shadows.large,
  },
  vinylGroove1: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: theme.colors.vinylGroove,
  },
  vinylGroove2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.colors.vinylGroove,
  },
  vinylCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  vinylDot: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
  },
  title: {
    fontSize: theme.typography.hero,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 12,
    letterSpacing: 4,
  },
  subtitleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.large,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.background,
    letterSpacing: 3,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 340,
    gap: 16,
  },
  button: {
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  buttonGradient: {
    padding: 22,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.small,
  },
  buttonTextSecondary: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
