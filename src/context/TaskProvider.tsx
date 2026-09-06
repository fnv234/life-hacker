import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TaskContext } from './TaskContext';
import { canCompleteTask } from './TaskContext';
import type { Task, TaskInput, Priority } from '../types';
import { LocalStorageAdapter } from '../storage';
import { generateId } from '../utils';

const storage = new LocalStorageAdapter();

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.load().then((loaded) => {
      setTasks(loaded);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    storage.save(tasks);
  }, [tasks, loading]);

  const addTask = useCallback((input: TaskInput) => {
    const now = new Date().toISOString();
    const subtasks = (input.subtaskTitles ?? [])
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title) => ({ id: generateId(), title, completed: false }));

    const task: Task = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      priority: input.priority,
      dueDate: input.dueDate ?? null,
      reminderEnabled: input.reminderEnabled ?? false,
      completed: false,
      subtasks,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskComplete = useCallback((id: string): boolean => {
    let changed = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completing = !t.completed;
        if (completing && !canCompleteTask(t)) return t;
        changed = true;
        return { ...t, completed: !t.completed, updatedAt: new Date().toISOString() };
      }),
    );
    return changed;
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [
                ...t.subtasks,
                { id: generateId(), title: trimmed, completed: false },
              ],
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s,
              ),
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  }, []);

  const sortActive = (a: Task, b: Task) => {
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };

  const tasksByPriority = useCallback(
    (priority: Priority) =>
      tasks.filter((t) => t.priority === priority && !t.completed).sort(sortActive),
    [tasks],
  );

  const completedTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.completed)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      loading,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      tasksByPriority,
      completedTasks,
    }),
    [
      tasks,
      loading,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      tasksByPriority,
      completedTasks,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
