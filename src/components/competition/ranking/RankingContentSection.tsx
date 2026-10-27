import type { RankingState } from "@/types/competitions/competition";
import type {
  RankingFocusTarget,
  RankingPeriod,
  RankingViewState,
} from "@/types/competitions/ranking";
import RankingBoard from "./RankingBoard";
import RankingSidebar from "./RankingSidebar";

export default function RankingContentSection({
  myRanking,
  rankings,
  rankingView,
  totalPage,
  focusTarget,
  isMyPositionDisabled,
  onPeriodChange,
  onPageChange,
  onShowMyPosition,
}: {
  myRanking: RankingState | null;
  rankings: RankingState[];
  rankingView: RankingViewState;
  totalPage: number;
  focusTarget: RankingFocusTarget | null;
  isMyPositionDisabled: boolean;
  onPeriodChange: (period: RankingPeriod) => void;
  onPageChange: (page: number) => void;
  onShowMyPosition: () => void;
}) {
  return (
    <div className="mt-4 flex flex-row gap-4">
      <RankingSidebar
        myRanking={myRanking}
        isMyPositionDisabled={isMyPositionDisabled}
        onShowMyPosition={onShowMyPosition}
      />
      <RankingBoard
        rankings={rankings}
        rankingView={rankingView}
        totalPage={totalPage}
        focusTarget={focusTarget}
        onPeriodChange={onPeriodChange}
        onPageChange={onPageChange}
      />
    </div>
  );
}
