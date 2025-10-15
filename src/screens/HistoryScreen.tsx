import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { storage } from '../services/storage';
import { GameResult } from '../types';
import { theme } from '../constants/theme';

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await storage.getGameHistory();
    setHistory(data);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des parties</Text>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune partie jouée</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.gameCard}>
              <Text style={styles.gameDate}>
                Partie {index + 1} - {formatDate(item.date)}
              </Text>
              <View style={styles.playersContainer}>
                {item.players.map((player, idx) => (
                  <View key={idx} style={styles.playerRow}>
                    <View style={styles.playerInfo}>
                      <View style={[styles.colorDot, { backgroundColor: player.color || '#666' }]} />
                      <Text style={styles.playerName}>{player.name}</Text>
                    </View>
                    <Text style={styles.playerScore}>{player.score} pts</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 40,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  gameCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.large,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  gameDate: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 15,
  },
  playersContainer: {
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  playerName: {
    fontSize: 16,
    color: theme.colors.text,
  },
  playerScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
