# Life Hacker

Organize life priorities by **high**, **medium**, and **low** — with subtasks and deadline reminders.

## Features

- Three priority columns with drag-free, focused task management
- Subtasks per priority item with progress tracking
- Due dates with optional browser reminders (1 day before, 1 hour before, overdue)
- Local persistence via `localStorage` (works offline)
- Storage abstraction ready for a future backend sync layer

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

Click **Enable reminders** in the header and allow notifications when prompted.

## Project structure

```
src/
  components/     UI (board, tasks, subtasks, forms)
  context/        Task state + provider
  storage/        TaskStorage adapter (swap for API later)
  reminders/      Browser notification logic
  types/          Shared TypeScript types
```

## Future: sync & mobile

The `TaskStorage` interface in `src/storage/types.ts` is designed so you can add an `ApiStorageAdapter` that talks to a backend — enabling sync across devices and wrapping the app in React Native or Capacitor later.
