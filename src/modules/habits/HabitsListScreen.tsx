import React from 'react';
import { View, Text, Pressable, FlatList, Switch } from 'react-native';
import { useHabits } from './HabitsContext';
import { Alert } from 'react-native';

export default function HabitsListScreen({ navigation }: any) {
  const { habits, isTodayCompleted, toggleToday, ready, removeHabit } = useHabits();

  if (!ready) return <Text style={{ padding: 16 }}>Loading…</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1216' }}>
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={habits}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ color: '#9ca3af' }}>No habits yet. Create one.</Text>}
        renderItem={({ item }) => {
          const completed = isTodayCompleted(item.id);
          return (
            <Pressable
              onLongPress={() => {
                Alert.alert('Delete habit?', `Delete "${item.name}"`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => void removeHabit(item.id) }
                ]);
              }}
              onPress={() => navigation.navigate('HabitForm', { habitId: item.id })}
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: '#111827',
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ maxWidth: '70%' }}>
                <Text style={{ color: '#e5e7eb', fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                {!!item.description && (
                  <Text style={{ color: '#9ca3af', marginTop: 4 }} numberOfLines={2}>{item.description}</Text>
                )}
              </View>
              <Switch
                value={completed}
                onValueChange={() => toggleToday(item.id)}
                thumbColor={completed ? '#10b981' : '#6b7280'}
                trackColor={{ true: '#064e3b', false: '#374151' }}
              />
            </Pressable>
          );
        }}
      />
      <Pressable
        onPress={() => navigation.navigate('HabitForm')}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 28,
          height: 56,
          width: 56,
          borderRadius: 28,
          backgroundColor: '#10b981',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={{ color: '#052e2b', fontSize: 28, lineHeight: 28 }}>+</Text>
      </Pressable>
    </View>
  );
}


