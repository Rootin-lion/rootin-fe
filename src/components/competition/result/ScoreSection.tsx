import type { CompetitionResultState } from "@/types/competitions/competition";
import SectionTitle from "./SectionTitle";
import SelectedNumber from "./SelectedNumber";

const ResultStats = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap justify-between gap-x-1">{children}</div>
  );
};

const ResultStatsItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-sub-text text-[11px] font-medium md:text-[12px]">
      {children}
    </p>
  );
};

export default function ScoreSection({
  competitionResult,
}: {
  competitionResult: CompetitionResultState;
}) {
  const solvingMinutes = String(
    Math.floor(competitionResult.solvingTimeSeconds / 60),
  ).padStart(2, "0");
  const solvingSeconds = String(
    competitionResult.solvingTimeSeconds % 60,
  ).padStart(2, "0");

  return (
    <section className="contents md:mt-5 md:block md:w-full">
      <div className="col-start-1 row-start-1 min-w-0">
        <SectionTitle>내 점수</SectionTitle>
        <p className="text-[12px] font-semibold text-black md:text-[14px]">
          <SelectedNumber>{competitionResult.score}점</SelectedNumber> {""}/{" "}
          {competitionResult.totalScore}점
        </p>
      </div>
      <div className="col-start-1 row-start-2 flex min-w-0 flex-col gap-1 md:mt-4 md:gap-2">
        <ResultStats>
          <ResultStatsItem>정답 수</ResultStatsItem>
          <ResultStatsItem>
            {competitionResult.correctCount} / {competitionResult.totalCount}
          </ResultStatsItem>
        </ResultStats>
        <ResultStats>
          <ResultStatsItem>소요 시간</ResultStatsItem>
          <ResultStatsItem>
            {solvingMinutes} : {solvingSeconds}
          </ResultStatsItem>
        </ResultStats>
      </div>
    </section>
  );
}
