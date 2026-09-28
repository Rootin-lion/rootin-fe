"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { RankingState } from "@/types/competitions/competition";
import BoxWrapper from "@/components/competition/shared/BoxWrapper";
import SectionTitle from "./shared/SectionTitle";
import RankingBox from "./ranking/RankingBox";
import RankingCircle from "./ranking/RankingCircle";
import RankingConnector from "./ranking/RankingConnector";
import { getTop3Action } from "@/app/(service)/competitions/action";
import useErrorModal from "@/hooks/useErrorModal";
import ErrorModal from "../shared/ErrorModal";

export default function RankingSection({
  competitionId,
}: {
  competitionId: number;
}) {
  const [rankings, setRankings] = useState<RankingState[]>([]);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

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

  const first = rankings.find((ranking) => ranking.rank === 1);
  const second = rankings.find((ranking) => ranking.rank === 2);
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
      <div className="flex flex-col px-6">
        <SectionTitle
          title="CS 랭킹 TOP 3"
          content="실력을 증명한 최고의 참가자들이에요!"
        />
        <div className="flex flex-row items-center justify-center gap-10">
          <RankingBox>
            <RankingCircle type="Silver" img={second?.imgUrl ?? null} />
            <p className="mt-4 text-[20px] font-semibold">
              {second?.nickname ?? "아직 없음"}
            </p>
            <p className="text-[16px] font-semibold">
              {second ? `${second.score}점` : "-"}
            </p>
          </RankingBox>
          <RankingConnector />
          <div className="relative">
            <div className="absolute inset-0 z-0">
              <div className="border-warning absolute h-41 w-41 border-5 bg-[#FFFCF6] opacity-80 blur-[30px]" />
            </div>
            <div className="text-text relative z-10 flex flex-col text-center">
              <RankingBox>
                <RankingCircle type="Gold" img={first?.imgUrl ?? null} />
                <p className="mt-4 text-[20px] font-semibold">
                  {first?.nickname ?? "아직 없음"}
                </p>
                <p className="text-[16px] font-semibold">
                  {first ? `${first.score}점` : "-"}
                </p>
              </RankingBox>
            </div>
          </div>
          <RankingConnector />
          <RankingBox>
            <RankingCircle type="Dong" img={third?.imgUrl ?? null} />
            <p className="mt-4 text-[20px] font-semibold">
              {third?.nickname ?? "아직 없음"}
            </p>
            <p className="text-[16px] font-semibold">
              {third ? `${third.score}점` : "-"}
            </p>
          </RankingBox>
        </div>
        <Link
          href={`competitions/${competitionId}/ranking`}
          className="text-primary-900 mt-6 cursor-pointer text-right text-[16px] font-semibold"
        >
          전체 랭킹 보기 →
        </Link>
      </div>
    </BoxWrapper>
  );
}
