import { SectionWrapper } from "./SectionWrapper";
import FeedbackImg from "../../assets/main/feedback.png";
import Image from "next/image";

const FeedbackBox = ({ text, angle }: { text: string; angle: number }) => {
  return (
    <div
      className="absolute inset-0"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="feedback-counter-orbit">
          <div
            className="text-primary-900 flex h-18 w-33.5 items-center justify-center rounded-lg bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,#DAEBD9_100%)] text-[14px] font-semibold"
            style={{ transform: `rotate(${-angle}deg)` }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

function OrbitArrow({ angle }: { angle: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ transform: `rotate(${angle}deg)` }}
      aria-hidden="true"
    >
      <svg
        className="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M4 2.5 9.5 8 4 13.5"
          stroke="#36723E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

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
          <div className="feedback-orbit-group relative flex h-112.5 w-112.5 items-center justify-center rounded-[50%] border border-dashed border-[#36723E] bg-[radial-gradient(50%_50%_at_50%_50%,#FCFDF9_0%,#EAF3E8_100%)]">
            <OrbitArrow angle={-45} />
            <OrbitArrow angle={45} />
            <OrbitArrow angle={135} />
            <OrbitArrow angle={225} />
            <div className="feedback-orbit absolute inset-0">
              <FeedbackBox text="실전 대회 참여" angle={0} />
              <FeedbackBox text="결과 분석 & 피드백" angle={90} />
              <FeedbackBox text="약점 보완 학습" angle={180} />
              <FeedbackBox text="모의 면접 연습" angle={270} />
            </div>
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
