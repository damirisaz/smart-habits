import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false })
});

export async function requestPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return true;
  const res = await Notifications.requestPermissionsAsync();
  return !!res.granted || res.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export type ReminderInput = { id: string; title: string; body?: string; hour: number; minute: number; daysOfWeek: number[] };

export async function scheduleHabitReminders(input: ReminderInput): Promise<string[]> {
  const uniqueDays = Array.from(new Set(input.daysOfWeek)).filter(d => d >= 0 && d <= 6).sort();
  const ids: string[] = [];

  // If no specific weekdays selected, schedule one daily notification at the given time
  if (uniqueDays.length === 0 || uniqueDays.length === 7) {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: input.title, body: input.body ?? 'Time for your habit' },
      trigger: { hour: input.hour, minute: input.minute, repeats: true }
    });
    ids.push(id);
    return ids;
  }

  // Map our 0-6 (Sun-Sat) to Expo 1-7 (Sun-Sat)
  for (const dow of uniqueDays) {
    const expoWeekday = dow + 1; // 1=Sunday ... 7=Saturday
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: input.title, body: input.body ?? 'Time for your habit' },
      trigger: { weekday: expoWeekday as any, hour: input.hour, minute: input.minute, repeats: true }
    });
    ids.push(id);
  }
  return ids;
}

export async function cancelNotifications(ids: string[]) {
  await Promise.all(ids.map(id => Notifications.cancelScheduledNotificationAsync(id)));
}


