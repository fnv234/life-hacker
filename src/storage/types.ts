import type { Task } from '../types';

/** Storage adapter — swap LocalStorageAdapter for an API adapter later. */
export interface TaskStorage {
  load(): Promise<Task[]>;
  save(tasks: Task[]): Promise<void>;
}
