"use client";

import { useEffect, useRef, useState } from "react";
import RoadmapItem from "./RoadmapItem";

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
    <div className="mt-4 hidden w-8 shrink-0 items-center text-[#7C8696] md:flex lg:w-16">
      <span className="block h-0 w-full border-t-[3px] border-dotted border-current" />
      <span className="block h-3 w-3 shrink-0 rotate-45 border-t-[3px] border-r-[3px] border-current" />
    </div>
  );
}

export default function RoadmapBox() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = boxRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.intersectionRatio >= 0.4);
      },

      { threshold: [0, 0.4] },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      role="region"
      tabIndex={0}
      className={`roadmap-list bg-bg-ivory mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-[#E1E1E1] px-5 py-4 text-left md:max-w-none md:flex-row md:gap-2 md:overflow-x-auto md:rounded-xl md:bg-white md:px-4 md:py-6 lg:px-8 lg:py-8 ${
        isVisible ? "is-visible" : ""
      }`}
    >
      {roadmapItems.map((item, index) => (
        <div
          key={item.step}
          className="roadmap-reveal relative w-full md:mx-auto md:flex md:w-auto md:shrink-0 md:items-start md:gap-2"
          style={{ animationDelay: `${index * 500}ms` }}
        >
          {index < roadmapItems.length - 1 && (
            <span
              aria-hidden="true"
              className="bg-primary-300 absolute top-3.5 left-18.5 h-[calc(100%+1rem)] w-px md:hidden"
            />
          )}
          <RoadmapItem {...item} />
          {index < roadmapItems.length - 1 && <RoadmapArrow />}
        </div>
      ))}
    </div>
  );
}
