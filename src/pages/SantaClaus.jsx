import { useState, useEffect } from "react";
import { solutions, executeStep } from "../problems/santaClaus";

function SantaClaus() {
  const [selectedSolution, setSelectedSolution] = useState("correct");
  const [isRunning, setIsRunning] = useState(false);
  const [delay, setDelay] = useState(500);
  const [state, setState] = useState(solutions.correct.initState());
  const [processes, setProcesses] = useState(solutions.correct.processes);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeProcess, setActiveProcess] = useState(null);

  const solution = solutions[selectedSolution];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const readyProcesses = processes.filter(
        (p) => !p.blocked || (p.blockedUntil && p.blockedUntil <= currentStep)
      );
      if (readyProcesses.length === 0) {
        console.log("Simulation halted: possible deadlock");
        setIsRunning(false);
        return;
      }

      const process =
        readyProcesses[Math.floor(Math.random() * readyProcesses.length)]; // Random scheduling
      const { newState, newProcess } = executeStep(state, process, solution);
      setState(newState);
      setProcesses(
        processes.map((p) => (p.id === process.id ? newProcess : p))
      );
      setActiveProcess({ ...newProcess });
      setCurrentStep(currentStep + 1);
    }, delay);

    return () => clearInterval(interval);
  }, [isRunning, delay, state, processes, currentStep]);

  const resetSimulation = () => {
    setState(solutions[selectedSolution].initState());
    setProcesses(solutions[selectedSolution].processes);
    setCurrentStep(0);
    setActiveProcess(null);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Santa Claus Problem
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Simulation Area */}
        <div className="md:w-1/2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Simulation</h2>
          <div className="flex flex-col gap-2">
            <p>Santa: {state.santaState}</p>
            <p>Reindeer Waiting: {state.reindeerCount}</p>
            <p>Elves Waiting: {state.elfCount}</p>
          </div>
          <div className="mt-4">
            <select
              value={selectedSolution}
              onChange={(e) => {
                setSelectedSolution(e.target.value);
                resetSimulation();
              }}
              className="p-2 border rounded"
            >
              {Object.entries(solutions).map(([key, sol]) => (
                <option key={key} value={key}>
                  {sol.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetSimulation}
              className="ml-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
          <div className="mt-2">
            <label>Speed: </label>
            <input
              type="range"
              min="100"
              max="1000"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        {/* Code Display */}
        <div className="md:w-1/2 bg-white p-4 rounded-lg shadow overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Code</h2>
          {["santa", "reindeer", "elf"].map((type) => (
            <div key={type} className="mb-4">
              <h3 className="text-lg font-medium capitalize">{type}</h3>
              <pre className="bg-gray-100 p-2 rounded">
                {solution.code[type].map((line, index) => (
                  <div
                    key={index}
                    className={
                      activeProcess?.type === type &&
                      activeProcess?.pc === index
                        ? "bg-yellow-200"
                        : ""
                    }
                  >
                    {index + 1}: {line}
                  </div>
                ))}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SantaClaus;
