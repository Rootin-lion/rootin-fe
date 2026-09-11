"use client";

import { useState } from "react";
import BoxWrapper from "../shared/BoxWrapper";
import ContestResultCard from "./ContestResultCard";
import SectionTitle from "./SectionTitle";
import { ContestResultsState } from "@/types/contests/competition";

const Bar = ({ isActive }: { isActive?: boolean }) => {
  const wdtStyle = isActive ? "w-8" : "w-5";
  const bgStyle = isActive ? "bg-primary" : "bg-[#D9D9D9]";
  return (
    <div
      className={`h-2 w-5 rounded-lg ${wdtStyle} ${bgStyle} cursor-pointer`}
    />
  );
};

export default function PastContestsSection() {
  const [contestResults, setContestResults] = useState<ContestResultsState[]>([
    {
      competitionId: 1,
      competitionDate: "2026-08-03",
      problemCount: 10,
      timeLimitMinutes: 30,
      participantCount: 1,
      viewable: true,
    },
    {
      competitionId: 2,
      competitionDate: "2026-07-27",
      problemCount: 10,
      timeLimitMinutes: 30,
      participantCount: 0,
      viewable: false,
    },
    {
      competitionId: 3,
      competitionDate: "2026-08-03",
      problemCount: 10,
      timeLimitMinutes: 30,
      participantCount: 1,
      viewable: true,
    },
    {
      competitionId: 4,
      competitionDate: "2026-07-27",
      problemCount: 10,
      timeLimitMinutes: 30,
      participantCount: 0,
      viewable: false,
    },
  ]);

  return (
    <BoxWrapper>
      <div className="flex flex-col px-6">
        <SectionTitle
          title="종료된 대회"
          content="이전 대회의 결과를 확인해보세요."
          isRanking={true}
        />
        <div className="mt-7 flex w-full justify-center">
          <div className="grid w-full max-w-210 grid-cols-2 justify-items-center gap-6">
            {contestResults.map((result) => (
              <ContestResultCard key={result.competitionId} contests={result} />
            ))}
          </div>
        </div>
        <div className="mt-9 flex justify-center gap-2">
          <Bar isActive={true} />
          <Bar />
          <Bar />
          <Bar />
        </div>
      </div>
    </BoxWrapper>
  );
}
