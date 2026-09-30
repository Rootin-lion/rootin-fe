import type { RankingState } from "@/types/competitions/competition";
import MyRanking from "./sidebar/MyRanking";
import RankingGuide from "./sidebar/RankingGuide";

export default function RankingSidebar({
  myRanking,
}: {
  myRanking: RankingState | null;
}) {
  return (
    <div className="flex flex-col gap-5">
      <MyRanking myRanking={myRanking} />
      <RankingGuide />
    </div>
  );
}
