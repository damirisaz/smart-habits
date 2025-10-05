import { loadItem, saveItem, storageKeys } from '../../store/storage';
import { Habit, HabitLog, Points } from './types';
import { cancelNotifications, scheduleHabitReminders } from '../notifications/service';
import dayjs from 'dayjs';

type HabitState = {
  habits: Habit[];
  logs: HabitLog[];
  points: Points;
};

const defaultState: HabitState = {
  habits: [],
  logs: [],
  points: { total: 0, byHabit: {} }
};

export async function loadState(): Promise<HabitState> {
  const [habits, logs, points] = await Promise.all([
    loadItem<Habit[]>(storageKeys.HABITS_KEY, []),
    loadItem<HabitLog[]>(storageKeys.LOGS_KEY, []),
    loadItem<Points>(storageKeys.POINTS_KEY, { total: 0, byHabit: {} })
  ]);
  return { habits, logs, points };
}

export async function saveState(state: HabitState): Promise<void> {
  await Promise.all([
    saveItem(storageKeys.HABITS_KEY, state.habits),
    saveItem(storageKeys.LOGS_KEY, state.logs),
    saveItem(storageKeys.POINTS_KEY, state.points)
  ]);
}

export function createHabit(partial: Omit<Habit, 'id' | 'createdAt'>): Habit {
  return {
    ...partial,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString()
  };
}

export function upsertHabit(habits: Habit[], habit: Habit): Habit[] {
  const idx = habits.findIndex(h => h.id === habit.id);
  if (idx === -1) return [habit, ...habits];
  const next = habits.slice();
  next[idx] = habit;
  return next;
}

export function deleteHabit(habits: Habit[], habitId: string): Habit[] {
  return habits.filter(h => h.id !== habitId);
}

export async function rescheduleNotificationsForHabit(habit: Habit): Promise<Habit> {
  if (habit.notificationIds && habit.notificationIds.length) {
    await cancelNotifications(habit.notificationIds);
  }
  const times = habit.schedule.times ?? [];
  const ids: string[] = [];
  for (const t of times) {
    const [hour, minute] = t.split(':').map(Number);
    const newIds = await scheduleHabitReminders({
      id: habit.id,
      title: habit.name,
      body: habit.description,
      hour: hour ?? 9,
      minute: minute ?? 0,
      daysOfWeek: habit.schedule.daysOfWeek
    });
    ids.push(...newIds);
  }
  return { ...habit, notificationIds: ids };
}

export function toggleCompletionForDate(
  logs: HabitLog[],
  habitId: string,
  dateISO: string
): HabitLog[] {
  const day = dayjs(dateISO).format('YYYY-MM-DD');
  const existing = logs.find(l => l.habitId === habitId && l.date === day);
  if (!existing) {
    const newLog: HabitLog = {
      id: Math.random().toString(36).slice(2),
      habitId,
      date: day,
      completed: true
    };
    return [newLog, ...logs];
  }
  const next = logs.slice();
  const idx = next.findIndex(l => l.id === existing.id);
  next[idx] = { ...existing, completed: !existing.completed };
  return next;
}

export function calculateTodayCompleted(logs: HabitLog[], habitId: string): boolean {
  const day = dayjs().format('YYYY-MM-DD');
  const log = logs.find(l => l.habitId === habitId && l.date === day);
  return !!log && log.completed;
}


