import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';
import { useHabits } from '../habits/HabitsContext';
import Card from '../../components/Card';
import { colors, typography } from '../ux/theme';

export default function MotivationScreen() {
  const { logs, habits } = useHabits();

  const stats = useMemo(() => {
    const byHabit: Record<string, number> = {};
    const today = dayjs().format('YYYY-MM-DD');
    let longestStreak = 0;

    for (const h of habits) byHabit[h.id] = 0;
    for (const l of logs) if (l.completed) byHabit[l.habitId] = (byHabit[l.habitId] ?? 0) + 1;

    // Naive longest streak across all logs (for demo)
    const byDate = new Set(logs.filter(l => l.completed).map(l => l.date));
    let current = 0;
    for (let i = 0; i < 365; i++) {
      const d = dayjs(today).subtract(i, 'day').format('YYYY-MM-DD');
      if (byDate.has(d)) {
        current += 1;
        longestStreak = Math.max(longestStreak, current);
      } else {
        current = 0;
      }
    }

    const totalPoints = Object.values(byHabit).reduce((a, b) => a + b, 0);
    return { totalPoints, longestStreak };
  }, [logs, habits]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <Text style={[typography.title, { marginBottom: 12 }]}>Motivation</Text>
      <Card style={{ marginBottom: 12 }}>
        <Text style={typography.muted}>Points</Text>
        <Text style={{ color: colors.accent, fontSize: 28, fontWeight: '800' }}>{stats.totalPoints}</Text>
      </Card>
      <Card>
        <Text style={typography.muted}>Longest streak</Text>
        <Text style={{ color: colors.warn, fontSize: 28, fontWeight: '800' }}>{stats.longestStreak} days</Text>
      </Card>
    </View>
  );
}


