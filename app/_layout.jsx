import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // this hides the header for all screens by default
      }}
    />
  );
}

