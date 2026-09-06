import { useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Task, Priority } from '../types';
import { PRIORITY_ORDER, PRIORITY_LABELS } from '../types';
import { useTasks } from '../context/TaskContext';
import { fromDatetimeLocalValue, toDatetimeLocalValue } from '../utils';

interface TaskFormProps {
  mode: 'create' | 'edit';
  defaultPriority?: Priority;
  initialTask?: Task;
  onClose: () => void;
}

export function TaskForm({ mode, defaultPriority = 'medium', initialTask, onClose }: TaskFormProps) {
  const { addTask, updateTask } = useTasks();

  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? defaultPriority);
  const [dueDate, setDueDate] = useState(toDatetimeLocalValue(initialTask?.dueDate ?? null));
  const [reminderEnabled, setReminderEnabled] = useState(initialTask?.reminderEnabled ?? false);
  const [subtaskDraft, setSubtaskDraft] = useState('');
  const [subtaskTitles, setSubtaskTitles] = useState<string[]>([]);

  const addSubtaskDraft = () => {
    const trimmed = subtaskDraft.trim();
    if (!trimmed) return;
    setSubtaskTitles((prev) => [...prev, trimmed]);
    setSubtaskDraft('');
  };

  const handleSubtaskKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtaskDraft();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedDue = fromDatetimeLocalValue(dueDate);

    if (mode === 'create') {
      addTask({
        title,
        description,
        priority,
        dueDate: parsedDue,
        reminderEnabled: parsedDue ? reminderEnabled : false,
        subtaskTitles,
      });
    } else if (initialTask) {
      updateTask(initialTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: parsedDue,
        reminderEnabled: parsedDue ? reminderEnabled : false,
      });
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="task-form-title"
      >
        <h3 id="task-form-title">{mode === 'create' ? 'New priority' : 'Edit priority'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs your attention?"
              autoFocus
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={3}
            />
          </label>

          {mode === 'create' && (
            <fieldset className="subtask-fieldset">
              <legend>Subtasks <span className="legend-hint">(optional — check these off before completing the priority)</span></legend>
              {subtaskTitles.length > 0 && (
                <ul className="draft-subtasks">
                  {subtaskTitles.map((st, i) => (
                    <li key={i}>
                      <span>{st}</span>
                      <button
                        type="button"
                        className="icon-btn danger small"
                        aria-label="Remove subtask"
                        onClick={() => setSubtaskTitles((prev) => prev.filter((_, j) => j !== i))}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="subtask-add">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={subtaskDraft}
                  onChange={(e) => setSubtaskDraft(e.target.value)}
                  onKeyDown={handleSubtaskKeyDown}
                />
                <button type="button" className="btn btn-small" onClick={addSubtaskDraft}>
                  Add
                </button>
              </div>
            </fieldset>
          )}

          <label>
            Priority
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {PRIORITY_ORDER.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Due date & time
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (!e.target.value) setReminderEnabled(false);
              }}
            />
          </label>

          {dueDate && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
              />
              Remind me to check in (1 day before, 1 hour before, and when overdue)
            </label>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'create' ? 'Add priority' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
