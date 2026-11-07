import RoadmapBox from "@/components/roadmap/RoadmapBox";
import SectionWrapper from "./SectionWrapper";

export function RoadmapSection() {
  return (
    <SectionWrapper variant="white">
      <div className="flex w-full max-w-6xl min-w-0 flex-col gap-4 text-center lg:gap-6 lg:text-left">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium text-black md:text-[20px] lg:text-[36px]">
            나만을 위한
          </p>
          <h1
            className="bg-clip-text text-[24px] font-bold text-transparent md:text-[32px] lg:text-[44px]"
            style={{
              background: "linear-gradient(180deg, #36723E 30%, #000000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            맞춤 성장 로드맵
          </h1>
        </div>
        <p className="text-sub-text text-[13px] leading-relaxed font-normal whitespace-pre-wrap md:text-[16px] lg:text-[22px]">
          대회 결과, 면접 데이터, 학습 기록을 기반으로{"\n"}AI가 당신만의 성장
          로드맵을 제안합니다.
        </p>
        <RoadmapBox />
      </div>
    </SectionWrapper>
  );
}
