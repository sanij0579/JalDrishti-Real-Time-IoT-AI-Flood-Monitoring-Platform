import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import "../global.css"

export default function RootLayout() {
  return <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name="index"  />
    <Stack.Screen name="(tabs)" />


  </Stack>
}