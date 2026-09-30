import { Metadata } from "next";
import ProblemContent from "@/components/competition/problem/ProblemContent";

export const metadata: Metadata = {
  title: "CS 대회 문제 풀이 | ROOTIN",
  description: "CS 대회 문제를 풀고 답안을 제출하세요.",
  robots: { index: false },
};

export default async function ProblemPage(
  props: PageProps<"/competitions/[competitionId]">,
) {
  const { competitionId } = await props.params;
  const competitionIdNumber = Number(competitionId);

  return <ProblemContent competitionId={competitionIdNumber} />;
}
