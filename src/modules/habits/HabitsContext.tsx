import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Habit, HabitLog } from './types';
import { calculateTodayCompleted, createHabit, deleteHabit, loadState, rescheduleNotificationsForHabit, saveState, toggleCompletionForDate, upsertHabit } from './service';
import { cancelNotifications } from '../notifications/service';

type HabitsContextValue = {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (input: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
  toggleToday: (habitId: string) => Promise<void>;
  isTodayCompleted: (habitId: string) => boolean;
  ready: boolean;
};

const HabitsContext = createContext<HabitsContextValue | undefined>(undefined);

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be used within HabitsProvider');
  return ctx;
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await loadState();
      setHabits(s.habits);
      setLogs(s.logs);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    void saveState({ habits, logs, points: { total: 0, byHabit: {} } });
  }, [habits, logs, ready]);

  const value = useMemo<HabitsContextValue>(
    () => ({
      habits,
      logs,
      ready,
      addHabit: async (input) => {
        const h = createHabit(input);
        const withNotif = await rescheduleNotificationsForHabit(h);
        setHabits(prev => upsertHabit(prev, withNotif));
      },
      updateHabit: async (habit) => {
        const withNotif = await rescheduleNotificationsForHabit(habit);
        setHabits(prev => upsertHabit(prev, withNotif));
      },
      removeHabit: async (habitId) => {
        const target = habits.find(h => h.id === habitId);
        if (target?.notificationIds?.length) {
          await cancelNotifications(target.notificationIds);
        }
        setHabits(prev => deleteHabit(prev, habitId));
        setLogs(prev => prev.filter(l => l.habitId !== habitId));
      },
      toggleToday: async (habitId) => {
        setLogs(prev => toggleCompletionForDate(prev, habitId, new Date().toISOString()));
      },
      isTodayCompleted: (habitId) => calculateTodayCompleted(logs, habitId)
    }),
    [habits, logs, ready]
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}


