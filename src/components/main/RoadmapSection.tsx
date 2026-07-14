import { SectionWrapper } from "./SectionWrapper";
import { RoadmapBox } from "../roadmap/RoadmapBox";

export function RoadmapSection() {
  return (
    <SectionWrapper variant={"white"}>
      <div className="flex w-full flex-col gap-6 px-47 text-left">
        <div className="flex flex-col gap-2">
          <p className="text-[36px] font-medium text-black">나만을 위한</p>
          <p
            className="bg-clip-text text-[44px] font-bold text-transparent"
            style={{
              background: "linear-gradient(180deg, #36723E 30%, #000000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            맞춤 성장 로드맵
          </p>
        </div>
        <p className="text-sub-text text-[22px] font-normal whitespace-pre-wrap">
          대회 결과, 면접 데이터, 학습 기록을 기반으로{"\n"}AI가 당신만의 성장
          로드맵을 제안합니다.
        </p>
        <RoadmapBox />
      </div>
    </SectionWrapper>
  );
}
