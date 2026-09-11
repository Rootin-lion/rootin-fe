"use client";

// import Image from "next/image";
import { useState } from "react";
import BoxWrapper from "../shared/BoxWrapper";
// import RankingBoxWrapper from "./RankingBoxWrapper";
import SectionTitle from "./SectionTitle";
import RankingBox from "./ranking/RankingBox";
import RankingCircle from "./ranking/RankingCircle";
import RankingConnector from "./ranking/RankingConnector";
import { RankingState } from "@/types/contests/competition";

export default function RankingSection() {
  const [rankings, setRankings] = useState<RankingState[]>([
    {
      rank: 1,
      memberId: 9002,
      nickname: "애",
      imgUrl: null,
      score: 100,
      submittedAt: "2026-08-19T12:20:00",
    },
    {
      rank: 2,
      memberId: 9001,
      nickname: "객",
      imgUrl: null,
      score: 80,
      submittedAt: "2026-08-19T12:15:00",
    },
    {
      rank: 3,
      memberId: 9003,
      nickname: "댁",
      imgUrl: null,
      score: 80,
      submittedAt: "2026-08-19T12:25:00",
    },
  ]);

  return (
    <BoxWrapper>
      <div className="flex flex-col px-6">
        <SectionTitle
          title="CS 랭킹 TOP 3"
          content="실력을 증명한 최고의 참가자들이에요!"
        />
        <div className="flex flex-row items-center justify-center gap-10">
          <RankingBox>
            <RankingCircle type="Silver" />
            <p className="mt-4 text-[20px] font-semibold">
              {rankings[1].nickname}
            </p>
            <p className="text-[16px] font-semibold">{rankings[1].score}점</p>
          </RankingBox>
          <RankingConnector />
          <div className="relative">
            <div className="absolute inset-0 z-0">
              <div className="border-warning absolute h-41 w-41 border-5 bg-[#FFFCF6] opacity-80 blur-[30px]" />
            </div>
            <div className="text-text relative z-10 flex flex-col text-center">
              <RankingBox>
                <RankingCircle type="Gold" />
                <p className="mt-4 text-[20px] font-semibold">
                  {rankings[0].nickname}
                </p>
                <p className="text-[16px] font-semibold">
                  {rankings[0].score}점
                </p>
              </RankingBox>
            </div>
          </div>
          <RankingConnector />
          <RankingBox>
            <RankingCircle type="Dong" />
            <p className="mt-4 text-[20px] font-semibold">
              {rankings[2].nickname}
            </p>
            <p className="text-[16px] font-semibold">{rankings[2].score}점</p>
          </RankingBox>
        </div>
        <p className="text-primary-900 mt-6 cursor-pointer text-right text-[16px] font-semibold">
          전체 랭킹 보기 →
        </p>
      </div>
    </BoxWrapper>
  );
}
