import RankingContentSection from "@/components/ranking/RankingContentSection";
import RankingTitleSection from "@/components/ranking/RankingTitleSection";

export default function RankingPage() {
  return (
    <div className="bg-primary-50 min-h-dvh w-full">
      <div className="mx-auto max-w-5xl pt-20">
        <RankingTitleSection />
        <RankingContentSection />
      </div>
    </div>
  );
}
