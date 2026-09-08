import FeedbackCycle from "./feedback/FeedbackCycle";
import { SectionWrapper } from "./SectionWrapper";

export function FeedbackSection() {
  return (
    <SectionWrapper variant={"primary"}>
      <div className="flex items-center justify-between gap-40">
        <div className="flex flex-col gap-5">
          <h1 className="text-[36px] font-semibold whitespace-pre-wrap text-black">
            연습은
            <span className="font-bold text-[#36723E]">실전</span>처럼,{"\n"}
            피드백은 <span className="font-bold text-[#36723E]">전문가</span>
            처럼
          </h1>
          <p className="text-sub-text text-left text-[20px] font-normal whitespace-pre-wrap">
            실제 환경과 유사한 문제와 면접으로 연습하고{"\n"}상세한 피드백으로
            실력을 한 단계 끌어올리세요.
          </p>
        </div>
        <FeedbackCycle />
      </div>
    </SectionWrapper>
  );
}
