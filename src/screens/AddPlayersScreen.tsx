import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../constants/theme';

type AddPlayersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddPlayers'>;
};

export const AddPlayersScreen: React.FC<AddPlayersScreenProps> = ({ navigation }) => {
  const { game, addPlayer, removePlayer } = useGameStore();
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (!playerName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom');
      return;
    }

    addPlayer(playerName.trim());
    setPlayerName('');
  };

  const handleContinue = () => {
    if (!game || game.players.length < 2) {
      Alert.alert('Erreur', 'Il faut au moins 2 joueurs');
      return;
    }

    navigation.navigate('AddPicks');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter les joueurs</Text>
      <Text style={styles.subtitle}>Minimum 2 joueurs</Text>

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

      {game && game.players.length >= 2 && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 30,
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
    width: 50,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  addButtonText: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  playerName: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 18,
  },
  removeButton: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  continueButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
