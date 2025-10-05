import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable } from 'react-native';
import { requestPermissions, scheduleHabitReminders } from './service';

export default function SettingsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    (async () => {
      const ok = await requestPermissions();
      setStatus(ok ? 'granted' : 'denied');
    })();
  }, []);

  async function scheduleSample() {
    await scheduleHabitReminders({ id: 'sample', title: 'Hydrate', body: 'Drink water', hour: 9, minute: 0, daysOfWeek: [1,2,3,4,5] });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1216', padding: 16 }}>
      <Text style={{ color: '#e5e7eb', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Notifications</Text>
      <View style={{ backgroundColor: '#111827', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: '#e5e7eb', fontWeight: '600' }}>Enable reminders</Text>
          <Text style={{ color: '#9ca3af', marginTop: 4 }}>Permission: {status || '...'}</Text>
        </View>
        <Switch value={enabled} onValueChange={setEnabled} trackColor={{ true: '#064e3b', false: '#374151' }} thumbColor={enabled ? '#10b981' : '#6b7280'} />
      </View>

      <Pressable onPress={scheduleSample} style={{ backgroundColor: '#10b981', padding: 14, borderRadius: 12 }}>
        <Text style={{ color: '#052e2b', textAlign: 'center', fontWeight: '700' }}>Schedule sample 9:00</Text>
      </Pressable>
    </View>
  );
}


