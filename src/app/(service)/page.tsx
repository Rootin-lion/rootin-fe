import { CTASection } from "@/components/main/CTASection";
import { FeaturedSection } from "@/components/main/feature/FeaturedSection";
import { FeedbackSection } from "@/components/main/FeedbackSection";
import { HeroSection } from "@/components/main/HeroSection";
import { RoadmapSection } from "@/components/main/RoadmapSection";
import { StatsSection } from "@/components/main/stats/StatsSection";

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
