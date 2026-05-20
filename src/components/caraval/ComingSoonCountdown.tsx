"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function ComingSoonCountdown({ dataLancio }: { dataLancio: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(dataLancio).getTime();
    if (Number.isNaN(target)) return;

    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [dataLancio]);

  if (!timeLeft) return null;

  return (
    <div className="coming-soon-countdown" aria-live="polite">
      <div className="countdown-block">
        <span className="countdown-numero">{timeLeft.days}</span>
        <span className="countdown-label">Giorni</span>
      </div>
      <div className="countdown-block">
        <span className="countdown-numero">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="countdown-label">Ore</span>
      </div>
      <div className="countdown-block">
        <span className="countdown-numero">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="countdown-label">Minuti</span>
      </div>
      <div className="countdown-block">
        <span className="countdown-numero">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="countdown-label">Secondi</span>
      </div>
    </div>
  );
}

export default ComingSoonCountdown;
