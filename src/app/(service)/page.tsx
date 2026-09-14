import type { Metadata } from "next";
import { HeroSection } from "@/components/main/HeroSection";
import { FeaturedSection } from "@/components/main/feature/FeaturedSection";
import { FeedbackSection } from "@/components/main/FeedbackSection";
import { RoadmapSection } from "@/components/main/RoadmapSection";
import { StatsSection } from "@/components/main/stats/StatsSection";
import { CTASection } from "@/components/main/CTASection";

export const metadata: Metadata = {
  title: "ROOTIN | 개발자 CS 학습과 AI 모의 면접",
  description:
    "CS 대회와 실시간 랭킹, AI 모의 면접, 개인별 분석으로 개발자 취업을 준비하세요. ROOTIN에서 꾸준한 학습과 실전 연습을 시작해보세요.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <FeedbackSection />
      <RoadmapSection />
      <StatsSection />
      <CTASection />
    </>
  );
}
