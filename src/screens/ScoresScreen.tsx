import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from "../store/gameStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { storage } from "../services/storage";
import { GameResult } from "../types";
import { theme } from "../constants/theme";

type ScoresScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Scores">;
};

export const ScoresScreen: React.FC<ScoresScreenProps> = ({ navigation }) => {
  const { game, resetGame } = useGameStore();

  // Calculate total scores
  const scores = game
    ? game.players.map((player) => {
        let totalPoints = 0;

        game.rounds.forEach((round) => {
          const points = round.pointsAwarded.find(
            (p) => p.playerId === player.id
          );
          if (points) {
            totalPoints += points.delta;
          }
        });

        return {
          player,
          points: totalPoints,
        };
      })
    : [];

  // Sort by points descending
  scores.sort((a, b) => b.points - a.points);

  // Save result to history on mount (only for finished games)
  useEffect(() => {
    if (!game || game.status !== "finished" || scores.length === 0) {
      return;
    }

    const saveResult = async () => {
      // Check if already saved to avoid duplicates
      const history = await storage.getGameHistory();
      const alreadySaved = history.some((h) => h.id === game.id);

      if (alreadySaved) {
        return;
      }

      const result: GameResult = {
        id: game.id,
        date: Date.now(),
        players: scores.map((s) => ({
          name: s.player.name,
          score: s.points,
          color: s.player.color,
        })),
      };

      await storage.saveGameResult(result);
    };
    saveResult();
  }, [game?.id, game?.status, scores.length]);

  if (!game) {
    return null;
  }

  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate("Home");
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  return (
    <LinearGradient
      colors={theme.colors.gradientVinyl}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.title}>CLASSEMENT</Text>
        <LinearGradient
          colors={[theme.colors.tertiary, theme.colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titleUnderline}
        />
      </View>

      <FlatList
        data={scores}
        keyExtractor={(item) => item.player.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={[
            styles.scoreItem,
            index === 0 && styles.firstPlace,
            index === 1 && styles.secondPlace,
            index === 2 && styles.thirdPlace,
          ]}>
            <View style={styles.rankContainer}>
              <Text style={[
                styles.rank,
                index < 3 && styles.rankMedal
              ]}>
                {getMedalEmoji(index)}
              </Text>
            </View>
            <View
              style={[styles.colorDot, { backgroundColor: item.player.color }]}
            />
            <Text style={styles.playerName}>{item.player.name}</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.points}>{item.points}</Text>
              <Text style={styles.pointsLabel}>pts</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.playAgainButton}
        onPress={handlePlayAgain}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playAgainGradient}
        >
          <Text style={styles.playAgainButtonText}>🎵 Rejouer</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  trophy: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: theme.colors.text,
    textAlign: "center",
    letterSpacing: 3,
    marginBottom: 10,
  },
  titleUnderline: {
    width: 100,
    height: 3,
    borderRadius: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: theme.borderRadius.xl,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.small,
  },
  firstPlace: {
    borderWidth: 3,
    borderColor: theme.colors.tertiary,
    backgroundColor: theme.colors.cardElevated,
    ...theme.shadows.large,
  },
  secondPlace: {
    borderWidth: 3,
    borderColor: '#C0C0C0',
    backgroundColor: theme.colors.cardElevated,
  },
  thirdPlace: {
    borderWidth: 3,
    borderColor: '#CD7F32',
    backgroundColor: theme.colors.cardElevated,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  rankMedal: {
    fontSize: 32,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  playerName: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.accent,
    letterSpacing: 1,
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
    letterSpacing: 1,
  },
  playAgainButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 30,
    ...theme.shadows.medium,
  },
  playAgainGradient: {
    padding: 20,
    alignItems: "center",
  },
  playAgainButtonText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
});
