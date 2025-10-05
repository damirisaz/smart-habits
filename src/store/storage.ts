import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = 'smartHabits.habits';
const LOGS_KEY = 'smartHabits.logs';
const POINTS_KEY = 'smartHabits.points';

export async function loadItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storageKeys = { HABITS_KEY, LOGS_KEY, POINTS_KEY } as const;


