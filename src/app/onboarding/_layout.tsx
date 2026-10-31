import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="personal-details" />
      <Stack.Screen name="cricket-positions" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
