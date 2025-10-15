# 💰 Plan d'Intégration RevenueCat

## 📋 État Actuel

✅ **Déjà implémenté :**
- Système freemium complet (gratuit vs premium)
- Limitations fonctionnelles (joueurs, titres, historique)
- Écran Premium avec liste des avantages
- Mock d'achat pour tester
- Store Zustand pour gérer le statut premium

❌ **À faire :**
- Intégration du vrai système de paiement
- Connexion avec Apple/Google stores
- Gestion des abonnements et achats uniques
- Restauration des achats

---

## 🎯 Étape 1 : Configuration RevenueCat (30 min)

### 1.1 Créer un compte RevenueCat
1. Aller sur https://www.revenuecat.com/
2. S'inscrire (gratuit jusqu'à $2,500/mois de revenus)
3. Créer un nouveau projet "Quizzik"

### 1.2 Configurer les stores

**Apple App Store :**
1. Aller sur App Store Connect
2. Créer un "In-App Purchase" de type "Non-Consumable"
   - Product ID : `quizzik_premium`
   - Prix : 2,99€
3. Copier la clé API App Store Connect
4. Ajouter dans RevenueCat Dashboard

**Google Play Store :**
1. Aller sur Google Play Console
2. Créer un "In-app product" de type "Managed product"
   - Product ID : `quizzik_premium`
   - Prix : 2,99€
3. Copier les credentials
4. Ajouter dans RevenueCat Dashboard

### 1.3 Créer un "Entitlement" dans RevenueCat
1. Dashboard → Entitlements → Create
2. Nom : `premium`
3. Associer le produit `quizzik_premium`

---

## 🎯 Étape 2 : Installation SDK (15 min)

### 2.1 Installer le package
```bash
npm install react-native-purchases
npx pod-install # iOS uniquement
```

### 2.2 Configuration iOS (Info.plist)
Ajouter dans `ios/quizzik/Info.plist` :
```xml
<key>NSUserTrackingUsageDescription</key>
<string>Nous utilisons ces données pour améliorer votre expérience</string>
```

### 2.3 Configuration Android (AndroidManifest.xml)
Ajouter dans `android/app/src/main/AndroidManifest.xml` :
```xml
<uses-permission android:name="com.android.vending.BILLING" />
```

---

## 🎯 Étape 3 : Créer le service RevenueCat (45 min)

### 3.1 Créer `src/services/revenuecat.ts`
```typescript
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY_IOS = 'appl_xxxxxxxxxx'; // À récupérer depuis RevenueCat
const API_KEY_ANDROID = 'goog_xxxxxxxxxx';

export const revenueCatService = {
  // Initialiser RevenueCat au démarrage de l'app
  initialize: async (userId?: string) => {
    try {
      const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
      await Purchases.configure({ apiKey, appUserID: userId });
      console.log('RevenueCat initialized');
    } catch (error) {
      console.error('RevenueCat init error:', error);
    }
  },

  // Récupérer les offres disponibles
  getOfferings: async (): Promise<PurchasesOffering | null> => {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return null;
    }
  },

  // Acheter Premium
  purchasePremium: async (): Promise<boolean> => {
    try {
      const offerings = await Purchases.getOfferings();
      const premiumPackage = offerings.current?.availablePackages[0];
      
      if (!premiumPackage) {
        throw new Error('No package available');
      }

      const { customerInfo } = await Purchases.purchasePackage(premiumPackage);
      return customerInfo.entitlements.active['premium'] !== undefined;
    } catch (error: any) {
      if (error.userCancelled) {
        console.log('User cancelled purchase');
      } else {
        console.error('Purchase error:', error);
      }
      return false;
    }
  },

  // Vérifier le statut Premium
  checkPremiumStatus: async (): Promise<boolean> => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.active['premium'] !== undefined;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  },

  // Restaurer les achats
  restorePurchases: async (): Promise<boolean> => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo.entitlements.active['premium'] !== undefined;
    } catch (error) {
      console.error('Restore error:', error);
      return false;
    }
  },
};
```

### 3.2 Initialiser dans `App.tsx`
```typescript
import { revenueCatService } from './src/services/revenuecat';

export default function App() {
  useEffect(() => {
    // Initialiser RevenueCat
    revenueCatService.initialize();
    
    // Configurer audio
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }, []);

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}
```

---

## 🎯 Étape 4 : Intégrer dans PremiumScreen (30 min)

