import React from 'react';

const Controls = ({
  isRunning,
  setIsRunning,
  speed,
  setSpeed,
  solution,
  setSolution,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
      <button
        onClick={() => setIsRunning(!isRunning)}
        className={`px-4 py-2 rounded text-white ${
          isRunning ? 'bg-red-500' : 'bg-green-500'
        } hover:opacity-90`}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <label className="flex items-center gap-2">
        Speed:
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-32"
        />
        <span>{speed} ms</span>
      </label>
      <label className="flex items-center gap-2">
        Solution:
        <select
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="semaphore">Semaphore</option>
          <option value="monitor">Monitor</option>
          <option value="none">No Synchronization</option>
          <option value="mutex">Mutex Only</option>
        </select>
      </label>
    </div>
  );
};

export default Controls;