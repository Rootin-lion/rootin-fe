import type { Metadata } from "next";
import CompetitionContent from "@/components/competition/CompetitionContent";

export const metadata: Metadata = {
  title: "매일 도전하는 CS 대회 | ROOTIN",
  description: "매일 열리는 CS 대회에 참여하고 랭킹을 확인하세요.",
};

export default function CompetitionPage() {
  return <CompetitionContent />;
}
