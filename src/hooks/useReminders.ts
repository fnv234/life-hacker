import { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import {
  checkAndNotifyTasks,
  requestNotificationPermission,
  type NotificationPermission,
} from '../reminders';

const CHECK_INTERVAL_MS = 60_000;

export function useReminders() {
  const { tasks } = useTasks();
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    'Notification' in window ? (Notification.permission as NotificationPermission) : 'denied',
  );

  const enableReminders = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  };

  useEffect(() => {
    if (permission !== 'granted') return;

    const runCheck = () => {
      checkAndNotifyTasks(
        tasks.map((t) => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate ?? '',
          completed: t.completed,
          reminderEnabled: t.reminderEnabled,
        })),
      );
    };

    runCheck();
    const interval = setInterval(runCheck, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [tasks, permission]);

  const reminderCount = tasks.filter(
    (t) => !t.completed && t.reminderEnabled && t.dueDate,
  ).length;

  return { permission, enableReminders, reminderCount };
}
