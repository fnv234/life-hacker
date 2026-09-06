import { useState, type KeyboardEvent } from 'react';
import { useTasks } from '../context/TaskContext';
import type { Subtask } from '../types';

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
}

export function SubtaskList({ taskId, subtasks }: SubtaskListProps) {
  const { addSubtask, toggleSubtask, deleteSubtask } = useTasks();
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addSubtask(taskId, newTitle);
    setNewTitle('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="subtask-list">
      <h4 className="subtask-heading">Subtasks</h4>
      <ul>
        {subtasks.map((sub) => (
          <li key={sub.id} className={sub.completed ? 'completed' : ''}>
            <label>
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => toggleSubtask(taskId, sub.id)}
              />
              <span>{sub.title}</span>
            </label>
            <button
              type="button"
              className="icon-btn danger small"
              aria-label="Remove subtask"
              onClick={() => deleteSubtask(taskId, sub.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="subtask-add">
        <input
          type="text"
          placeholder="Add a subtask..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="btn btn-small" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}
