import { SectionWrapper } from "../SectionWrapper";
import TrophyImg from "../../../assets/main/trophy.png";
import DocumentImg from "../../../assets/main/document.png";
import analysisImg from "../../../assets/main/analysis.png";
import { FeatureCard } from "./FeaturedCard";
import { FeatureData } from "@/types/main/featureItem";

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
      <div>
        <div className="relative flex flex-col items-center justify-center">
          <div className="bg-primary-100 absolute -z-1 h-125 w-125 rounded-[50%] blur-[250px]"></div>
          <h2 className="text-primary-900 text-[28px] font-semibold">
            개발자의 성장을 위한
          </h2>
          <h1
            className="bg-clip-text text-[48px] font-bold text-transparent"
            style={{
              background: "linear-gradient(180deg, #36723E 0%, #6FB377 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            가장 실전적인 플랫폼
          </h1>
          <p className="text-sub-text mt-10 text-[24px] font-medium">
            실전 경험, 객관적인 피드백, 데이터 기반 분석으로 더 빠르고 확실하게
            성장하세요
          </p>
        </div>
        <div className="mt-17 flex gap-8">
          {FEATURED_DATA.map((feature) => (
            <FeatureCard key={feature.id} item={feature} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
