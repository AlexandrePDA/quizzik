import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../constants/theme';
import { GAME_CONSTANTS } from '../constants/game';
import { usePremiumStore } from '../store/premiumStore';

type AddPlayersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddPlayers'>;
};

export const AddPlayersScreen: React.FC<AddPlayersScreenProps> = ({ navigation }) => {
  const { game, addPlayer, removePlayer } = useGameStore();
  const { getMaxPlayers, isPremium } = usePremiumStore();
  const [playerName, setPlayerName] = useState('');

  const maxPlayers = getMaxPlayers();

  const handleAddPlayer = useCallback(() => {
    if (!playerName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom');
      return;
    }

    // Vérifier la limite de joueurs
    if (game && game.players.length >= maxPlayers) {
      if (!isPremium) {
        // Utilisateur gratuit : proposer Premium
        Alert.alert(
          'Limite atteinte',
          `Version gratuite limitée à ${maxPlayers} joueurs.\n\nPassez Premium pour jouer jusqu'à 10 joueurs !`,
          [
            { text: 'Plus tard', style: 'cancel' },
            { text: 'Voir Premium', onPress: () => navigation.navigate('Premium') }
          ]
        );
      } else {
        // Utilisateur premium à 10 joueurs : juste informer
        Alert.alert('Limite atteinte', `Maximum ${maxPlayers} joueurs pour une partie.`);
      }
      return;
    }

    addPlayer(playerName.trim());
    setPlayerName('');
  }, [playerName, addPlayer, game, maxPlayers, navigation]);

  const handleContinue = useCallback(() => {
    if (!game || game.players.length < GAME_CONSTANTS.MIN_PLAYERS) {
      Alert.alert('Erreur', `Il faut au moins ${GAME_CONSTANTS.MIN_PLAYERS} joueurs`);
      return;
    }

    // Si premium, aller sur l'écran de choix du nombre de titres
    // Sinon, aller directement sur AddPicks
    if (isPremium) {
      navigation.navigate('PicksSettings');
    } else {
      navigation.navigate('AddPicks');
    }
  }, [game, isPremium, navigation]);

  return (
    <LinearGradient
      colors={theme.colors.gradientVinyl}
      style={styles.container}
    >
      <Text style={styles.title}>👥 JOUEURS</Text>
      <Text style={styles.subtitle}>
        Qui va bluffer le mieux ? (min. 3 joueurs)
      </Text>
      <Text style={styles.playerCount}>
        {game?.players.length || 0} / {maxPlayers} joueurs {!isPremium && '(Gratuit)'}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nom du joueur"
          placeholderTextColor="#666"
          value={playerName}
          onChangeText={setPlayerName}
          onSubmitEditing={handleAddPlayer}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlayer}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={game?.players || []}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.playerItem}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={styles.playerName}>{item.name}</Text>
            <TouchableOpacity onPress={() => removePlayer(item.id)}>
              <Text style={styles.removeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {game && game.players.length >= GAME_CONSTANTS.MIN_PLAYERS && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
          <LinearGradient
            colors={theme.colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continuer →</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  playerCount: {
    fontSize: 14,
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    padding: 15,
    borderRadius: theme.borderRadius.medium,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 56,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  addButtonText: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 18,
    borderRadius: theme.borderRadius.large,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.small,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  playerName: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  removeButton: {
    color: theme.colors.error,
    fontSize: 28,
    fontWeight: '700',
  },
  continueButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  continueButtonGradient: {
    padding: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
