import { useState, useEffect, useRef } from "react";

interface UseTimeProgressOptions {
  time: number;
}

interface UseTimeProgressReturn {
  progress: number;
  start: () => void;
  stop: () => void;
}

export function useTimeProgress(
  options: UseTimeProgressOptions
): UseTimeProgressReturn {
  const { time } = options;
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  };

  const start = () => {
    cleanup();
    setProgress(0);

    if (time <= 0) {
      return;
    }

    const intervalTime = Math.max(100, (time * 1000) / 10);
    const progressIncrement = 100 / 10;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 100;
        }
        return prev + progressIncrement;
      });
    }, intervalTime);
  };

  const stop = () => {
    cleanup();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { progress, start, stop };
}
