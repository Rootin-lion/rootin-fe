"use client";

import type { CompetitionStatus } from "@/types/competitions/competition";
import useDeadlineCountdown from "@/hooks/useDeadlineCountdown";

interface ContestCountdownProps {
  initialSeconds: number;
  status: CompetitionStatus;
  onExpire?: () => void;
}

interface RollingTimeUnitProps {
  value: number;
  previousValue: number | null;
  unit: TimeUnit;
  widthClass: string;
}

type TimeUnit = "시간" | "분" | "초";
type TimeDisplayMode = "HOURS_MINUTES" | "MINUTES_SECONDS";

interface DisplayTime {
  mode: TimeDisplayMode;
  primaryValue: number;
  primaryUnit: TimeUnit;
  secondaryValue: number;
  secondaryUnit: TimeUnit;
}

const getDisplayTime = (totalSeconds: number): DisplayTime => {
  if (totalSeconds >= 60 * 60) {
    return {
      mode: "HOURS_MINUTES",
      primaryValue: Math.floor(totalSeconds / (60 * 60)),
      primaryUnit: "시간",
      secondaryValue: Math.floor((totalSeconds % (60 * 60)) / 60),
      secondaryUnit: "분",
    };
  }

  return {
    mode: "MINUTES_SECONDS",
    primaryValue: Math.floor(totalSeconds / 60),
    primaryUnit: "분",
    secondaryValue: totalSeconds % 60,
    secondaryUnit: "초",
  };
};

const RollingTimeUnit = ({
  value,
  previousValue,
  unit,
  widthClass,
}: RollingTimeUnitProps) => {
  const isChanging = previousValue !== null && previousValue !== value;

  return (
    <span className="inline-flex items-center leading-6">
      <span
        className={`relative inline-block h-6 overflow-y-clip ${widthClass}`}
      >
        {isChanging && (
          <span
            key={`out-${previousValue}-${value}`}
            className="animate-countdown-slide-out absolute inset-0 flex items-center justify-end leading-6 motion-reduce:hidden"
          >
            {previousValue}
          </span>
        )}
        <span
          key={`in-${value}`}
          className={`${isChanging ? "animate-countdown-slide-in absolute inset-0" : "absolute inset-0"} flex items-center justify-end leading-6 motion-reduce:animate-none`}
        >
          {value}
        </span>
      </span>
      <span className="leading-6">{unit}</span>
    </span>
  );
};

export default function CompetitionCountdown({
  initialSeconds,
  status,
  onExpire,
}: ContestCountdownProps) {
  const countdown = useDeadlineCountdown({
    durationSeconds: initialSeconds,
    resetKey: status,
    intervalMs: 250,
    onExpire,
  });

  const secondsLeft = countdown.current ?? 0;
  const displayTime = getDisplayTime(secondsLeft);
  const previousDisplayTime =
    countdown.previous === null ? null : getDisplayTime(countdown.previous);
  const isSameDisplayMode = previousDisplayTime?.mode === displayTime.mode;
  const formattedTime = `${displayTime.primaryValue}${displayTime.primaryUnit} ${displayTime.secondaryValue}${displayTime.secondaryUnit}`;
  const timeColor = secondsLeft <= 300 ? "text-error" : "text-primary-900";

  return (
    <p
      className={`${timeColor} min-w-24 text-[20px] leading-6 font-bold tabular-nums`}
      aria-label={`남은 시간 ${formattedTime}`}
    >
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        <RollingTimeUnit
          value={displayTime.primaryValue}
          previousValue={
            isSameDisplayMode && previousDisplayTime
              ? previousDisplayTime.primaryValue
              : null
          }
          unit={displayTime.primaryUnit}
          widthClass={
            displayTime.primaryValue < 10 ? "min-w-[1ch]" : "min-w-[2ch]"
          }
        />
        <RollingTimeUnit
          value={displayTime.secondaryValue}
          previousValue={
            isSameDisplayMode && previousDisplayTime
              ? previousDisplayTime.secondaryValue
              : null
          }
          unit={displayTime.secondaryUnit}
          widthClass={
            displayTime.secondaryValue < 10 ? "min-w-[1ch]" : "min-w-[2ch]"
          }
        />
      </span>
    </p>
  );
}
