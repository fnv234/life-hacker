import type { Task } from '../types';
import type { TaskStorage } from './types';

const STORAGE_KEY = 'life-hacker-tasks';

export class LocalStorageAdapter implements TaskStorage {
  async load(): Promise<Task[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async save(tasks: Task[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}
