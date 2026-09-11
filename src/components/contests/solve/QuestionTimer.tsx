import Image from "next/image";
import TimerIcon from "../../../assets/contests/solve/timer.png";
import QuestionSurface from "./QuestionSurface";

export default function QuestionTimer() {
  return (
    <QuestionSurface>
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-1">
          <Image src={TimerIcon} alt="timer" width={20} height={14} />
          <p className="text-primary-900 text-[13px] font-semibold">
            남은 시간
          </p>
        </div>
        <p className="text-primary-900 text-[36px] font-bold">30 : 00</p>
      </div>
    </QuestionSurface>
  );
}
