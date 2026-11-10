"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import TimerIcon from "@/assets/icons/shared/timer.png";

const INTERVIEW_DURATION_MS = 30 * 60 * 1000;

export default function SessionTimer({ interviewId }: { interviewId: number }) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    const key = `interview-deadline:${interviewId}`;
    const savedDeadline = Number(window.sessionStorage.getItem(key));
    const deadline =
      Number.isFinite(savedDeadline) && savedDeadline > 0
        ? savedDeadline
        : Date.now() + INTERVIEW_DURATION_MS;

    if (deadline !== savedDeadline) {
      window.sessionStorage.setItem(key, String(deadline));
    }

    const updateRemainingTime = () => {
      setRemainingSeconds(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
      );
    };

    updateRemainingTime();
    const intervalId = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(intervalId);
  }, [interviewId]);

  const time =
    remainingSeconds === null
      ? "--:--"
      : `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  return (
    <div className="flex min-h-11 items-center gap-3 rounded-xl bg-[#F0F0F0] px-4 py-2 md:min-h-13 md:gap-5 md:px-5">
      <Image src={TimerIcon} alt="" className="h-6 w-6 md:h-9 md:w-9" />
      <p
        className="text-primary-900 text-[22px] font-bold tabular-nums md:text-[30px]"
        role="timer"
        aria-label="면접 남은 시간"
      >
        {time}
      </p>
    </div>
  );
}
