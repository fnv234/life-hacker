import { useState } from 'react';
import type { Task } from '../types';
import { useTasks, subtaskProgress, canCompleteTask } from '../context/TaskContext';
import { formatDueDate, isOverdue, isDueSoon } from '../utils';
import { SubtaskList } from './SubtaskList';
import { TaskForm } from './TaskForm';

interface TaskCardProps {
  task: Task;
  variant?: 'active' | 'cloud';
}

export function TaskCard({ task, variant = 'active' }: TaskCardProps) {
  const { toggleTaskComplete, deleteTask } = useTasks();
  const [expanded, setExpanded] = useState(variant === 'active');
  const [editing, setEditing] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [blockedHint, setBlockedHint] = useState(false);

  const { done, total } = subtaskProgress(task.subtasks);
  const overdue = task.dueDate && !task.completed && isOverdue(task.dueDate);
  const dueSoon = task.dueDate && !task.completed && isDueSoon(task.dueDate);
  const completionBlocked = !canCompleteTask(task);
  const isCloud = variant === 'cloud';

  const handleComplete = () => {
    if (completionBlocked) {
      setBlockedHint(true);
      setExpanded(true);
      return;
    }
    const changed = toggleTaskComplete(task.id);
    if (changed && !task.completed) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
  };

  return (
    <>
      <article
        className={[
          'task-card',
          `priority-${task.priority}`,
          overdue ? 'overdue' : '',
          dueSoon ? 'due-soon' : '',
          justCompleted ? 'celebrate' : '',
          isCloud ? 'cloud-card' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="task-card-header">
          {!isCloud && (
            <label
              className={`task-checkbox${completionBlocked ? ' blocked' : ''}`}
              title={
                completionBlocked
                  ? 'Finish all subtasks before marking this priority complete'
                  : 'Mark complete'
              }
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleComplete}
                disabled={completionBlocked}
              />
              <span className="checkmark" />
            </label>
          )}
          <button
            type="button"
            className="task-title-btn"
            onClick={() => setExpanded((e) => !e)}
          >
            <span className="task-title">{task.title}</span>
            {total > 0 && (
              <span className="subtask-count">
                {done}/{total}
              </span>
            )}
          </button>
          <div className="task-card-actions">
            {!isCloud && (
              <button
                type="button"
                className="icon-btn"
                aria-label="Edit task"
                onClick={() => setEditing(true)}
              >
                ✎
              </button>
            )}
            {isCloud && (
              <button
                type="button"
                className="icon-btn"
                aria-label="Move back to active"
                title="Move back to active"
                onClick={() => toggleTaskComplete(task.id)}
              >
                ↩
              </button>
            )}
            <button
              type="button"
              className="icon-btn danger"
              aria-label="Delete task"
              onClick={() => deleteTask(task.id)}
            >
              ×
            </button>
          </div>
        </div>

        {blockedHint && completionBlocked && (
          <p className="subtask-hint">Finish your subtasks first — then you can check this off ✿</p>
        )}

        {task.dueDate && !isCloud && (
          <div className="task-meta">
            <span className={`due-date${overdue ? ' overdue' : ''}${dueSoon ? ' due-soon' : ''}`}>
              {task.reminderEnabled && '🔔 '}
              {formatDueDate(task.dueDate)}
            </span>
          </div>
        )}

        {task.description && !expanded && (
          <p className="task-description preview">{task.description}</p>
        )}

        {(expanded || total === 0) && !isCloud && (
          <div className="task-expanded">
            {task.description && expanded && (
              <p className="task-description">{task.description}</p>
            )}
            <SubtaskList taskId={task.id} subtasks={task.subtasks} />
            {completionBlocked && total > 0 && (
              <p className="subtask-hint subtle">
                {done} of {total} subtasks done — complete the rest when you&apos;re ready.
              </p>
            )}
          </div>
        )}

        {isCloud && task.subtasks.length > 0 && (
          <p className="cloud-subtask-note">{total} subtask{total !== 1 ? 's' : ''} cleared ✓</p>
        )}
      </article>

      {editing && (
        <TaskForm mode="edit" initialTask={task} onClose={() => setEditing(false)} />
      )}
    </>
  );
}
