import { useReminders } from '../hooks/useReminders';

export function Header() {
  const { permission, enableReminders, reminderCount } = useReminders();

  return (
    <header className="header">
      <div className="header-brand">
        <h1>Life Hacker</h1>
        <p className="header-tagline">Gentle priorities for a softer day ♡</p>
      </div>
      <div className="header-actions">
        {permission !== 'granted' ? (
          <button type="button" className="btn btn-secondary" onClick={enableReminders}>
            Enable reminders
          </button>
        ) : (
          <span className="reminder-badge">
            {reminderCount} reminder{reminderCount !== 1 ? 's' : ''} active
          </span>
        )}
      </div>
    </header>
  );
}
