import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { AddPlayersScreen } from '../screens/AddPlayersScreen';
import { PicksSettingsScreen } from '../screens/PicksSettingsScreen';
import { AddPicksScreen } from '../screens/AddPicksScreen';
import { PlayScreen } from '../screens/PlayScreen';
import { ScoresScreen } from '../screens/ScoresScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { PremiumScreen } from '../screens/PremiumScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AddPlayers" 
          component={AddPlayersScreen}
          options={{ title: 'Joueurs' }}
        />
        <Stack.Screen 
          name="PicksSettings" 
          component={PicksSettingsScreen}
          options={{ title: 'Configuration', headerShown: false }}
        />
        <Stack.Screen 
          name="AddPicks" 
          component={AddPicksScreen}
          options={{ title: 'Ajouter des titres', headerLeft: () => null }}
        />
        <Stack.Screen 
          name="Play" 
          component={PlayScreen}
          options={{ title: 'Partie en cours' }}
        />
        <Stack.Screen 
          name="Scores" 
          component={ScoresScreen}
          options={{ title: 'Scores', headerLeft: () => null }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: 'Historique' }}
        />
        <Stack.Screen 
          name="Premium" 
          component={PremiumScreen}
          options={{ title: 'Premium', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
