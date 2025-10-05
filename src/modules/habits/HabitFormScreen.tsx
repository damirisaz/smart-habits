import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useHabits } from './HabitsContext';
import { Habit } from './types';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function HabitFormScreen({ route, navigation }: any) {
  const { habits, addHabit, updateHabit, removeHabit } = useHabits();
  const habitId: string | undefined = route?.params?.habitId;
  const editing: Habit | undefined = useMemo(() => habits.find(h => h.id === habitId), [habits, habitId]);

  const [name, setName] = useState(editing?.name ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [days, setDays] = useState<number[]>(editing?.schedule.daysOfWeek ?? [1,2,3,4,5]);
  const [time, setTime] = useState<string>((editing?.schedule.times && editing.schedule.times[0]) ?? '09:00');

  function toggleDay(index: number) {
    setDays(prev => prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index].sort());
  }

  async function onSave() {
    if (editing) {
      const next: Habit = { ...editing, name, description, schedule: { daysOfWeek: days, times: [time] } };
      await updateHabit(next);
    } else {
      await addHabit({ name, description, schedule: { daysOfWeek: days, times: [time] }, archived: false } as any);
    }
    navigation.goBack();
  }

  function onDelete() {
    if (!editing) return;
    Alert.alert('Delete habit?', `Delete "${editing.name}"`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await removeHabit(editing.id); navigation.goBack(); } }
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1216', padding: 16 }}>
      <Text style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 8 }}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Drink water"
        placeholderTextColor="#6b7280"
        style={{ backgroundColor: '#111827', color: '#e5e7eb', padding: 12, borderRadius: 10, marginBottom: 12 }}
      />

      <Text style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 8 }}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="8 cups per day"
        placeholderTextColor="#6b7280"
        style={{ backgroundColor: '#111827', color: '#e5e7eb', padding: 12, borderRadius: 10, marginBottom: 12 }}
      />

      <Text style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 8 }}>Schedule</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        {DAYS.map((d, i) => {
          const active = days.includes(i);
          return (
            <Pressable
              key={i}
              onPress={() => toggleDay(i)}
              style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, backgroundColor: active ? '#10b981' : '#374151' }}
            >
              <Text style={{ color: active ? '#052e2b' : '#e5e7eb', fontWeight: '700' }}>{d}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ color: '#e5e7eb', fontSize: 16, marginBottom: 8 }}>Time</Text>
      <TextInput
        value={time}
        onChangeText={setTime}
        placeholder="HH:mm"
        placeholderTextColor="#6b7280"
        style={{ backgroundColor: '#111827', color: '#e5e7eb', padding: 12, borderRadius: 10, marginBottom: 24 }}
      />

      <Pressable onPress={onSave} style={{ backgroundColor: '#10b981', padding: 14, borderRadius: 12 }}>
        <Text style={{ color: '#052e2b', fontWeight: '700', textAlign: 'center' }}>{editing ? 'Save changes' : 'Create habit'}</Text>
      </Pressable>

      {editing && (
        <Pressable onPress={onDelete} style={{ marginTop: 12, backgroundColor: '#7f1d1d', padding: 14, borderRadius: 12 }}>
          <Text style={{ color: '#fecaca', fontWeight: '700', textAlign: 'center' }}>Delete habit</Text>
        </Pressable>
      )}
    </View>
  );
}


