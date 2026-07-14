import { RoadmapItem } from "./RoadmapItem";

const roadmapItems = [
  { status: "DONE" as const, step: "STEP 01", title: "CS 기초" },
  { status: "DONE" as const, step: "STEP 02", title: "자료구조" },
  {
    status: "PLAY" as const,
    isPlaying: true,
    step: "STEP 03",
    title: "알고리즘",
  },
  { status: "LOCK" as const, step: "STEP 04", title: "운영체제" },
  { status: "LOCK" as const, step: "STEP 05", title: "데이터베이스" },
  { status: "LOCK" as const, step: "STEP 06", title: "네트워크" },
  { status: "LAST" as const, step: "STEP 07", title: "네트워크" },
];

function RoadmapArrow() {
  return (
    <div className="mt-4 flex w-16 shrink-0 items-center text-[#7C8696]">
      <span className="block h-0 w-full border-t-[3px] border-dotted border-current" />
      <span className="block h-3 w-3 shrink-0 rotate-45 border-t-[3px] border-r-[3px] border-current" />
    </div>
  );
}

export function RoadmapBox() {
  return (
    <div className="flex gap-2 rounded-xl border border-[#E1E1E1] px-8 py-8">
      {roadmapItems.map((item, index) => (
        <div key={item.step} className="mx-auto flex items-start">
          <RoadmapItem {...item} />
          {index < roadmapItems.length - 1 && <RoadmapArrow />}
        </div>
      ))}
    </div>
  );
}
