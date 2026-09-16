import type { Metadata } from "next";
import RankingContentSection from "@/components/ranking/RankingContentSection";
import RankingTitleSection from "@/components/ranking/RankingTitleSection";

export const metadata: Metadata = {
  title: "CS 대회 전체 랭킹 | ROOTIN",
  description:
    "ROOTIN CS 대회 참가자의 순위와 점수, 포인트를 확인하세요. 랭킹 산정 기준과 내 순위도 함께 확인할 수 있습니다.",
};

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
