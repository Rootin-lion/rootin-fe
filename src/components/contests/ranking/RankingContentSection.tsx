import { RankingPeriod, RankingViewState } from "@/types/contests/ranking";
import RankingBoard from "./RankingBoard";
import RankingSidebar from "./RankingSidebar";
import { RankingState } from "@/types/contests/competition";

export default function RankingContentSection({
  myRanking,
  rankings,
  rankingView,
  totalPage,
  onPeriodChange,
  onPageChange,
}: {
  myRanking: RankingState | null;
  rankings: RankingState[];
  rankingView: RankingViewState;
  totalPage: number;
  onPeriodChange: (period: RankingPeriod) => void;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex flex-row gap-4">
      <RankingSidebar myRanking={myRanking} />
      <RankingBoard
        rankings={rankings}
        rankingView={rankingView}
        totalPage={totalPage}
        onPeriodChange={onPeriodChange}
        onPageChange={onPageChange}
      />
    </div>
  );
}
