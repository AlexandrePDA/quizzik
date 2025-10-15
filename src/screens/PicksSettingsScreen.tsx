import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../constants/theme';
import { usePremiumStore } from '../store/premiumStore';
import { useGameStore } from '../store/gameStore';

type PicksSettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PicksSettings'>;
};

export const PicksSettingsScreen: React.FC<PicksSettingsScreenProps> = ({ navigation }) => {
  const { getMinPicksPerPlayer, getMaxPicksPerPlayer, setPicksPerPlayer, picksPerPlayer } = usePremiumStore();
  const { game, updateGameSettings } = useGameStore();

  const minPicks = getMinPicksPerPlayer();
  const maxPicks = getMaxPicksPerPlayer();
  const options = Array.from({ length: maxPicks - minPicks + 1 }, (_, i) => minPicks + i);

  const handleSelect = (value: number) => {
    setPicksPerPlayer(value);
    updateGameSettings(value);
    // Utiliser replace au lieu de navigate pour empêcher le retour arrière
    navigation.replace('AddPicks');
  };

  return (
    <LinearGradient colors={theme.colors.gradientVinyl} style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>🎵</Text>
        <Text style={styles.title}>Nombre de titres</Text>
        <Text style={styles.subtitle}>
          Combien de titres par joueur ?
        </Text>

        <View style={styles.optionsContainer}>
          {options.map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.option,
                picksPerPlayer === value && styles.optionSelected
              ]}
              onPress={() => handleSelect(value)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.optionNumber,
                picksPerPlayer === value && styles.optionNumberSelected
              ]}>
                {value}
              </Text>
              <Text style={[
                styles.optionLabel,
                picksPerPlayer === value && styles.optionLabelSelected
              ]}>
                {value === 3 ? 'Rapide' : value === 4 ? 'Normal' : 'Longue'}
              </Text>
              <Text style={[
                styles.optionDuration,
                picksPerPlayer === value && styles.optionDurationSelected
              ]}>
                ~{value * 2} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.hint}>
          💡 Plus de titres = parties plus longues mais plus de fun !
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: 60,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.text,
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 340,
    gap: 16,
  },
  option: {
    backgroundColor: theme.colors.card,
    padding: 24,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.glassBorder,
    ...theme.shadows.small,
  },
  optionSelected: {
    backgroundColor: theme.colors.cardElevated,
    borderColor: theme.colors.primary,
    borderWidth: 3,
    ...theme.shadows.medium,
  },
  optionNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.colors.text,
    marginBottom: 8,
  },
  optionNumberSelected: {
    color: theme.colors.primary,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: theme.colors.text,
  },
  optionDuration: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  optionDurationSelected: {
    color: theme.colors.accent,
  },
  hint: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  backButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
