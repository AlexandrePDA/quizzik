import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/gameStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../constants/theme';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

type PlayScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Play'>;
};

export const PlayScreen: React.FC<PlayScreenProps> = ({ navigation }) => {
  const { game, submitVote, revealRound, nextRound } = useGameStore();
  const { isPlaying, play, pause } = useAudioPlayer();
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [votingPhase, setVotingPhase] = useState<'listening' | 'voting' | 'revealed'>('listening');

  const playAudio = useCallback(() => {
    if (game) {
      play(game.picks[game.currentRoundIndex].previewUrl);
    }
  }, [play, game]);

  const pauseAudio = useCallback(() => {
    pause();
  }, [pause]);

  const handleStartVoting = useCallback(() => {
    setVotingPhase('voting');
    setCurrentVoterIndex(0);
    setSelectedPlayerId(null);
  }, []);

  const handleVote = useCallback((playerId: string) => {
    setSelectedPlayerId(playerId);
  }, []);

  const handleConfirmVote = useCallback(() => {
    if (!selectedPlayerId || !game) {
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
  }, [selectedPlayerId, game, currentVoterIndex, submitVote, revealRound]);

  const handleNext = useCallback(() => {
    if (!game) return;
    
    pause();
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
  }, [pause, game, nextRound, navigation]);

  if (!game || game.status !== 'playing') {
    return null;
  }

  const currentTrack = game.picks[game.currentRoundIndex];
  const currentRound = game.rounds[game.currentRoundIndex];
  const isRevealed = currentRound?.revealedOwnerId !== undefined;
  const owner = game.players.find(p => p.id === currentTrack.ownerId);
  const currentVoter = votingPhase === 'voting' ? game.players[currentVoterIndex] : null;

  return (
    <LinearGradient
      colors={theme.colors.gradientVinyl}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.roundNumber}>
            TITRE {game.currentRoundIndex + 1} / {game.picks.length}
          </Text>
        </View>

      <View style={styles.trackContainer}>
        {currentTrack.albumCover && (
          <View style={styles.albumWrapper}>
            <Image source={{ uri: currentTrack.albumCover }} style={styles.albumCover} />
            <View style={styles.albumGlow} />
          </View>
        )}
        
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          
          {votingPhase === 'revealed' && (
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerText}>🎸 {owner?.name}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.controls}>
        {!isPlaying ? (
          <TouchableOpacity style={styles.playButton} onPress={playAudio} activeOpacity={0.8}>
            <LinearGradient
              colors={theme.colors.gradientSecondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playButtonText}>▶️ JOUER</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.playButton} onPress={pauseAudio} activeOpacity={0.8}>
            <LinearGradient
              colors={theme.colors.gradientSecondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playButtonText}>⏸ PAUSE</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {votingPhase === 'listening' && (
        <TouchableOpacity style={styles.startVoteButton} onPress={handleStartVoting} activeOpacity={0.8}>
          <LinearGradient
            colors={theme.colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startVoteGradient}
          >
            <Text style={styles.startVoteButtonText}>🗳 COMMENCER LES VOTES</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {votingPhase === 'voting' && currentVoter && (
        <>
          <View style={styles.voteHeader}>
            <Text style={styles.voteTitle}>
              {currentVoter.name}
            </Text>
            <Text style={styles.voteQuestion}>À ton avis, qui a choisi ce titre ?</Text>
            <Text style={styles.voteSubtitle}>
              Vote {currentVoterIndex + 1} / {game.players.length}
            </Text>
          </View>
          <View style={styles.playersContainer}>
            {game.players.filter(p => p.id !== currentVoter.id).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.playerButton,
                  selectedPlayerId === item.id && styles.playerButtonSelected,
                ]}
                onPress={() => handleVote(item.id)}
              >
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.playerButtonText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.confirmButton, !selectedPlayerId && styles.confirmButtonDisabled]} 
            onPress={handleConfirmVote}
            disabled={!selectedPlayerId}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={!selectedPlayerId ? ['#666', '#666'] : theme.colors.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.confirmGradient}
            >
              <Text style={styles.confirmButtonText}>
                {currentVoterIndex + 1 < game.players.length ? '✓ Valider' : '✨ Révéler'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      {votingPhase === 'revealed' && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
          <LinearGradient
            colors={theme.colors.gradientAccent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextButtonText}>
              {game.currentRoundIndex + 1 >= game.picks.length ? '🏆 Voir les scores' : '➡️ Titre suivant'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  roundNumber: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  trackContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  albumWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  albumCover: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 4,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.large,
  },
  albumGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
    opacity: 0.2,
    zIndex: -1,
  },
  trackInfo: {
    alignItems: 'center',
    width: '100%',
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  trackArtist: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  ownerBadge: {
    backgroundColor: theme.colors.cardElevated,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.round,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    marginTop: 8,
  },
  ownerText: {
    fontSize: 18,
    color: theme.colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  playButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.neon,
  },
  playButtonGradient: {
    paddingHorizontal: 50,
    paddingVertical: 18,
  },
  playButtonText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  voteHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.glassBorder,
  },
  voteTitle: {
    fontSize: 24,
    color: theme.colors.accent,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 1,
  },
  voteQuestion: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  voteSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
  },
  startVoteButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginTop: 20,
    ...theme.shadows.medium,
  },
  startVoteGradient: {
    padding: 20,
    alignItems: 'center',
  },
  startVoteButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  confirmButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginTop: 20,
    ...theme.shadows.medium,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmGradient: {
    padding: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  playersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  playerGrid: {
    justifyContent: 'space-between',
  },
  playerButton: {
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: theme.borderRadius.large,
    borderWidth: 3,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.small,
  },
  playerButtonSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.cardElevated,
    ...theme.shadows.medium,
  },
  playerButtonText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginTop: 20,
    ...theme.shadows.medium,
  },
  nextGradient: {
    padding: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
