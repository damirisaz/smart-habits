import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { HabitsProvider } from '../modules/habits/HabitsContext';
import HabitsListScreen from '../modules/habits/HabitsListScreen';
import HabitFormScreen from '../modules/habits/HabitFormScreen';
import ProgressScreen from '../modules/progress/ProgressScreen';
import MotivationScreen from '../modules/motivation/MotivationScreen';
import SettingsScreen from '../modules/notifications/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Placeholder({ label }: { label: string }) {
  return <Text style={{ padding: 24, fontSize: 18 }}>{label}</Text>;
}

function HabitsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HabitsList" component={HabitsListScreen} options={{ title: 'Habits' }} />
      <Stack.Screen name="HabitForm" component={HabitFormScreen} options={{ title: 'Habit' }} />
    </Stack.Navigator>
  );
}

// ProgressScreen and MotivationScreen are imported from modules.

// Settings screen imported above

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Habits" component={HabitsStack} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Motivation" component={MotivationScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const appTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0f1216',
    primary: '#6ee7b7',
    text: '#e5e7eb',
    card: '#111827'
  }
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={appTheme}>
      <HabitsProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
        </Stack.Navigator>
      </HabitsProvider>
    </NavigationContainer>
  );
}


