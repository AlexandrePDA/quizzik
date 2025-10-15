import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
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
  }, [game?.id, scores.length]);

  if (!game) {
    return null;
  }

  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Classement Final 🏆</Text>

      <FlatList
        data={scores}
        keyExtractor={(item) => item.player.id}
        style={styles.list}
        renderItem={({ item, index }) => (
          <View style={[styles.scoreItem, index === 0 && styles.firstPlace]}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View
              style={[styles.colorDot, { backgroundColor: item.player.color }]}
            />
            <Text style={styles.playerName}>{item.player.name}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.playAgainButton}
        onPress={handlePlayAgain}
      >
        <Text style={styles.playAgainButtonText}>Rejouer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: theme.borderRadius.large,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  firstPlace: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.large,
  },
  rank: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    width: 40,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  playerName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
  },
  points: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  playAgainButton: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: theme.borderRadius.large,
    alignItems: "center",
    ...theme.shadows.medium,
  },
  playAgainButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
