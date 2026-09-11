import RankingBoard from "./RankingBoard";
import RankingSidebar from "./RankingSidebar";

export default function RankingContentSection() {
  return (
    <div className="mt-4 flex flex-row gap-4">
      <RankingSidebar />
      <RankingBoard />
    </div>
  );
}
