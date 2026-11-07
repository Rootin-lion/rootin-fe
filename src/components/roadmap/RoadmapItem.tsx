import Image from "next/image";
import DoneIcon from "@/assets/roadmap/done.png";
import LockIcon from "@/assets/roadmap/lock.png";
import PlayIcon from "@/assets/roadmap/play.png";
import type { RoadmapStatus } from "@/types/roadmap/roadMapItem";

interface RoadmapItemProps {
  status: RoadmapStatus;
  isPlaying?: boolean;
  step: string;
  title: string;
}

const BG_COLORS = {
  DONE: { bg: "bg-primary-900", img: DoneIcon },
  PLAY: { bg: "bg-primary-300", img: PlayIcon },
  LOCK: { bg: "bg-[#F2F7FD]", img: LockIcon },
  LAST: { bg: "bg-[#E1E1E1]", img: LockIcon },
};

export default function RoadmapItem({
  status,
  isPlaying,
  step,
  title,
}: RoadmapItemProps) {
  return (
    <div className="relative grid min-h-12 grid-cols-[48px_28px_minmax(0,1fr)] items-start gap-x-3 gap-y-1 md:flex md:min-h-0 md:flex-col md:items-center md:gap-3">
      <div
        className={`${BG_COLORS[status].bg} z-10 col-start-2 row-start-1 flex h-7 w-7 items-center justify-center rounded-full md:h-12 md:w-12`}
      >
        <Image
          src={BG_COLORS[status].img}
          alt=""
          className="h-3 w-3 md:h-4.5 md:w-4.5"
        />
      </div>
      <p className="text-sub-text col-start-1 row-start-1 pt-1.5 text-[10px] leading-4 font-semibold md:pt-0 md:text-xs md:font-normal">
        {step}
      </p>
      <p className="col-start-3 row-start-1 pt-1 text-[13px] leading-5 font-medium md:pt-0 md:text-base md:font-normal">
        {title}
      </p>
      {isPlaying && (
        <p className="text-primary-900 bg-primary-200 col-start-3 row-start-2 w-fit rounded-xl px-2 py-0.5 text-[9px] font-medium md:px-3 md:py-1 md:text-[10px]">
          진행중
        </p>
      )}
    </div>
  );
}
