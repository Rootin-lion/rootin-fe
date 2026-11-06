import FeedbackCycle from "./feedback/FeedbackCycle";
import SectionWrapper from "./SectionWrapper";

export function FeedbackSection() {
  return (
    <SectionWrapper variant={"primary"} className="overflow-clip">
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-10 xl:flex-row xl:gap-16">
        <div className="flex flex-col gap-5">
          <h1 className="text-center text-[24px] font-semibold whitespace-pre-wrap text-black md:text-[28px] lg:text-left lg:text-[36px]">
            연습은 <span className="font-bold text-[#36723E]">실전</span>처럼,
            {"\n"}
            피드백은 <span className="font-bold text-[#36723E]">전문가</span>
            처럼
          </h1>
          <p className="text-sub-text text-center text-[13px] leading-relaxed font-normal whitespace-pre-wrap md:text-[16px] lg:text-left lg:text-[20px]">
            실제 환경과 유사한 문제와 면접으로 연습하고{"\n"}상세한 피드백으로
            실력을 한 단계 끌어올리세요.
          </p>
        </div>
        <FeedbackCycle />
      </div>
    </SectionWrapper>
  );
}
