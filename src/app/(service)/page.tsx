import { HeroSection } from "@/components/main/HeroSection";
import { FeaturedSection } from "@/components/main/feature/FeaturedSection";
import { FeedbackSection } from "@/components/main/FeedbackSection";
import { RoadmapSection } from "@/components/main/RoadmapSection";
import { StatsSection } from "@/components/main/stats/StatsSection";
import { CTASection } from "@/components/main/CTASection";

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