### 4.1 Remplacer le mock par le vrai achat
```typescript
// Dans PremiumScreen.tsx
import { revenueCatService } from '../services/revenuecat';

const handlePurchase = async () => {
  setIsLoading(true);
  
  try {
    const success = await revenueCatService.purchasePremium();
    
    if (success) {
      await setPremium(true);
      Alert.alert('Succès !', 'Vous êtes maintenant Premium ! 🎉', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Erreur', 'L\'achat a échoué. Veuillez réessayer.');
    }
  } catch (error) {
    Alert.alert('Erreur', 'Une erreur est survenue.');
  } finally {
    setIsLoading(false);
  }
};

const handleRestore = async () => {
  setIsLoading(true);
  
  try {
    const success = await revenueCatService.restorePurchases();
    
    if (success) {
      await setPremium(true);
      Alert.alert('Restauré !', 'Vos achats ont été restaurés.');
    } else {
      Alert.alert('Aucun achat', 'Aucun achat à restaurer.');
    }
  } catch (error) {
    Alert.alert('Erreur', 'Impossible de restaurer les achats.');
  } finally {
    setIsLoading(false);
  }
};
```

### 4.2 Afficher le prix dynamique
```typescript
const [offering, setOffering] = useState<PurchasesOffering | null>(null);

useEffect(() => {
  loadOffering();
}, []);

const loadOffering = async () => {
  const offer = await revenueCatService.getOfferings();
  setOffering(offer);
};

// Dans le render
<Text style={styles.price}>
  {offering?.availablePackages[0]?.product.priceString || '2,99 €'}
</Text>
```

---

## 🎯 Étape 5 : Synchroniser le statut (20 min)

### 5.1 Vérifier au démarrage
```typescript
// Dans HomeScreen.tsx useEffect
useEffect(() => {
  loadGame();
  checkPremiumStatus();
  checkOnboarding();
}, []);

const checkPremiumStatus = async () => {
  const isPremium = await revenueCatService.checkPremiumStatus();
  await setPremium(isPremium);
};
```

### 5.2 Écouter les changements
```typescript
// Dans App.tsx
useEffect(() => {
  const listener = Purchases.addCustomerInfoUpdateListener((info) => {
    const isPremium = info.entitlements.active['premium'] !== undefined;
    usePremiumStore.getState().setPremium(isPremium);
  });

  return () => {
    listener.remove();
  };
}, []);
```

---

## 🎯 Étape 6 : Tests (1h)

### 6.1 Tests en Sandbox
1. **iOS** : Créer un compte Sandbox dans App Store Connect
2. **Android** : Ajouter des testeurs dans Google Play Console
3. Tester l'achat complet
4. Tester la restauration
5. Tester l'annulation

### 6.2 Vérifier dans RevenueCat Dashboard
- Les transactions apparaissent
- Le statut Premium est correct
- Les webhooks fonctionnent

---

## 🎯 Étape 7 : Nettoyage (15 min)

### 7.1 Retirer le bouton DEBUG
```typescript
// Dans PremiumScreen.tsx
// SUPPRIMER ces lignes :
{/* Bouton DEBUG - À retirer en production */}
<TouchableOpacity style={styles.debugButton} onPress={handleDebugToggle}>
  <Text style={styles.debugButtonText}>🔧 DEBUG: ...</Text>
</TouchableOpacity>
```

### 7.2 Variables d'environnement
Créer `.env` :
```
REVENUECAT_API_KEY_IOS=appl_xxxxxxxxxx
REVENUECAT_API_KEY_ANDROID=goog_xxxxxxxxxx
```

Utiliser `react-native-dotenv` pour les charger.

---

## 🎯 Étape 8 : Soumission (2-3 jours)

### 8.1 Apple App Store
1. Créer les screenshots
2. Remplir les métadonnées
3. Soumettre pour review
4. Attendre validation (24-48h)

### 8.2 Google Play Store
1. Créer les screenshots
2. Remplir les métadonnées
3. Soumettre pour review
4. Attendre validation (quelques heures)

---

## 📊 Checklist Finale

- [ ] Compte RevenueCat créé
- [ ] Produits IAP créés (Apple + Google)
- [ ] SDK installé et configuré
- [ ] Service RevenueCat implémenté
- [ ] PremiumScreen connecté
- [ ] Tests sandbox réussis
- [ ] Bouton DEBUG retiré
- [ ] Variables d'environnement configurées
- [ ] App soumise aux stores

---

## 💡 Conseils

1. **Commencer par iOS** : Plus simple à tester
2. **Tester en sandbox** : Ne jamais tester avec de vrais achats
3. **Logs partout** : Pour débugger les problèmes
4. **RevenueCat Dashboard** : Vérifier que tout remonte bien
5. **Patience** : Les reviews peuvent prendre du temps

---

## 📚 Ressources

- [RevenueCat Docs](https://docs.revenuecat.com/)
- [React Native Purchases](https://github.com/RevenueCat/react-native-purchases)
- [Apple IAP Guide](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing](https://developer.android.com/google/play/billing)

---

## ⏱️ Temps Total Estimé : 4-5 heures

+ 2-3 jours pour les reviews des stores
