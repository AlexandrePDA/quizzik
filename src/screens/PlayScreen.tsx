import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Audio } from 'expo-av';
import { theme } from '../constants/theme';

type PlayScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Play'>;
};

export const PlayScreen: React.FC<PlayScreenProps> = ({ navigation }) => {
  const { game, submitVote, revealRound, nextRound } = useGameStore();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [votingPhase, setVotingPhase] = useState<'listening' | 'voting' | 'revealed'>('listening');

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (!game || game.status !== 'playing') {
    return null;
  }

  const currentTrack = game.picks[game.currentRoundIndex];
  const currentRound = game.rounds[game.currentRoundIndex];
  const isRevealed = currentRound?.revealedOwnerId !== undefined;

  const playAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentTrack.previewUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de lire le titre');
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const handleStartVoting = () => {
    setVotingPhase('voting');
    setCurrentVoterIndex(0);
    setSelectedPlayerId(null);
  };

  const handleVote = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  const handleConfirmVote = () => {
    if (!selectedPlayerId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un joueur');
      return;
    }

    const currentVoter = game.players[currentVoterIndex];
    submitVote(currentVoter.id, selectedPlayerId);

    // Move to next voter
    if (currentVoterIndex + 1 < game.players.length) {
      setCurrentVoterIndex(currentVoterIndex + 1);
      setSelectedPlayerId(null);
    } else {
      // All players voted, reveal
      setVotingPhase('revealed');
      revealRound();
    }
  };

  const handleNext = () => {
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setSelectedPlayerId(null);
    setVotingPhase('listening');
    setCurrentVoterIndex(0);

    if (game.currentRoundIndex + 1 >= game.picks.length) {
      // Last round finished, call nextRound to set status to 'finished'
      nextRound();
      navigation.navigate('Scores');
    } else {
      nextRound();
    }
  };

  const owner = game.players.find(p => p.id === currentTrack.ownerId);
  const currentVoter = votingPhase === 'voting' ? game.players[currentVoterIndex] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.roundNumber}>
        Titre {game.currentRoundIndex + 1} / {game.picks.length}
      </Text>

      <View style={styles.trackContainer}>
        {currentTrack.albumCover && (
          <Image source={{ uri: currentTrack.albumCover }} style={styles.albumCover} />
        )}
        
        {votingPhase === 'revealed' ? (
          <>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
            <Text style={styles.ownerText}>Titre de : {owner?.name}</Text>
          </>
        ) : (
          <Text style={styles.hiddenText}>🎵 Titre mystère 🎵</Text>
        )}
      </View>

      <View style={styles.controls}>
        {!isPlaying ? (
          <TouchableOpacity style={styles.playButton} onPress={playAudio}>
            <Text style={styles.playButtonText}>▶️ Jouer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.playButton} onPress={pauseAudio}>
            <Text style={styles.playButtonText}>⏸ Pause</Text>
          </TouchableOpacity>
        )}
      </View>

      {votingPhase === 'listening' && (
        <TouchableOpacity style={styles.startVoteButton} onPress={handleStartVoting}>
          <Text style={styles.startVoteButtonText}>Commencer les votes</Text>
        </TouchableOpacity>
      )}

      {votingPhase === 'voting' && currentVoter && (
        <>
          <Text style={styles.voteTitle}>
            {currentVoter.name}, qui a choisi ce titre ?
          </Text>
          <Text style={styles.voteSubtitle}>
            Vote {currentVoterIndex + 1} / {game.players.length}
          </Text>
          <FlatList
            data={game.players}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.playerGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.playerButton,
                  selectedPlayerId === item.id && styles.playerButtonSelected,
                ]}
                onPress={() => handleVote(item.id)}
              >
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.playerButtonText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity 
            style={[styles.confirmButton, !selectedPlayerId && styles.confirmButtonDisabled]} 
            onPress={handleConfirmVote}
            disabled={!selectedPlayerId}
          >
            <Text style={styles.confirmButtonText}>
              {currentVoterIndex + 1 < game.players.length ? 'Valider et passer au suivant' : 'Valider et révéler'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {votingPhase === 'revealed' && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {game.currentRoundIndex + 1 >= game.picks.length ? 'Voir les scores' : 'Titre suivant'}
          </Text>
        </TouchableOpacity>
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
  roundNumber: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  trackContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  albumCover: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.large,
    marginBottom: 20,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  ownerText: {
    fontSize: 20,
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  hiddenText: {
    fontSize: 24,
    color: theme.colors.text,
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: theme.borderRadius.large,
    ...theme.shadows.medium,
  },
  playButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  voteTitle: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  voteSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 15,
    textAlign: 'center',
  },
  startVoteButton: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    marginTop: 20,
    ...theme.shadows.medium,
  },
  startVoteButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    marginTop: 20,
    ...theme.shadows.medium,
  },
  confirmButtonDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
  confirmButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  playerGrid: {
    justifyContent: 'space-between',
  },
  playerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: theme.borderRadius.medium,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  playerButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cardHover,
  },
  playerButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  revealButton: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    marginTop: 20,
    ...theme.shadows.medium,
  },
  revealButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    marginTop: 20,
    ...theme.shadows.medium,
  },
  nextButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
