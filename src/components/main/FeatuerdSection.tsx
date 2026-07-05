import { SectionWrapper } from "../shared/main/SectionWrapper";

export function FeaturedSection() {
  return (
    <SectionWrapper variant={"white"}>
      <div>
        <div className="relative flex flex-col items-center justify-center">
          <div className="bg-primary-100 absolute -z-1 h-125 w-125 rounded-[50%] blur-[250px]"></div>
          <p className="text-primary-900 text-[28px] font-semibold">
            개발자의 성장을 위한
          </p>
          <p
            className="bg-clip-text text-[48px] font-bold text-transparent"
            style={{
              background: "linear-gradient(180deg, #36723E 0%, #6FB377 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            가장 실전적인 플랫폼
          </p>
          <p className="text-sub-text text-[24px] font-medium">
            실전 경험, 객관적인 피드백, 데이터 기반 분석으로 더 빠르고 확실하게
            성장하세요
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
