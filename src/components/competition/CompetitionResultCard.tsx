import { useRouter } from "next/navigation";
import type { CompetitionResults } from "@/types/competitions/competition";
import GradientOutlineButton from "@/components/shared/GradientOutlineButton";
import { formatCompetitionDateWithWeekday } from "@/lib/competitions/formatCompetitionDateWithWeekday";

export default function CompetitionResultCard({
  contest,
}: {
  contest: CompetitionResults;
}) {
  const router = useRouter();

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-[#E1E1E1] p-3 md:max-w-102 md:gap-9 md:p-4 lg:px-8 lg:py-5">
      <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
        <div className="flex flex-col gap-1 md:gap-3">
          <p className="text-text text-[14px] font-semibold md:text-[16px]">
            {formatCompetitionDateWithWeekday(contest.competitionDate)}
          </p>
          <p className="text-disabled-text text-[11px] font-semibold md:text-[12px]">
            {contest.participantCount}명이 참가했어요
          </p>
        </div>
        <p className="text-text text-[11px] font-medium md:text-[12px]">
          {contest.problemCount}문제 · {contest.timeLimitMinutes}분
        </p>
      </div>

      <div className="text-right">
        <GradientOutlineButton
          variant="outline"
          className="w-auto max-md:px-3 max-md:text-[11px]"
          disabled={contest.viewable !== true}
          onClick={() => {
            if (!contest.viewable) return;

            router.push(`/competitions/${contest.competitionId}/result`);
          }}
        >
          결과 보기
        </GradientOutlineButton>
      </div>
    </div>
  );
}
