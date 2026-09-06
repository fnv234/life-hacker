import { useState } from 'react';
import type { Priority } from '../types';
import { PRIORITY_LABELS } from '../types';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';

interface PriorityColumnProps {
  priority: Priority;
}

export function PriorityColumn({ priority }: PriorityColumnProps) {
  const { tasksByPriority } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const columnTasks = tasksByPriority(priority);

  return (
    <section className={`priority-column priority-${priority}`}>
      <div className="column-header">
        <h2>{PRIORITY_LABELS[priority]}</h2>
        <span className="column-count">{columnTasks.length}</span>
      </div>

      <div className="column-tasks">
        {columnTasks.length === 0 ? (
          <p className="column-empty">Nothing here yet — add something when you&apos;re ready ♡</p>
        ) : (
          columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      <button type="button" className="btn btn-add" onClick={() => setShowForm(true)}>
        + add {PRIORITY_LABELS[priority].toLowerCase()}
      </button>

      {showForm && (
        <TaskForm
          mode="create"
          defaultPriority={priority}
          onClose={() => setShowForm(false)}
        />
      )}
    </section>
  );
}
