import SectionTitle from "./SectionTitle";
import SelectedNumber from "./SelectedNumber";

const ResultStats = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-between">{children}</div>;
};

const ResultStatsItem = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sub-text text-[12px] font-medium">{children}</p>;
};

export default function ScoreSection() {
  return (
    <div className="mt-5">
      <SectionTitle>내 점수</SectionTitle>
      <p className="text-[14px] font-semibold text-black">
        <SelectedNumber>70점</SelectedNumber> {""}/ 100점
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <ResultStats>
          <ResultStatsItem>정답 수</ResultStatsItem>
          <ResultStatsItem>7 / 10</ResultStatsItem>
        </ResultStats>
        <ResultStats>
          <ResultStatsItem>소요 시간</ResultStatsItem>
          <ResultStatsItem>10 : 13</ResultStatsItem>
        </ResultStats>
      </div>
    </div>
  );
}
