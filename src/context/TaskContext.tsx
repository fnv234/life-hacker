import { createContext, useContext } from 'react';
import type { Task, TaskInput, Priority, Subtask } from '../types';

export interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => boolean;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  tasksByPriority: (priority: Priority) => Task[];
  completedTasks: Task[];
}

export const TaskContext = createContext<TaskContextValue | null>(null);

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}

export function subtaskProgress(subtasks: Subtask[]): { done: number; total: number } {
  const total = subtasks.length;
  const done = subtasks.filter((s) => s.completed).length;
  return { done, total };
}

export function hasIncompleteSubtasks(subtasks: Subtask[]): boolean {
  return subtasks.length > 0 && subtasks.some((s) => !s.completed);
}

export function canCompleteTask(task: Task): boolean {
  return !hasIncompleteSubtasks(task.subtasks);
}
