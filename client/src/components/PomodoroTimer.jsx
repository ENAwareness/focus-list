import { useState, useEffect, useRef } from 'react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 分钟
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio('/sounds/bells.mp3'));

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            audioRef.current.play(); // 播放铃声
            alert('⏰ Time is up! Take a break!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setTimeLeft(25 * 60);
    setIsRunning(false);
  };

  return (
    <div className="text-center bg-white p-6 rounded shadow-md max-w-sm">
      {' '}
      {/* 移除了 mx-auto 和 mt-10 */}
      <h2 className="text-2xl font-bold mb-4">🍅 Pomodoro Timer</h2>
      <div className="text-5xl font-mono mb-4">{formatTime(timeLeft)}</div>
      <div className="space-x-2">
        <button
          onClick={handleStart}
          disabled={isRunning || timeLeft === 0}
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
