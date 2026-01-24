import { Stack } from 'expo-router';
import { TimerProvider } from '../context/TimerContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <TimerProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TimerProvider>
  );
}