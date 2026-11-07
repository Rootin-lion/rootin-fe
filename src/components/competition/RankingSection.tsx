"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { RankingState } from "@/types/competitions/competition";
import { getTop3Action } from "@/app/(service)/competitions/action";
import BoxWrapper from "@/components/competition/shared/BoxWrapper";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import RankingBox from "./ranking/RankingBox";
import RankingCircle from "./ranking/RankingCircle";
import RankingConnector from "./ranking/RankingConnector";
import SectionTitle from "./shared/SectionTitle";

export default function RankingSection({
  competitionId,
}: {
  competitionId: number;
}) {
  // 랭킹 상태
  const [rankings, setRankings] = useState<RankingState[]>([]);
  // 에러 모달 상태
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  // Top 3 랭킹 조회
  useEffect(() => {
    if (competitionId === 0) return;

    const getRanking = async (competitionId: number) => {
      try {
        const res = await getTop3Action(competitionId);

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();

          return;
        }

        setRankings(res.data);
      } catch {
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "랭킹을 불러오지 못했습니다.",
        });
        openModal();
      }
    };

    void getRanking(competitionId);
  }, [competitionId, setErrorContext, openModal]);

  // 1등
  const first = rankings.find((ranking) => ranking.rank === 1);
  // 2등
  const second = rankings.find((ranking) => ranking.rank === 2);
  // 3등
  const third = rankings.find((ranking) => ranking.rank === 3);

  return (
    <BoxWrapper>
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}
      <div className="flex min-w-0 flex-col lg:px-6">
        <SectionTitle
          title="CS 랭킹 TOP 3"
          content="실력을 증명한 최고의 참가자들이에요!"
        />
        <div className="mt-8 grid grid-cols-3 items-center gap-2 md:flex md:justify-center md:gap-6 lg:mt-0 lg:gap-10">
          {/* 2등 */}
          <RankingBox>
            <RankingCircle type="Silver" img={second?.imgUrl ?? null} />
            <p className="mt-4 w-full text-[12px] font-semibold break-all md:text-[16px] lg:text-[20px]">
              {second?.nickname ?? "-"}
            </p>
            <p className="text-[12px] font-semibold md:text-[16px]">
              {second ? `${second.score}` : "0"}점
            </p>
          </RankingBox>
          <RankingConnector />
          {/* 1등 */}
          <div className="relative min-w-0">
            <div className="absolute inset-0 z-0">
              <div className="border-warning absolute h-full w-full border-5 bg-[#FFFCF6] opacity-80 blur-[30px] lg:h-41 lg:w-41" />
            </div>
            <div className="text-text relative z-10 flex flex-col text-center">
              <RankingBox>
                <RankingCircle type="Gold" img={first?.imgUrl ?? null} />
                <p className="mt-4 w-full text-[12px] font-semibold break-all md:text-[16px] lg:text-[20px]">
                  {first?.nickname ?? "-"}
                </p>
                <p className="text-[12px] font-semibold md:text-[16px]">
                  {first ? `${first.score}` : "0"}점
                </p>
              </RankingBox>
            </div>
          </div>
          <RankingConnector />
          {/* 3등 */}
          <RankingBox>
            <RankingCircle type="Dong" img={third?.imgUrl ?? null} />
            <p className="mt-4 w-full text-[12px] font-semibold break-all md:text-[16px] lg:text-[20px]">
              {third?.nickname ?? "-"}
            </p>
            <p className="text-[12px] font-semibold md:text-[16px]">
              {third ? `${third.score}` : "0"}점
            </p>
          </RankingBox>
        </div>
        <Link
          href={`/competitions/${competitionId}/ranking?period=DAILY&page=1`}
          className="text-primary-900 mt-6 flex min-h-11 items-center justify-end text-right text-[12px] font-semibold md:text-[16px]"
        >
          전체 랭킹 보기 →
        </Link>
      </div>
    </BoxWrapper>
  );
}
