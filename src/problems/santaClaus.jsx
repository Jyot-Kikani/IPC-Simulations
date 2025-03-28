export const solutions = {
  correct: {
    name: "Correct (Semaphore with Priority)",
    description: "Santa prioritizes reindeer, handles elves in groups of 3.",
    code: {
      santa: [
        "while (true) {",
        "  wait(santaSem)          // Wait to be woken",
        "  wait(mutex)",
        "  if (reindeerCount == 9) {",
        '    print("Santa helps reindeer")',
        "    reindeerCount = 0",
        "    signal_n(reindeerSem, 9)  // Release all reindeer",
        "  } else if (elfCount == 3) {",
        '    print("Santa helps elves")',
        "    elfCount = 0",
        "    signal_n(elfSem, 3)       // Release 3 elves",
        "  }",
        "  signal(mutex)",
        "}",
      ],
      reindeer: [
        "wait(mutex)",
        "reindeerCount++",
        "if (reindeerCount == 9) {",
        "  signal(santaSem)        // Wake Santa",
        "}",
        "signal(mutex)",
        "wait(reindeerSem)          // Wait for Santa",
        'print("Reindeer returns")',
      ],
      elf: [
        "wait(mutex)",
        "elfCount++",
        "if (elfCount == 3) {",
        "  signal(santaSem)        // Wake Santa",
        "}",
        "signal(mutex)",
        "wait(elfSem)               // Wait for Santa",
        'print("Elf resumes")',
      ],
    },
    initState: () => ({
      reindeerCount: 0,
      elfCount: 0,
      santaState: "sleeping",
      santaSem: { counter: 0, waiting: [] },
      reindeerSem: { counter: 0, waiting: [] },
      elfSem: { counter: 0, waiting: [] },
      mutex: { counter: 1, waiting: [] },
    }),
    processes: [
      { type: "santa", id: "santa", pc: 0, blocked: false },
      { type: "reindeer", id: "r1", pc: 0, blocked: false },
      { type: "reindeer", id: "r2", pc: 0, blocked: false },
      { type: "reindeer", id: "r3", pc: 0, blocked: false },
      { type: "elf", id: "e1", pc: 0, blocked: false },
      { type: "elf", id: "e2", pc: 0, blocked: false },
      { type: "elf", id: "e3", pc: 0, blocked: false },
    ],
  },
  incorrect: {
    name: "Incorrect (Simple Locks)",
    description: "No priority, may starve reindeer due to elf overload.",
    code: {
      santa: [
        "while (true) {",
        "  wait(lock)          // Wait for any signal",
        "  if (reindeerCount >= 1) {",
        '    print("Santa helps reindeer")',
        "    reindeerCount--",
        "    signal(lock)",
        "  } else if (elfCount >= 1) {",
        '    print("Santa helps elf")',
        "    elfCount--",
        "    signal(lock)",
        "  }",
        "}",
      ],
      reindeer: [
        "wait(lock)",
        "reindeerCount++",
        "signal(lock)",
        "wait(lock)          // Wait for Santa",
        'print("Reindeer returns")',
        "signal(lock)",
      ],
      elf: [
        "wait(lock)",
        "elfCount++",
        "signal(lock)",
        "wait(lock)          // Wait for Santa",
        'print("Elf resumes")',
        "signal(lock)",
      ],
    },
    initState: () => ({
      reindeerCount: 0,
      elfCount: 0,
      santaState: "sleeping",
      lock: { counter: 1, waiting: [] },
    }),
    processes: [
      { type: "santa", id: "santa", pc: 0, blocked: false },
      { type: "reindeer", id: "r1", pc: 0, blocked: false },
      { type: "reindeer", id: "r2", pc: 0, blocked: false },
      { type: "reindeer", id: "r3", pc: 0, blocked: false },
      { type: "elf", id: "e1", pc: 0, blocked: false },
      { type: "elf", id: "e2", pc: 0, blocked: false },
      { type: "elf", id: "e3", pc: 0, blocked: false },
    ],
  },
};

export function executeStep(state, process, solution) {
  const code = solution.code[process.type];
  const line = code[process.pc];
  let newState = { ...state };
  let newPc = process.pc + 1;
  let blocked = false;

  if (process.type === "santa") {
    if (line.includes("wait(santaSem)") || line.includes("wait(lock)")) {
      const sem = solution.name.includes("Correct") ? "santaSem" : "lock";
      if (newState[sem].counter > 0) {
        newState[sem].counter--;
      } else {
        newState[sem].waiting.push(process.id);
        blocked = true;
      }
    } else if (line.includes("if (reindeerCount")) {
      if (solution.name.includes("Correct") && newState.reindeerCount !== 9) {
        newPc = 7; // Jump to else if
      } else if (
        !solution.name.includes("Correct") &&
        newState.reindeerCount < 1
      ) {
        newPc = 6; // Jump to else if
      }
    } else if (
      line.includes("signal_n(reindeerSem") ||
      line.includes("signal(lock)")
    ) {
      const sem = solution.name.includes("Correct") ? "reindeerSem" : "lock";
      newState[sem].counter += solution.name.includes("Correct") ? 9 : 1;
      newState[sem].waiting = [];
      newState.santaState = "helping reindeer";
    } else if (line.includes("signal_n(elfSem")) {
      newState.elfSem.counter += 3;
      newState.elfSem.waiting = [];
      newState.santaState = "helping elves";
    } else if (line.includes("signal(mutex)")) {
      newState.mutex.counter++;
      newState.mutex.waiting.shift();
    }
  } else if (process.type === "reindeer") {
    if (line.includes("wait(mutex)") || line.includes("wait(lock)")) {
      const sem = solution.name.includes("Correct") ? "mutex" : "lock";
      if (newState[sem].counter > 0) {
        newState[sem].counter--;
      } else {
        blocked = true;
      }
    } else if (line.includes("reindeerCount++")) {
      newState.reindeerCount++;
    } else if (line.includes("signal(santaSem")) {
      newState.santaSem.counter++;
      newState.santaSem.waiting.shift();
    } else if (line.includes("wait(reindeerSem")) {
      if (newState.reindeerSem.counter > 0) {
        newState.reindeerSem.counter--;
      } else {
        blocked = true;
      }
    } else if (line.includes("signal(mutex)")) {
      newState.mutex.counter++;
      newState.mutex.waiting.shift();
    }
  } else if (process.type === "elf") {
    if (line.includes("wait(mutex)") || line.includes("wait(lock)")) {
      const sem = solution.name.includes("Correct") ? "mutex" : "lock";
      if (newState[sem].counter > 0) {
        newState[sem].counter--;
      } else {
        blocked = true;
      }
    } else if (line.includes("elfCount++")) {
      newState.elfCount++;
    } else if (line.includes("signal(santaSem")) {
      newState.santaSem.counter++;
      newState.santaSem.waiting.shift();
    } else if (line.includes("wait(elfSem")) {
      if (newState.elfSem.counter > 0) {
        newState.elfSem.counter--;
      } else {
        blocked = true;
      }
    } else if (line.includes("signal(mutex)")) {
      newState.mutex.counter++;
      newState.mutex.waiting.shift();
    }
  }

  return { newState, newProcess: { ...process, pc: newPc, blocked } };
}
