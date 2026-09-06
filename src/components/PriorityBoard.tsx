import { PRIORITY_ORDER } from '../types';
import { PriorityColumn } from './PriorityColumn';
import { CompletedCloud } from './CompletedCloud';

export function PriorityBoard() {
  return (
    <>
      <div className="priority-board">
        {PRIORITY_ORDER.map((priority) => (
          <PriorityColumn key={priority} priority={priority} />
        ))}
      </div>
      <CompletedCloud />
    </>
  );
}
