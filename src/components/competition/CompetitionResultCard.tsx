import { useRouter } from "next/navigation";
import GradientOutlineButton from "@/components/shared/GradientOutlineButton";
import type { ContestResultsState } from "@/types/competitions/competition";

export default function CompetitionResultCard({
  contest,
}: {
  contest: ContestResultsState;
}) {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-102 flex-col gap-9 rounded-lg border border-[#E1E1E1] px-8 py-5">
      <div className="flex items-baseline gap-3">
        <div className="flex flex-col gap-3">
          <p className="text-text text-[16px] font-semibold">
            {contest.competitionDate.replaceAll("-", ".")}(
            {new Date(contest.competitionDate).toLocaleDateString("ko-KR", {
              weekday: "short",
              timeZone: "Asia/Seoul",
            })}
            )
          </p>
          <p className="text-disabled-text text-[12px] font-semibold">
            {contest.participantCount}명이 참가했어요
          </p>
        </div>
        <p className="text-text text-[12px] font-medium">
          {contest.problemCount}문제 · {contest.timeLimitMinutes}분
        </p>
      </div>

      <div className="text-right">
        <GradientOutlineButton
          variant="outline"
          disabled={!contest.viewable}
          onClick={() => {
            router.push(`/competitions/${contest.competitionId}/result`);
          }}
        >
          결과 보기
        </GradientOutlineButton>
      </div>
    </div>
  );
}
