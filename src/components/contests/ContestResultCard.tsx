import { ContestResultsState } from "@/types/contests/competition";
import React from "react";

const CardButton = ({
  children,
  isDisabled,
  onClick,
}: {
  children: React.ReactNode;
  isDisabled: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`${isDisabled ? "border-disabled-text" : "border-primary-900"} cursor-pointer rounded-2xl border px-4 py-1 text-[12px] font-semibold ${isDisabled ? "text-disabled-text" : "text-black"}`}
    >
      {children}
    </button>
  );
};

export default function ContestResultCard({
  contests,
}: {
  contests: ContestResultsState;
}) {
  return (
    <div className="flex w-full max-w-102 flex-col gap-9 rounded-lg border border-[#E1E1E1] px-8 py-5">
      <div className="flex items-baseline gap-3">
        <div className="flex flex-col gap-3">
          <p className="text-text text-[16px] font-semibold">
            {contests.competitionDate}
          </p>
          <p className="text-disabled-text text-[12px] font-semibold">
            {contests.participantCount}명이 참가했어요
          </p>
        </div>
        <p className="text-text text-[12px] font-medium">
          {contests.problemCount}문제 · {contests.timeLimitMinutes}분
        </p>
      </div>

      <div className="text-right">
        <CardButton isDisabled={contests.viewable}>결과 보기</CardButton>
      </div>
    </div>
  );
}
