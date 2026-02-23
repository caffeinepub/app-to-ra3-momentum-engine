import { useState, useEffect } from 'react';

export function useRefreshTimer(intervalMs: number = 60000) {
  const [countdown, setCountdown] = useState(60);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Reset countdown when interval changes
    setCountdown(Math.floor(intervalMs / 1000));
    setLastUpdate(new Date());

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setLastUpdate(new Date());
          return Math.floor(intervalMs / 1000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [intervalMs]);

  const resetTimer = () => {
    setCountdown(Math.floor(intervalMs / 1000));
    setLastUpdate(new Date());
  };

  return {
    countdown,
    lastUpdate,
    resetTimer,
  };
}
