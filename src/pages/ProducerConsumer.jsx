import React, { useState } from 'react';
import useProducerConsumerSimulation from '../hooks/useProducerConsumerSimulation';
import BufferVisualization from '../components/BufferVisualization';
import Controls from '../components/Controls';
import PseudocodePanel from '../components/PseudocodePanel';

// Define pseudocode for producer and consumer
const producerPseudocode = [
  'while (true) {',
  '  wait(empty)',
  '  wait(mutex)',
  '  buffer[in] = item',
  '  in = (in + 1) % bufferSize',
  '  signal(mutex)',
  '  signal(full)',
  '}',
];

const consumerPseudocode = [
  'while (true) {',
  '  wait(full)',
  '  wait(mutex)',
  '  item = buffer[out]',
  '  out = (out + 1) % bufferSize',
  '  signal(mutex)',
  '  signal(empty)',
  '}',
];

const ProducerConsumer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000); // Speed in milliseconds
  const [solution, setSolution] = useState('semaphore');

  const simulationState = useProducerConsumerSimulation(solution, speed, isRunning);

  const { buffer, producerState, consumerState } = simulationState;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Producer-Consumer Problem
      </h1>
      <BufferVisualization buffer={buffer} />
      <Controls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        speed={speed}
        setSpeed={setSpeed}
        solution={solution}
        setSolution={setSolution}
      />
      <PseudocodePanel
        producerCode={producerPseudocode}
        consumerCode={consumerPseudocode}
        producerHighlightedLine={producerState}
        consumerHighlightedLine={consumerState}
      />
    </div>
  );
};

export default ProducerConsumer;