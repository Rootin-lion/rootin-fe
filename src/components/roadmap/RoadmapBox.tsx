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
    <div className="absolute top-3.5 right-0 hidden w-5 translate-x-1/2 items-center text-[#7C8696] md:flex lg:static lg:mt-4 lg:w-16 lg:shrink-0 lg:translate-x-0">
      <span className="block h-0 w-full border-t-[3px] border-dotted border-current" />
      <span className="block h-2 w-2 shrink-0 rotate-45 border-t-[3px] border-r-[3px] border-current lg:h-3 lg:w-3" />
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
      className={`roadmap-list bg-bg-ivory mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-[#E1E1E1] px-5 py-4 text-left md:grid md:max-w-none md:grid-cols-7 md:gap-0 md:rounded-xl md:bg-white md:px-4 md:py-6 lg:flex lg:flex-row lg:gap-2 lg:overflow-x-auto lg:px-8 lg:py-8 ${
        isVisible ? "is-visible" : ""
      }`}
    >
      {roadmapItems.map((item, index) => (
        <div
          key={item.step}
          className="roadmap-reveal relative w-full md:min-w-0 lg:mx-auto lg:flex lg:w-auto lg:shrink-0 lg:items-start lg:gap-2"
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
