import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Audio } from 'expo-av';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    // Configure audio mode
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
