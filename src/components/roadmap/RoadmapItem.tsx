import DoneIcon from "../../assets/roadmap/done.png";
import PlayIcon from "../../assets/roadmap/play.png";
import LockIcon from "../../assets/roadmap/lock.png";
import Image from "next/image";

export function RoadmapItem() {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-primary-900 flex h-10 w-10 items-center justify-center rounded-[50%]">
        <Image src={DoneIcon} width={18} height={18} alt="done" />
      </div>

      <p className="text-caption">STEP 01</p>
      <p>CS 기초</p>
    </div>
  );
}
