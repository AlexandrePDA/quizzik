# 💎 Plan Freemium - Quizzik

## ✅ Ce qui est fait (Étape 1)

### Structure créée
- ✅ `src/constants/premium.ts` - Configuration des features free vs premium
- ✅ `src/store/premiumStore.ts` - Store Zustand pour gérer le statut premium
- ✅ `src/screens/PremiumScreen.tsx` - Écran de vente premium
- ✅ Navigation configurée avec route `/Premium`

### Limitations définies

**Version GRATUITE**
- 4 joueurs maximum
- 2 titres par joueur
- Pas d'historique
- Pas de stats
- Pas de thèmes

**Version PREMIUM (2,99€)**
- 10 joueurs maximum
- 5 titres par joueur
- Historique illimité
- Statistiques avancées
- Thèmes personnalisés
- Achat unique (pas d'abonnement)

---

## 🚧 À faire (Étape 2)

### 1. Intégrer les limitations dans le code

**AddPlayersScreen**
```typescript
import { usePremiumStore } from '../store/premiumStore';

const { getMaxPlayers } = usePremiumStore();
const maxPlayers = getMaxPlayers();

// Bloquer l'ajout si limite atteinte
if (game.players.length >= maxPlayers) {
  Alert.alert('Limite atteinte', `Version gratuite limitée à ${maxPlayers} joueurs. Passez Premium !`);
}
```

**gameStore.ts**
```typescript
// Utiliser getPicksPerPlayer() au lieu de la constante
const picksPerPlayer = usePremiumStore.getState().getPicksPerPlayer();
```

**HistoryScreen**
```typescript
const { canAccessHistory } = usePremiumStore();

if (!canAccessHistory()) {
  // Afficher un écran "Premium requis"
  return <PremiumUpsell />;
}
```

### 2. Ajouter des boutons "Premium"

- HomeScreen : Badge "💎 Premium" en haut à droite
- HistoryScreen : Remplacer par écran upsell si gratuit
- AddPlayersScreen : Message quand limite atteinte

### 3. Intégration paiement (RevenueCat recommandé)

```bash
npm install react-native-purchases
```

**Avantages RevenueCat :**
- Gère Apple IAP + Google Play Billing
- Dashboard pour suivre les revenus
- Webhooks pour les événements
- Gratuit jusqu'à $2,500/mois de revenus

**Alternative :** Expo IAP (plus complexe)

### 4. Tester le flow complet

1. Utilisateur gratuit essaie d'ajouter 5ème joueur → Bloqué + Popup Premium
2. Clique sur "Passer Premium" → Écran Premium
3. Achète → Débloque toutes les features
4. Peut maintenant ajouter 10 joueurs

---

## 📝 Prochaines étapes

**Maintenant (avant le weekend) :**
1. Intégrer les limitations dans AddPlayersScreen
2. Ajouter bouton Premium sur HomeScreen
3. Bloquer l'historique pour les gratuits
4. Tester le flow avec le mock

**Plus tard (après le weekend) :**
1. Créer compte RevenueCat
2. Configurer les produits IAP (Apple + Google)
3. Intégrer react-native-purchases
4. Tester les vrais achats en sandbox
5. Soumettre à Apple/Google pour review

---

## 💰 Estimation revenus

Si 1000 utilisateurs et 5% convertissent :
- 50 achats × 2,99€ = **149,50€**
- Après commission Apple (30%) = **104,65€**

Objectif réaliste : 2-5% de conversion pour un achat unique à 2,99€.

---

## 🎯 Conseils

1. **Ne pas être trop restrictif** : La version gratuite doit rester fun
2. **Montrer la valeur** : Bien expliquer les avantages Premium
3. **Timing** : Proposer Premium après 2-3 parties (quand ils sont accrochés)
4. **Prix** : 2,99€ est un bon prix pour un achat impulsif
5. **Pas d'abonnement** : Les gens préfèrent l'achat unique pour un jeu
