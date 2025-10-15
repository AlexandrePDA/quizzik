import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { deezerService } from '../services/deezer';
import { DeezerTrack } from '../types';
import { theme } from '../constants/theme';

type AddPicksScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddPicks'>;
};

export const AddPicksScreen: React.FC<AddPicksScreenProps> = ({ navigation }) => {
  const { game, addTrackPick, removeTrackPick, startGame, resetGame } = useGameStore();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DeezerTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!game || !game.players.length) {
    return null;
  }

  // Safety check: reset index if out of bounds
  const safePlayerIndex = currentPlayerIndex >= game.players.length ? 0 : currentPlayerIndex;
  const currentPlayer = game.players[safePlayerIndex];
  
  if (!currentPlayer) {
    return null;
  }

  const playerPicks = game.picks.filter(p => p.ownerId === currentPlayer.id);
  const picksNeeded = game.settings.picksPerPlayer - playerPicks.length;

  const handleQuit = () => {
    Alert.alert(
      'Quitter la partie',
      'Êtes-vous sûr de vouloir abandonner ? Tous les choix seront perdus.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            resetGame();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await deezerService.searchTracks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rechercher les titres');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrack = (track: DeezerTrack) => {
    // Check if player already selected this track
    const existingPick = playerPicks.find(pick => pick.deezerTrackId === track.id.toString());
    
    if (existingPick) {
      // Désélectionner le titre
      removeTrackPick(existingPick.id);
      return;
    }

    // Vérifier si le joueur a atteint la limite
    if (playerPicks.length >= game.settings.picksPerPlayer) {
      Alert.alert('Limite atteinte', `Vous ne pouvez choisir que ${game.settings.picksPerPlayer} titres`);
      return;
    }

    addTrackPick(currentPlayer.id, {
      deezerTrackId: track.id.toString(),
      title: track.title,
      artist: track.artist.name,
      previewUrl: track.preview,
      albumCover: track.album.cover_medium,
    });

    if (playerPicks.length + 1 >= game.settings.picksPerPlayer) {
      // Move to next player
      if (currentPlayerIndex + 1 < game.players.length) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setSearchQuery('');
        setSearchResults([]);
      } else {
        // All players done
        Alert.alert('C\'est parti !', 'Tous les joueurs ont choisi leurs titres. Que le meilleur bluffeur gagne !', [
          { text: 'Lancer la partie', onPress: () => {
            startGame();
            navigation.navigate('Play');
          }}
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.quitButton} onPress={handleQuit}>
        <Text style={styles.quitButtonText}>✕ Quitter</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{currentPlayer.name}</Text>
        <Text style={styles.subtitle}>Choisis {picksNeeded} titre(s) secrets pour bluffer !</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher un titre..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {playerPicks.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Titres sélectionnés :</Text>
          {playerPicks.map((pick, index) => (
            <Text key={pick.id} style={styles.selectedTrack}>
              {index + 1}. {pick.title} - {pick.artist}
            </Text>
          ))}
        </View>
      )}

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => {
          const isAlreadySelected = playerPicks.some(pick => pick.deezerTrackId === item.id.toString());
          return (
            <TouchableOpacity 
              style={[styles.trackItem, isAlreadySelected && styles.trackItemSelected]} 
              onPress={() => handleSelectTrack(item)}
            >
              <Image source={{ uri: item.album.cover_medium }} style={styles.albumCover} />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.trackArtist} numberOfLines={1}>{item.artist.name}</Text>
              </View>
              {isAlreadySelected && (
                <Text style={styles.selectedBadge}>✓ Sélectionné</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
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
  searchButton: {
    backgroundColor: theme.colors.primary,
    width: 50,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  searchButtonText: {
    fontSize: 24,
  },
  selectedContainer: {
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  selectedTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  selectedTrack: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  list: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    padding: 12,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.small,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackArtist: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  trackItemSelected: {
    backgroundColor: theme.colors.cardElevated,
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  selectedBadge: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  quitButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.5)',
  },
  quitButtonText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '700',
  },
});
