"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import TimerIcon from "@/assets/contests/solve/timer.png";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import QuestionSurface from "./QuestionSurface";

const COMPETITION_DURATION_MS = 30 * 60 * 1000;

export default function QuestionTimer() {
  const participation = useCompetitionParticipationStore(
    (state) => state.participation,
  );
  const [now, setNow] = useState(() => Date.now());

  const startedAtTimestamp = participation
    ? Date.parse(participation.startedAt)
    : Number.NaN;
  const serverExpiresAtTimestamp = participation
    ? Date.parse(participation.expiresAt)
    : Number.NaN;
  const participationExpiresAtTimestamp = Number.isFinite(startedAtTimestamp)
    ? startedAtTimestamp + COMPETITION_DURATION_MS
    : Number.NaN;
  const deadlineTimestamp = Number.isFinite(serverExpiresAtTimestamp)
    ? Math.min(participationExpiresAtTimestamp, serverExpiresAtTimestamp)
    : participationExpiresAtTimestamp;
  const hasDeadline = Number.isFinite(deadlineTimestamp);
  const remainingSeconds = hasDeadline
    ? Math.max(0, Math.ceil((deadlineTimestamp - now) / 1000))
    : null;

  useEffect(() => {
    if (!hasDeadline) return;

    const intervalId = window.setInterval(() => {
      const currentTime = Date.now();

      setNow(currentTime);

      if (currentTime >= deadlineTimestamp) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [deadlineTimestamp, hasDeadline]);

  const minutes =
    remainingSeconds === null
      ? "--"
      : String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds =
    remainingSeconds === null
      ? "--"
      : String(remainingSeconds % 60).padStart(2, "0");
  const timeColor =
    remainingSeconds !== null && remainingSeconds <= 5 * 60
      ? "text-error"
      : "text-primary-900";

  return (
    <QuestionSurface>
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-1">
          <Image src={TimerIcon} alt="timer" width={20} height={14} />
          <p className="text-primary-900 text-[13px] font-semibold">
            남은 시간
          </p>
        </div>
        <p
          className={`${timeColor} text-[36px] font-bold tabular-nums`}
          role="timer"
          aria-label={
            remainingSeconds === null
              ? "남은 시간 정보 없음"
              : `남은 시간 ${Math.floor(remainingSeconds / 60)}분 ${remainingSeconds % 60}초`
          }
        >
          {minutes} : {seconds}
        </p>
      </div>
    </QuestionSurface>
  );
}
