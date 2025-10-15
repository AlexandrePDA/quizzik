import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../constants/theme';
import { PREMIUM_BENEFITS, PREMIUM_PRICE } from '../constants/premium';
import { usePremiumStore } from '../store/premiumStore';

type PremiumScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Premium'>;
};

export const PremiumScreen: React.FC<PremiumScreenProps> = ({ navigation }) => {
  const { isPremium, setPremium } = usePremiumStore();

  const handlePurchase = async () => {
    // TODO: Intégrer le vrai système de paiement (RevenueCat ou IAP)
    // Pour l'instant, c'est un mock pour tester
    Alert.alert(
      'Acheter Premium',
      `Voulez-vous débloquer toutes les fonctionnalités pour ${PREMIUM_PRICE} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Acheter (MOCK)',
          onPress: async () => {
            await setPremium(true);
            Alert.alert('Succès !', 'Vous êtes maintenant Premium ! 🎉', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          },
        },
      ]
    );
  };

  const handleRestore = async () => {
    // TODO: Restaurer les achats via le store (Apple/Google)
    Alert.alert('Restauration', 'Fonctionnalité à implémenter avec le vrai système de paiement');
  };

  const handleDebugToggle = async () => {
    // Pour tester : basculer entre gratuit et premium
    await setPremium(!isPremium);
    Alert.alert('Debug', `Statut changé : ${!isPremium ? 'Premium' : 'Gratuit'}`);
  };

  if (isPremium) {
    return (
      <LinearGradient colors={theme.colors.gradientVinyl} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.premiumBadge}>💎 PREMIUM</Text>
          <Text style={styles.title}>Vous êtes Premium !</Text>
          <Text style={styles.subtitle}>
            Merci de votre soutien ! Profitez de toutes les fonctionnalités.
          </Text>

          <View style={styles.benefitsContainer}>
            {PREMIUM_BENEFITS.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>

          {/* Bouton DEBUG - À retirer en production */}
          <TouchableOpacity style={styles.debugButton} onPress={handleDebugToggle}>
            <Text style={styles.debugButtonText}>🔧 DEBUG: Repasser Gratuit</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={theme.colors.gradientVinyl} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.emoji}>💎</Text>
        <Text style={styles.title}>Passez Premium</Text>
        <Text style={styles.subtitle}>
          Débloquez toutes les fonctionnalités et soutenez le développement !
        </Text>

        <View style={styles.benefitsContainer}>
          {PREMIUM_BENEFITS.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Achat unique</Text>
          <Text style={styles.price}>{PREMIUM_PRICE}</Text>
          <Text style={styles.priceSubtext}>Pas d'abonnement • À vous pour toujours</Text>
        </View>

        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <LinearGradient
            colors={theme.colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.purchaseGradient}
          >
            <Text style={styles.purchaseButtonText}>🎵 Débloquer Premium</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreButtonText}>Restaurer mes achats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>

        {/* Bouton DEBUG - À retirer en production */}
        <TouchableOpacity style={styles.debugButton} onPress={handleDebugToggle}>
          <Text style={styles.debugButtonText}>🔧 DEBUG: Activer Premium (test)</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
  },
  premiumBadge: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: theme.borderRadius.large,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  benefitEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  checkmark: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  price: {
    fontSize: 48,
    fontWeight: '900',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  priceSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  purchaseButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  purchaseGradient: {
    padding: 20,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  restoreButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  debugButton: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: theme.borderRadius.medium,
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 0, 0.5)',
  },
  debugButtonText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '700',
  },
});
