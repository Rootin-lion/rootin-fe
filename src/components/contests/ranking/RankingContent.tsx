"use client";

import useErrorModal from "@/hooks/useErrorModal";
import RankingContentSection from "./RankingContentSection";
import RankingTitleSection from "./RankingTitleSection";
import ErrorModal from "@/components/shared/ErrorModal";
import { useEffect, useState } from "react";
import { RankingPeriod, RankingViewState } from "@/types/contests/ranking";
import {
  getMyRankingAction,
  getRankingsAction,
} from "@/app/(service)/contests/action";
import { RankingState } from "@/types/contests/competition";

export default function RankingContent({
  competitionId,
}: {
  competitionId: number;
}) {
  const [rankings, setRankings] = useState<RankingState[]>([]);
  const [myRanking, setMyRanking] = useState<RankingState | null>(null);
  const [rankingView, setRankingView] = useState<RankingViewState>({
    period: "DAILY",
    page: 0,
  });
  const [totalPage, setTotalPage] = useState<number>(0);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  const handlePeriodChange = (period: RankingPeriod) => {
    setRankingView({ page: 0, period });
  };

  const hanldePageChange = (page: number) => {
    setRankingView((prev) => ({ ...prev, page }));
  };

  // 전체 랭킹
  useEffect(() => {
    let ignore = false;

    const getRankings = async () => {
      try {
        const res = await getRankingsAction(
          competitionId,
          rankingView.period,
          rankingView.page,
        );

        if (ignore) return;

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();
          return;
        }

        setTotalPage(res.data.totalPages);
        setRankings(res.data.content);
      } catch {
        if (ignore) return;

        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "랭킹을 불러오지 못했습니다.",
        });
        openModal();
      }
    };

    getRankings();

    return () => {
      ignore = true;
    };
  }, [
    competitionId,
    rankingView.period,
    rankingView.page,
    openModal,
    setErrorContext,
  ]);

  // 내 랭킹
  useEffect(() => {
    let ignore = false;

    const getMyRanking = async () => {
      try {
        const res = await getMyRankingAction(competitionId, rankingView.period);

        if (ignore) return;

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();
          return;
        }

        setMyRanking(res.data);
      } catch {
        if (ignore) return;

        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "랭킹을 불러오지 못했습니다.",
        });
        openModal();
      }
    };

    getMyRanking();

    return () => {
      ignore = true;
    };
  }, [competitionId, rankingView.period, setErrorContext, openModal]);

  return (
    <div className="bg-primary-50 min-h-dvh w-full">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="mx-auto max-w-5xl pt-20">
        <RankingTitleSection />
        <RankingContentSection
          myRanking={myRanking}
          rankings={rankings}
          rankingView={rankingView}
          totalPage={totalPage}
          onPeriodChange={handlePeriodChange}
          onPageChange={hanldePageChange}
        />
      </div>
    </div>
  );
}
