import MyRanking from "./sidebar/MyRanking";
import RankingGuide from "./sidebar/RankingGuide";

export default function RankingSidebar() {
  return (
    <div className="flex flex-col gap-5">
      <MyRanking />
      <RankingGuide />
    </div>
  );
}
