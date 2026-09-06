import { TaskProvider } from './context/TaskProvider';
import { Header } from './components/Header';
import { PriorityBoard } from './components/PriorityBoard';
import './index.css';

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <Header />
        <main>
          <PriorityBoard />
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;
