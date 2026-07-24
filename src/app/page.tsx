import { CTASection } from "@/components/main/CTASection";
import { FeaturedSection } from "@/components/main/feature/FeaturedSection";
import { FeedbackSection } from "@/components/main/FeedbackSection";
import { HeroSection } from "@/components/main/HeroSection";
import { RoadmapSection } from "@/components/main/RoadmapSection";
import { StatusSection } from "@/components/main/stats/StatsSection";
import Header from "@/components/shared/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <FeaturedSection />
      <FeedbackSection />
      <RoadmapSection />
      <StatusSection />
      <CTASection />
    </div>
  );
}
