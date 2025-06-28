import { useState, useEffect, useRef } from 'react';

const PomodoroTimer = () => {
  const WORK_DURATION = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    // Initialize the worker
    workerRef.current = new Worker(new URL('../timer.worker.js', import.meta.url), {
      type: 'module'
    });
    audioRef.current = new Audio('/sounds/bells.mp3');

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'tick') {
        setTimeLeft((prev) => prev - 1);
      }
    };

    // Cleanup on component unmount
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      workerRef.current.postMessage({ command: 'stop' });
      audioRef.current?.play();
      alert('⏰ Time is up! Take a break!');
    }
  }, [timeLeft]);

  const handleStart = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      workerRef.current.postMessage({ command: 'start' });
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    workerRef.current.postMessage({ command: 'stop' });
    setTimeLeft(WORK_DURATION);
  };

  return (
    <div className="text-center bg-white p-6 rounded shadow-md max-w-sm">
      <h2 className="text-2xl font-bold mb-4">🍅 Pomodoro Timer</h2>
      <div className="text-5xl font-mono mb-4">{formatTime(timeLeft)}</div>
      <div className="space-x-2">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">
          Start
        </button>
        <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
