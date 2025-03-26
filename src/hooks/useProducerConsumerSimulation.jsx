import { useState, useEffect } from 'react';

const bufferSize = 5;

const useProducerConsumerSimulation = (solution, speed, isRunning) => {
  const [simulationState, setSimulationState] = useState({
    buffer: Array(bufferSize).fill(null),
    inIdx: 0,
    outIdx: 0,
    empty: bufferSize,
    full: 0,
    mutex: 1,
    producerState: 1, // Line index in pseudocode (1-based)
    consumerState: 1,
  });

  const step = () => {
    setSimulationState((prev) => {
      let newState = { ...prev };

      // Producer logic
      if (solution === 'semaphore') {
        if (newState.producerState === 1) { // wait(empty)
          if (newState.empty > 0) {
            newState.empty -= 1;
            newState.producerState = 2;
          }
        } else if (newState.producerState === 2) { // wait(mutex)
          if (newState.mutex > 0) {
            newState.mutex -= 1;
            newState.producerState = 3;
          }
        } else if (newState.producerState === 3) { // produce
          newState.buffer = [...newState.buffer];
          newState.buffer[newState.inIdx] = `P${Math.floor(Math.random() * 100)}`;
          newState.producerState = 4;
        } else if (newState.producerState === 4) { // update inIdx
          newState.inIdx = (newState.inIdx + 1) % bufferSize;
          newState.producerState = 5;
        } else if (newState.producerState === 5) { // signal(mutex)
          newState.mutex += 1;
          newState.producerState = 6;
        } else if (newState.producerState === 6) { // signal(full)
          newState.full += 1;
          newState.producerState = 1;
        }
      } else if (solution === 'monitor') {
        if (newState.full < bufferSize) {
          newState.buffer = [...newState.buffer];
          newState.buffer[newState.inIdx] = `P${Math.floor(Math.random() * 100)}`;
          newState.inIdx = (newState.inIdx + 1) % bufferSize;
          newState.full += 1;
          newState.empty -= 1;
          newState.producerState = 3; // Simplified to 'produce' line
        }
      } else if (solution === 'none') {
        newState.buffer = [...newState.buffer];
        newState.buffer[newState.inIdx] = `P${Math.floor(Math.random() * 100)}`;
        newState.inIdx = (newState.inIdx + 1) % bufferSize;
        newState.producerState = 3; // Simplified
      } else if (solution === 'mutex') {
        if (newState.mutex > 0 && newState.full < bufferSize) {
          newState.mutex -= 1;
          newState.buffer = [...newState.buffer];
          newState.buffer[newState.inIdx] = `P${Math.floor(Math.random() * 100)}`;
          newState.inIdx = (newState.inIdx + 1) % bufferSize;
          newState.full += 1;
          newState.empty -= 1;
          newState.mutex += 1;
          newState.producerState = 3; // Simplified
        }
      }

      // Consumer logic
      if (solution === 'semaphore') {
        if (newState.consumerState === 1) { // wait(full)
          if (newState.full > 0) {
            newState.full -= 1;
            newState.consumerState = 2;
          }
        } else if (newState.consumerState === 2) { // wait(mutex)
          if (newState.mutex > 0) {
            newState.mutex -= 1;
            newState.consumerState = 3;
          }
        } else if (newState.consumerState === 3) { // consume
          newState.buffer = [...newState.buffer];
          newState.buffer[newState.outIdx] = null;
          newState.consumerState = 4;
        } else if (newState.consumerState === 4) { // update outIdx
          newState.outIdx = (newState.outIdx + 1) % bufferSize;
          newState.consumerState = 5;
        } else if (newState.consumerState === 5) { // signal(mutex)
          newState.mutex += 1;
          newState.consumerState = 6;
        } else if (newState.consumerState === 6) { // signal(empty)
          newState.empty += 1;
          newState.consumerState = 1;
        }
      } else if (solution === 'monitor') {
        if (newState.full > 0) {
          newState.buffer = [...newState.buffer];
          newState.buffer[newState.outIdx] = null;
          newState.outIdx = (newState.outIdx + 1) % bufferSize;
          newState.full -= 1;
          newState.empty += 1;
          newState.consumerState = 3; // Simplified
        }
      } else if (solution === 'none') {
        newState.buffer = [...newState.buffer];
        newState.buffer[newState.outIdx] = null;
        newState.outIdx = (newState.outIdx + 1) % bufferSize;
        newState.consumerState = 3; // Simplified
      } else if (solution === 'mutex') {
        if (newState.mutex > 0 && newState.full > 0) {
          newState.mutex -= 1;
          newState.buffer = [...newState.buffer];
          newState.buffer[newState.outIdx] = null;
          newState.outIdx = (newState.outIdx + 1) % bufferSize;
          newState.full -= 1;
          newState.empty += 1;
          newState.mutex += 1;
          newState.consumerState = 3; // Simplified
        }
      }

      return newState;
    });
  };

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(step, speed);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, speed, solution]);

  return simulationState;
};

export default useProducerConsumerSimulation;