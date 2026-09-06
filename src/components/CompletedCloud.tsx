import { PRIORITY_LABELS } from '../types';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';

export function CompletedCloud() {
  const { completedTasks } = useTasks();
  const count = completedTasks.length;

  const messages = [
    'Your little wins, floating softly above.',
    'Look at you — making space for what matters.',
    'Every finished priority earns its place in the sky.',
  ];
  const message = messages[count % messages.length];

  return (
    <section className="completed-cloud-section" aria-label="Completed priorities">
      <div className="cloud-header">
        <h2>Completed cloud</h2>
        <span className="cloud-count">{count} floating</span>
      </div>
      <p className="cloud-tagline">{message}</p>

      <div className={`cloud-stage${count === 0 ? ' empty' : ''}`}>
        <div className="cloud-shape" aria-hidden="true">
          <div className="cloud-puff puff-1" />
          <div className="cloud-puff puff-2" />
          <div className="cloud-puff puff-3" />
          <div className="cloud-puff puff-4" />
          <div className="cloud-puff puff-5" />
        </div>

        {count === 0 ? (
          <p className="cloud-empty">Complete a priority to see it drift up here ✨</p>
        ) : (
          <ul className="cloud-bubbles">
            {completedTasks.map((task, i) => (
              <li
                key={task.id}
                className={`cloud-bubble priority-${task.priority}`}
                style={{ animationDelay: `${(i % 5) * 0.4}s` }}
              >
                <span className="bubble-dot" aria-hidden="true" />
                <span className="bubble-title">{task.title}</span>
                <span className="bubble-priority">{PRIORITY_LABELS[task.priority]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {count > 0 && (
        <details className="cloud-details">
          <summary>View completed details</summary>
          <div className="cloud-detail-list">
            {completedTasks.map((task) => (
              <div key={task.id} className="cloud-detail-item">
                <TaskCard task={task} variant="cloud" />
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
