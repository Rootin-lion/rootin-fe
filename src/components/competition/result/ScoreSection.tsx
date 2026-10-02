import type { CompetitionResultState } from "@/types/competitions/competition";
import SectionTitle from "./SectionTitle";
import SelectedNumber from "./SelectedNumber";

const ResultStats = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-between">{children}</div>;
};

const ResultStatsItem = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sub-text text-[12px] font-medium">{children}</p>;
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
    <section className="mt-5 w-full">
      <SectionTitle>내 점수</SectionTitle>
      <p className="text-[14px] font-semibold text-black">
        <SelectedNumber>{competitionResult.score}점</SelectedNumber> {""}/{" "}
        {competitionResult.totalScore}점
      </p>
      <div className="mt-4 flex flex-col gap-2">
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
