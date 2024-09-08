import { useCallback, useEffect, useState } from "react";

type CountdownProps = {
  expiryDate: string; // Formato ISO "yyyy-MM-ddTHH:mm:ss.SSSz"
};

type TimeLeft = {
  minutes: number;
  seconds: number;
} | null;

export const CountdownTimer = ({ expiryDate }: CountdownProps) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +new Date(expiryDate) - +new Date();

    if (difference > 0) {
      return {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return null;
  }, [expiryDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div>
      {timeLeft ? (
        <span>
          {timeLeft.minutes}:
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}{" "}
          restantes
        </span>
      ) : (
        <span>Expirado</span>
      )}
    </div>
  );
};
