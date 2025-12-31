"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  endDate: string; // ISO date string
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function DealCountdown({ endDate }: CountdownProps) {
  const calculateTimeLeft = (): TimeLeft => {
    const diff = +new Date(endDate) - +new Date();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 justify-center">
      <TimeBox label="Days" value={timeLeft.days} />
      <TimeBox label="Hours" value={timeLeft.hours} />
      <TimeBox label="Minutes" value={timeLeft.minutes} />
      <TimeBox label="Seconds" value={timeLeft.seconds} />
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div
      aria-label={`${value} ${label}`}
      className="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-center min-w-[70px] shadow-md"
    >
      <p className="text-xl font-bold">{String(value).padStart(2, "0")}</p>
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </div>
  );
}
