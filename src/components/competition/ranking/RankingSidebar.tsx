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
    <div className="flex flex-col gap-5">
      <MyRanking
        myRanking={myRanking}
        isMyPositionDisabled={isMyPositionDisabled}
        onShowMyPosition={onShowMyPosition}
      />
      <RankingGuide />
    </div>
  );
}
