"use client";

import { useEffect, useRef, useState } from "react";

type CountdownSource =
  | { durationSeconds: number; resetKey: string; deadlineMs?: never }
  | { deadlineMs: number | null; durationSeconds?: never; resetKey?: never };

type CountdownOptions = CountdownSource & {
  intervalMs?: number;
  onExpire?: () => void;
};

interface CountdownValue {
  current: number | null;
  previous: number | null;
}

const secondsUntil = (deadlineMs: number) =>
  Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000));

export default function useDeadlineCountdown({
  durationSeconds,
  deadlineMs,
  resetKey,
  intervalMs = 1000,
  onExpire,
}: CountdownOptions): CountdownValue {
  const [countdown, setCountdown] = useState<CountdownValue>(() => ({
    current:
      durationSeconds !== undefined
        ? Math.max(0, durationSeconds)
        : deadlineMs === null
          ? null
          : secondsUntil(deadlineMs),
    previous: null,
  }));
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const deadline =
      durationSeconds !== undefined
        ? Date.now() + Math.max(0, durationSeconds) * 1000
        : deadlineMs;

    if (deadline === null) {
      const resetId = window.setTimeout(() => {
        setCountdown({ current: null, previous: null });
      }, 0);

      return () => window.clearTimeout(resetId);
    }

    let expired = false;
    const tick = () => {
      const nextSeconds = secondsUntil(deadline);

      setCountdown((previous) =>
        previous.current === nextSeconds
          ? previous
          : { current: nextSeconds, previous: previous.current },
      );

      if (nextSeconds === 0 && !expired) {
        expired = true;
        window.clearInterval(intervalId);
        onExpireRef.current?.();
      }
    };

    const intervalId = window.setInterval(tick, intervalMs);
    const initialTickId = window.setTimeout(tick, 0);

    return () => {
      window.clearTimeout(initialTickId);
      window.clearInterval(intervalId);
    };
  }, [deadlineMs, durationSeconds, intervalMs, resetKey]);

  return countdown;
}
