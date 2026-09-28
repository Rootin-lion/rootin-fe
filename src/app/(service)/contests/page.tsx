import { Metadata } from "next";
import ContestContent from "@/components/contests/ContestContent";

export const metadata: Metadata = {
  title: "매일 도전하는 CS 대회 | ROOTIN",
  description:
    "매일 진행되는 ROOTIN CS 대회에 참여하고, 참가자 랭킹과 종료된 대회를 확인하세요.",
};

export default function ContestPage() {
  return <ContestContent />;
}
