// This code was created by DeepSeek AI
import { useState, useEffect, useRef, useCallback } from 'react';



export const useInterval = (callback, delay) => {
  const [isRunning, setIsRunning] = useState(false);
  const savedCallback = useRef();
  const intervalId = useRef();
  const startTime = useRef();
  const remainingTime = useRef(delay);

  // Сохраняем последний callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    startTime.current = Date.now();
    
    intervalId.current = setInterval(() => {
      savedCallback.current();
      startTime.current = Date.now();
    }, delay);
  }, [isRunning, delay]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    
    clearInterval(intervalId.current);
    const elapsed = Date.now() - startTime.current;
    remainingTime.current = Math.max(0, delay - elapsed);
    setIsRunning(false);
  }, [isRunning, delay]);

  const resume = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalId.current = setInterval(() => {
      savedCallback.current();
      startTime.current = Date.now();
    }, remainingTime.current);
  }, [isRunning]);

  const reset = () => {
    clearInterval(intervalId.current);
    setIsRunning(false);
    remainingTime.current = delay;
  }

  // Очистка при размонтировании
  useEffect(() => {
    return () => clearInterval(intervalId.current);
  }, []);

  return {
    isRunning,
    start,
    pause,
    resume,
    reset
  };
};