"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="font-mono text-xs text-zinc-300"> {/* Adjust text color as needed */}
      <div className="mb-0.5 tracking-tight">{format(currentTime, 'MMM d, yyyy')}</div> {/* Dec 18, 2024 */}
      <div>{format(currentTime, 'h:mm:ss a')}</div> {/* 5:53:25 PM */}
    </div>
  );
}
