import React, { useState, useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

export default function BookingTimer({ initialSeconds = 300, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60;
  const isWarning = timeLeft < 120;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
        isUrgent
          ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse'
          : isWarning
          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
          : 'bg-white/5 border-white/10 text-gray-300'
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
      ) : (
        <Timer className="w-3.5 h-3.5 text-[#2575fc]" />
      )}
      <span>Sisa Waktu Pemesanan:</span>
      <span className="font-mono text-white text-sm">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
