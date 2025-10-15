# Quizzik - Le Jeu de Bluff Musical

Une application mobile de blind test nouvelle génération où le bluff et la déduction sont au cœur du gameplay, inspiré du Loup-Garou.

## Concept du Jeu

Quizzik n'est pas un simple blind test ! C'est un jeu de **bluff et déduction** où vous devez :
- **Rester incognito** quand votre titre est joué
- **Démasquer** les autres joueurs
- **Bluffer** et mentir pour protéger vos choix musicaux

## Comment Jouer

### 1. Configuration (3 joueurs minimum)
- Ajoutez les joueurs (le téléphone passe de main en main)
- Personne ne doit voir les choix des autres !

### 2. Phase de Jeu
Pour chaque titre :
1. **Écoute** : Un titre est joué au hasard (30 sec)
2. **Discussion** : Discutez, bluffez, menteZ !
3. **Vote** : Chaque joueur vote pour désigner le propriétaire
4. **Révélation** : Le propriétaire est dévoilé

### 3. Système de Points 

**+1 point** : Si vous devinez correctement à qui appartient le titre
**+2 points** : Si vous n'êtes PAS démasqué quand c'est VOTRE titre (au moins un joueur s'est trompé)

Le joueur avec le plus de points à la fin gagne !

## Technologies

- **React Native** + **Expo** - Framework mobile
- **TypeScript** - Typage fort
- **Zustand** - State management
- **AsyncStorage** - Stockage local (pas de backend)
- **Deezer API** - Catalogue musical (extraits 30 sec gratuiti)
- **Expo AV** - Lecture audio

## Design System "Vinyl Wave"

Identité visuelle rétro-futuriste avec :
- Palette violet profond + rose néon + cyan
- Glassmorphism avancé
- Dégradés vibrants
- Effets néon et glow
- Typographie bold et expressive

## Installation

```bash
# Installer les dépendances
npm install

# Lancer l'app
npx expo start

# iOS
npx expo start --ios

# Android
npx expo start --android
```

## Structure

```
src/
├── components/     # OnboardingModal
├── constants/      # theme.ts
├── navigation/     # AppNavigator, types
├── screens/        # Home, AddPlayers, AddPicks, Play, Scores, History
├── services/       # deezer.ts, storage.ts
├── store/          # gameStore.ts (Zustand)
└── types/          # index.ts
```

## Roadmap MVP

- [x] Système de jeu complet
- [x] Intégration Deezer API
- [x] Stockage local
- [x] Historique des parties
- [x] Onboarding interactif
- [x] Design system unique
- [x] Système de points type "Loup-Garou"
- [ ] Tests utilisateurs
- [ ] Publication App Store

## Fonctionnalités Futures

- Premium : Plus de titres par joueur, thèmes musicaux
- Animations et transitions
- Partage de résultats
- Mode en ligne (multijoueurs à distance)
