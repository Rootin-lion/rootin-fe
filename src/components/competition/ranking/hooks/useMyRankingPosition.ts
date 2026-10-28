"use client";

import { useEffect, useRef, useState } from "react";
import type { ApiError } from "@/types/api/error";
import type { RankingState } from "@/types/competitions/competition";
import type {
  RankingFocusTarget,
  RankingPeriod,
  RankingViewState,
} from "@/types/competitions/ranking";
import { getRankingsAction } from "@/app/(service)/competitions/action";
import { isSilentRankingError } from "../rankingError";
import type useRankingData from "./useRankingData";

export default function useMyRankingPosition({
  competitionId,
  rankingView,
  rankingData,
  updateRankingUrl,
  onError,
}: {
  competitionId: number;
  rankingView: RankingViewState;
  rankingData: ReturnType<typeof useRankingData>;
  updateRankingUrl: (period: RankingPeriod, page: number) => void;
  onError: (error: ApiError) => void;
}) {
  const {
    rankingViewKey,
    currentMyRanking,
    currentRankings,
    currentTotalPage,
    isRankingCurrent,
    isRankingLoading,
    isCurrentMyRankingLoading,
    markRankingsLoading,
    markRankingUnavailable,
    replaceRankings,
  } = rankingData;
  const [focusTarget, setFocusTarget] = useState<RankingFocusTarget | null>(
    null,
  );
  const [focusTargetViewKey, setFocusTargetViewKey] = useState<string | null>(
    null,
  );
  const positionRequestId = useRef(0);
  const isFindingPosition = useRef(false);
  const currentFocusTarget =
    focusTargetViewKey === rankingViewKey ? focusTarget : null;
  const isMyPositionDisabled =
    !currentMyRanking ||
    currentMyRanking.rank < 1 ||
    isRankingLoading ||
    !isRankingCurrent ||
    isCurrentMyRankingLoading ||
    currentTotalPage < 1;

  useEffect(() => {
    return () => {
      positionRequestId.current += 1;
      isFindingPosition.current = false;
    };
  }, [rankingViewKey]);

  const clearPositionSearch = () => {
    positionRequestId.current += 1;
    isFindingPosition.current = false;
    setFocusTarget(null);
    setFocusTargetViewKey(null);
  };

  const showMyPosition = async () => {
    if (
      isMyPositionDisabled ||
      !currentMyRanking ||
      isFindingPosition.current
    ) {
      return;
    }

    const requestId = ++positionRequestId.current;
    const memberId = currentMyRanking.memberId;
    const myRank = currentMyRanking.rank;
    const period = rankingView.period;
    isFindingPosition.current = true;

    try {
      if (currentRankings.some((ranking) => ranking.memberId === memberId)) {
        setFocusTarget({ memberId, requestId });
        setFocusTargetViewKey(rankingViewKey);
        return;
      }

      let firstPage = 0;
      let lastPage = currentTotalPage - 1;

      while (firstPage <= lastPage) {
        const page = Math.floor((firstPage + lastPage) / 2);
        const res = await getRankingsAction(competitionId, period, page);

        if (requestId !== positionRequestId.current) return;

        if (!res.ok) {
          if (isSilentRankingError(res.error)) {
            markRankingUnavailable();
          } else {
            onError(res.error);
          }
          return;
        }

        const pageRankings = res.data.content as RankingState[];
        if (pageRankings.some((ranking) => ranking.memberId === memberId)) {
          setFocusTarget({ memberId, requestId });
          setFocusTargetViewKey(`${competitionId}:${period}:${page}`);

          if (page === rankingView.page) {
            replaceRankings(pageRankings);
          } else {
            markRankingsLoading();
            updateRankingUrl(period, page);
          }
          return;
        }

        const firstRank = pageRankings[0]?.rank;
        const lastRank = pageRankings.at(-1)?.rank;
        if (firstRank === undefined || lastRank === undefined) break;

        if (myRank < firstRank) {
          lastPage = page - 1;
        } else if (myRank > lastRank) {
          firstPage = page + 1;
        } else {
          break;
        }
      }

      onError({
        code: "RANKING_FAILED",
        message:
          "현재 기간의 랭킹에서 내 순위를 찾지 못했습니다. 새로고침 후 다시 시도해 주세요.",
      });
    } catch {
      if (requestId !== positionRequestId.current) return;

      onError({
        code: "UNKNOWN_ERROR",
        message: "내 순위를 찾지 못했습니다.",
      });
    } finally {
      if (requestId === positionRequestId.current) {
        isFindingPosition.current = false;
      }
    }
  };

  return {
    currentFocusTarget,
    isMyPositionDisabled,
    clearPositionSearch,
    showMyPosition,
  };
}
