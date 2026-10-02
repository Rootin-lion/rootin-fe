import type { Metadata } from "next";
import RankingContent from "@/components/competition/ranking/RankingContent";

export const metadata: Metadata = {
  title: "CS 대회 전체 랭킹 | ROOTIN",
  description: "CS 대회 참가자의 순위와 점수를 확인하세요.",
};

export default async function RankingPage(
  props: PageProps<"/competitions/[competitionId]/ranking">,
) {
  const { competitionId } = await props.params;
  const competitionIdNumber = Number(competitionId);

  return <RankingContent competitionId={competitionIdNumber} />;
}
