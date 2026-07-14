import DoneIcon from "../../assets/roadmap/done.png";
import PlayIcon from "../../assets/roadmap/play.png";
import LockIcon from "../../assets/roadmap/lock.png";
import Image from "next/image";
import { RoadmapStatus } from "@/types/roadmap/roadMapItem";

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

export function RoadmapItem({
  status,
  isPlaying,
  step,
  title,
}: RoadmapItemProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${BG_COLORS[status].bg} flex h-12 w-12 items-center justify-center rounded-[50%]`}
      >
        <Image src={BG_COLORS[status].img} alt="done" className="h-4.5 w-4.5" />
      </div>
      <p className="typo-caption text-sub-text">{step}</p>
      <p className="typo-body-2">{title}</p>
      {isPlaying && (
        <p className="text-primary-900 bg-primary-200 rounded-xl px-3 py-1 text-[10px] font-medium">
          진행중
        </p>
      )}
    </div>
  );
}
