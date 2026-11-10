import analysisImg from "@/assets/images/main/analysis.png";
import DocumentImg from "@/assets/images/main/document.png";
import TrophyImg from "@/assets/images/main/trophy.png";
import type { FeatureData } from "@/types/main/featureItem";
import SectionWrapper from "@/components/main/SectionWrapper";
import { FeatureCard } from "./FeaturedCard";

const FEATURED_DATA: FeatureData[] = [
  {
    id: 1,
    title: "실전 대회 & 실시간 랭킹",
    image: TrophyImg,
    textColor: "text-primary-900",
    bg: "bg-green-50",
  },
  {
    id: 2,
    title: "면접 시뮬레이션",
    image: DocumentImg,
    textColor: "text-[#2349D1]",
    bg: "bg-[#F1F5FE]",
  },
  {
    id: 3,
    title: "개인 분석 & 맞춤 추천",
    image: analysisImg,
    textColor: "text-[#2E1AC6]",
    bg: "bg-[#F5F3FE]",
  },
];

export function FeaturedSection() {
  return (
    <SectionWrapper variant="white">
      <div className="w-full max-w-5xl">
        <div className="relative flex flex-col items-center justify-center">
          <div className="bg-primary-100 absolute -z-1 h-60 w-60 rounded-[50%] blur-[250px] lg:h-125 lg:w-125"></div>
          <h2 className="text-primary-900 text-[14px] font-semibold md:text-[18px] lg:text-[28px]">
            개발자의 성장을 위한
          </h2>
          <h1
            className="bg-clip-text text-center text-[24px] font-bold text-transparent md:text-[32px] lg:text-[48px]"
            style={{
              background: "linear-gradient(180deg, #36723E 0%, #6FB377 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            가장 실전적인 플랫폼
          </h1>
          <p className="text-sub-text mt-4 max-w-3xl text-center text-[13px] leading-relaxed font-medium md:text-[16px] lg:mt-10 lg:text-[24px]">
            실전 경험, 객관적인 피드백, 데이터 기반 분석으로 더 빠르고 확실하게
            성장하세요
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:mt-17 lg:gap-8">
          {FEATURED_DATA.map((feature) => (
            <FeatureCard key={feature.id} item={feature} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
