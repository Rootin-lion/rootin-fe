import type { Metadata } from "next";
import RankingContent from "@/components/contests/ranking/RankingContent";

export const metadata: Metadata = {
  title: "CS 대회 전체 랭킹 | ROOTIN",
  description:
    "ROOTIN CS 대회 참가자의 순위와 점수, 포인트를 확인하세요. 랭킹 산정 기준과 내 순위도 함께 확인할 수 있습니다.",
};

export default async function RankingPage(
  props: PageProps<"/contests/[competitionId]/ranking">,
) {
  const { competitionId } = await props.params;
  const competitionIdNumber = Number(competitionId);

  return <RankingContent competitionId={competitionIdNumber} />;
}
