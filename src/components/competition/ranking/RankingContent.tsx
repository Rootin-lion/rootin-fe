"use client";

import { useCallback } from "react";
import type { ApiError } from "@/types/api/error";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import useMyRankingPosition from "./hooks/useMyRankingPosition";
import useRankingData from "./hooks/useRankingData";
import useRankingView from "./hooks/useRankingView";
import RankingContentSection from "./RankingContentSection";
import RankingTitleSection from "./RankingTitleSection";

export default function RankingContent({
  competitionId,
}: {
  competitionId: number;
}) {
  const { rankingView, updateRankingUrl } = useRankingView();
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();
  const showError = useCallback(
    (context: ApiError) => {
      setErrorContext(context);
      openModal();
    },
    [setErrorContext, openModal],
  );
  const rankingData = useRankingData({
    competitionId,
    period: rankingView.period,
    page: rankingView.page,
    onError: showError,
  });
  const {
    currentFocusTarget,
    isMyPositionDisabled,
    clearPositionSearch,
    showMyPosition,
  } = useMyRankingPosition({
    competitionId,
    rankingView,
    rankingData,
    updateRankingUrl,
    onError: showError,
  });

  const handlePeriodChange = (period: typeof rankingView.period) => {
    if (period === rankingView.period) return;
    clearPositionSearch();
    rankingData.preparePeriodChange();
    updateRankingUrl(period, 0);
  };

  const handlePageChange = (page: number) => {
    if (page === rankingView.page) return;
    clearPositionSearch();
    rankingData.markRankingsLoading();
    updateRankingUrl(rankingView.period, page);
  };

  const handleRefresh = () => {
    if (rankingData.isRankingLoading) return;
    clearPositionSearch();
    rankingData.refresh();
  };

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
        <RankingTitleSection
          lastUpdatedAt={rankingData.lastUpdatedAt}
          isLoading={rankingData.isRankingLoading}
          onRefresh={handleRefresh}
        />
        <RankingContentSection
          myRanking={rankingData.currentMyRanking}
          rankings={rankingData.currentRankings}
          rankingView={rankingView}
          totalPage={rankingData.currentTotalPage}
          focusTarget={currentFocusTarget}
          isMyPositionDisabled={isMyPositionDisabled}
          onPeriodChange={handlePeriodChange}
          onPageChange={handlePageChange}
          onShowMyPosition={() => void showMyPosition()}
        />
      </div>
    </div>
  );
}
