import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const PomodoroTimer = () => {
  const WORK_DURATION = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef(null);
  const audioRef = useRef(null);
  const { lang } = useLanguage();

  // --- SVG Circle Calculation ---
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (WORK_DURATION - timeLeft) / WORK_DURATION;
  const strokeDashoffset = circumference * (1 - progress);

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
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }
    };

    // Cleanup on component unmount
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      workerRef.current.postMessage({ command: 'stop' });
      audioRef.current?.play();
      alert(lang === 'ja' ? '⏰ 時間です！休憩しましょう！' : '⏰ Time is up! Take a break!');
    }
  }, [timeLeft, isRunning, lang]);

  const handleStartPause = () => {
    if (isRunning) {
      // Pause
      setIsRunning(false);
      workerRef.current.postMessage({ command: 'stop' });
    } else {
      // Start
      if (timeLeft > 0) {
        setIsRunning(true);
        workerRef.current.postMessage({ command: 'start' });
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    workerRef.current.postMessage({ command: 'stop' });
    setTimeLeft(WORK_DURATION);
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center rounded-lg bg-white p-4 shadow-lg sm:p-6 md:p-8">
      <h2 className="mb-2 flex items-center justify-center text-lg font-semibold text-gray-500 sm:text-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {lang === 'ja' ? 'ポモドーロ' : 'POMODORO'}
      </h2>
      <div className="relative mb-6 flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
        <svg className="absolute h-full w-full" viewBox="0 0 160 160">
          {/* Background Circle */}
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          {/* Progress Circle */}
          <circle
            className="text-blue-500 transition-all duration-300"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="font-mono text-4xl text-gray-800 sm:text-5xl">{formatTime(timeLeft)}</div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={handleReset}
          className="rounded-lg px-3 py-2 font-medium text-gray-500 hover:text-gray-700 sm:px-4">
          {lang === 'ja' ? 'リセット' : 'Reset'}
        </button>
        <button
          onClick={handleStartPause}
          disabled={timeLeft === 0}
          className="transform rounded-full bg-blue-500 px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8">
          {isRunning
            ? lang === 'ja'
              ? '一時停止'
              : 'Pause'
            : lang === 'ja'
            ? 'スタート'
            : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
