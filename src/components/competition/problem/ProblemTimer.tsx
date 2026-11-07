"use client";

import Image from "next/image";
import TimerIcon from "@/assets/competitions/solve/timer.png";
import useDeadlineCountdown from "@/hooks/useDeadlineCountdown";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import QuestionSurface from "./ProblemSurface";

const COMPETITION_DURATION_MS = 30 * 60 * 1000;

export default function ProblemTimer({ onExpire }: { onExpire: () => void }) {
  const participation = useCompetitionParticipationStore(
    (state) => state.participation,
  );

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
  const { current: remainingSeconds } = useDeadlineCountdown({
    deadlineMs: hasDeadline ? deadlineTimestamp : null,
    onExpire,
  });

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
    <QuestionSurface compact>
      <div className="flex items-center justify-between gap-3 md:flex-col md:justify-start md:gap-0">
        <div className="flex items-center gap-1">
          <Image src={TimerIcon} alt="timer" width={20} height={14} />
          <p className="text-primary-900 text-[11px] font-semibold md:text-[13px]">
            남은 시간
          </p>
        </div>
        <p
          className={`${timeColor} text-[24px] font-bold tabular-nums md:text-[36px]`}
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
