import { SectionWrapper } from "../shared/main/SectionWrapper";
import FeedbackImg from "../../assets/main/feedback.png";
import Image from "next/image";

const FeedbackBox = ({
  text,
  position,
}: {
  text: string;
  position: string;
}) => {
  return (
    <div
      className={`${position} text-primary-900 absolute flex h-18 w-33.5 items-center justify-center rounded-lg bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,#DAEBD9_100%)] text-[14px] font-semibold`}
    >
      {text}
    </div>
  );
};

export function FeedbackSection() {
  return (
    <SectionWrapper variant={"primary"}>
      <div className="flex items-center justify-between gap-20">
        <div className="flex flex-col gap-5">
          <p className="text-[36px] font-semibold whitespace-pre-wrap text-black">
            연습은
            <span className="font-bold text-[#36723E]">실전</span>처럼,{"\n"}
            피드백은 <span className="font-bold text-[#36723E]">전문가</span>
            처럼
          </p>
          <p className="text-sub-text text-left text-[20px] font-normal whitespace-pre-wrap">
            실제 환경과 유사한 문제와 면접으로 연습하고{"\n"}상세한 피드백으로
            실력을 한 단계 끌어올리세요.
          </p>
        </div>
        <div>
          <div className="relative flex h-112.5 w-112.5 items-center justify-center rounded-[50%] border border-dashed border-[#36723E] bg-[radial-gradient(50%_50%_at_50%_50%,#FCFDF9_0%,#EAF3E8_100%)]">
            <FeedbackBox text="모의 면접 연습" position="-left-[62px]" />
            <FeedbackBox
              text="실전 대회 참여"
              position="left-[154px] -top-[40px]"
            />
            <FeedbackBox text="결과 분석 & 피드백" position="-right-[62px]" />
            <FeedbackBox
              text="약점 보완 학습"
              position="left-[154px] -bottom-[40px]"
            />
            <Image
              src={FeedbackImg}
              alt="feedback"
              width={190}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
