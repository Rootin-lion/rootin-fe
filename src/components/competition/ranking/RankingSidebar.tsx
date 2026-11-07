import type { RankingState } from "@/types/competitions/competition";
import MyRanking from "./sidebar/MyRanking";
import RankingGuide from "./sidebar/RankingGuide";

export default function RankingSidebar({
  myRanking,
  isMyPositionDisabled,
  onShowMyPosition,
}: {
  myRanking: RankingState | null;
  isMyPositionDisabled: boolean;
  onShowMyPosition: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 md:w-48 md:shrink-0 md:gap-5 lg:w-56">
      <MyRanking
        myRanking={myRanking}
        isMyPositionDisabled={isMyPositionDisabled}
        onShowMyPosition={onShowMyPosition}
      />
      <RankingGuide />
    </div>
  );
}
