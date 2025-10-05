import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as V from 'victory-native';
import dayjs from 'dayjs';
import { useHabits } from '../habits/HabitsContext';

export default function ProgressScreen() {
  const { logs } = useHabits();

  const marked = useMemo(() => {
    const map: Record<string, { marked: boolean; dotColor: string }> = {};
    logs.forEach(l => {
      if (l.completed) {
        map[l.date] = { marked: true, dotColor: '#10b981' };
      }
    });
    return map;
  }, [logs]);

  const chartData = useMemo(() => {
    const byDay: Record<string, number> = {};
    logs.forEach(l => {
      byDay[l.date] = (byDay[l.date] ?? 0) + (l.completed ? 1 : 0);
    });
    const days = Array.from({ length: 30 }).map((_, i) => dayjs().subtract(29 - i, 'day').format('YYYY-MM-DD'));
    return days.map(d => ({ x: d.slice(5), y: byDay[d] ?? 0 }));
  }, [logs]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1216' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#e5e7eb', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Calendar</Text>
        <Calendar
          theme={{ calendarBackground: '#111827', dayTextColor: '#e5e7eb', monthTextColor: '#e5e7eb', arrowColor: '#10b981' }}
          markedDates={marked}
        />
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <Text style={{ color: '#e5e7eb', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>30-day adherence</Text>
        {V && V.VictoryChart && V.VictoryArea ? (
          <V.VictoryChart domainPadding={{ y: 8 }}>
            <V.VictoryArea interpolation="monotoneX" style={{ data: { fill: '#065f46', stroke: '#10b981' } }} data={chartData} />
          </V.VictoryChart>
        ) : (
          <Text style={{ color: '#9ca3af' }}>Chart unavailable on this runtime.</Text>
        )}
      </View>
    </View>
  );
}


