import RankingContentSection from "@/components/ranking/RankingContentSection";
import RankingTitleSection from "@/components/ranking/RankingTitleSection";

export default function RankingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <RankingTitleSection />
      <RankingContentSection />
    </div>
  );
}
