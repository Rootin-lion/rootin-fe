import type { Metadata } from "next";
import { CTASection } from "@/components/main/CTASection";
import { FeaturedSection } from "@/components/main/feature/FeaturedSection";
import { FeedbackSection } from "@/components/main/FeedbackSection";
import { HeroSection } from "@/components/main/HeroSection";
import { RoadmapSection } from "@/components/main/RoadmapSection";
import { StatsSection } from "@/components/main/stats/StatsSection";

export const metadata: Metadata = {
  title: "개발자 CS 학습·AI 면접 | ROOTIN ",
  description: "CS 대회와 AI 모의 면접으로 개발자 취업을 준비하세요.",
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
