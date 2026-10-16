import Image from "next/image";
import FeedbackImg from "@/assets/main/feedback.png";
import ChevronIcon from "@/assets/icon/shared/chevron.svg";

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
      <ChevronIcon className="text-primary-900 absolute top-0 left-1/2 h-3.5 w-2 -translate-x-1/2 -translate-y-1/2 overflow-visible" />
    </div>
  );
}

export default function FeedbackCycle() {
  return (
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
        alt=""
        width={240}
        loading="lazy"
        className="z-10"
      />
    </div>
  );
}
