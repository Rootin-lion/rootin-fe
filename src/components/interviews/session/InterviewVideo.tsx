import Image from "next/image";
import TimerIcon from "../../../assets/interviews/timer.png";

export default function InterviewVideo() {
  return (
    <div className="flex w-full max-w-70.5 flex-col gap-4">
      <div className="flex flex-row items-center gap-5 rounded-xl bg-[#F0F0F0] px-5 py-2">
        <Image src={TimerIcon} alt="timer" className="h-9 w-9" />
        <p className="text-primary-900 text-[30px] font-bold">14:30</p>
      </div>
      <div className="h-104 w-full rounded-xl bg-gray-400"></div>
    </div>
  );
}
