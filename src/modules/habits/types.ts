export type HabitSchedule = {
  daysOfWeek: number[]; // 0-6, Sunday-Saturday
  times?: string[]; // HH:mm
};

export type Habit = {
  id: string;
  name: string;
  description?: string;
  schedule: HabitSchedule;
  createdAt: string; // ISO
  archived?: boolean;
  notificationIds?: string[]; // scheduled notifications for this habit
};

export type HabitLog = {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
};

export type Streak = {
  habitId: string;
  current: number;
  best: number;
  lastDate?: string; // YYYY-MM-DD
};

export type Points = {
  total: number;
  byHabit: Record<string, number>;
};


