const REMINDER_LOG_KEY = 'life-hacker-reminder-log';

interface ReminderLog {
  [taskId: string]: string;
}

function loadLog(): ReminderLog {
  try {
    const raw = localStorage.getItem(REMINDER_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLog(log: ReminderLog) {
  localStorage.setItem(REMINDER_LOG_KEY, JSON.stringify(log));
}

function shouldNotify(taskId: string, kind: string, cooldownMs: number): boolean {
  const log = loadLog();
  const key = `${taskId}:${kind}`;
  const last = log[key];
  if (!last) return true;
  return Date.now() - new Date(last).getTime() > cooldownMs;
}

function markNotified(taskId: string, kind: string) {
  const log = loadLog();
  log[`${taskId}:${kind}`] = new Date().toISOString();
  saveLog(log);
}

export type NotificationPermission = 'default' | 'granted' | 'denied';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result as NotificationPermission;
}

export function showNotification(title: string, body: string, tag?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body, tag, icon: '/vite.svg' });
}

export interface CheckableTask {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  reminderEnabled: boolean;
}

export function checkAndNotifyTasks(tasks: CheckableTask[]) {
  const now = new Date();

  for (const task of tasks) {
    if (task.completed || !task.reminderEnabled || !task.dueDate) continue;

    const due = new Date(task.dueDate);
    const msUntilDue = due.getTime() - now.getTime();
    const hoursUntilDue = msUntilDue / (1000 * 60 * 60);

    if (msUntilDue < 0) {
      if (shouldNotify(task.id, 'overdue', 4 * 60 * 60 * 1000)) {
        showNotification(
          'Overdue check-in',
          `"${task.title}" was due ${due.toLocaleString()}`,
          `overdue-${task.id}`,
        );
        markNotified(task.id, 'overdue');
      }
    } else if (hoursUntilDue <= 1) {
      if (shouldNotify(task.id, 'due-1h', 30 * 60 * 1000)) {
        showNotification(
          'Due in 1 hour',
          `Check in on "${task.title}" — due at ${due.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
          `due-1h-${task.id}`,
        );
        markNotified(task.id, 'due-1h');
      }
    } else if (hoursUntilDue <= 24) {
      if (shouldNotify(task.id, 'due-24h', 12 * 60 * 60 * 1000)) {
        showNotification(
          'Due tomorrow',
          `"${task.title}" is due ${due.toLocaleString()}`,
          `due-24h-${task.id}`,
        );
        markNotified(task.id, 'due-24h');
      }
    }
  }
}
