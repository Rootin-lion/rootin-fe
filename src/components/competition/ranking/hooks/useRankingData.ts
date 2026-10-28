"use client";

import { useEffect, useState } from "react";
import type { ApiError } from "@/types/api/error";
import type { RankingState } from "@/types/competitions/competition";
import type { RankingPeriod } from "@/types/competitions/ranking";
import {
  getMyRankingAction,
  getRankingsAction,
} from "@/app/(service)/competitions/action";
import { isSilentRankingError } from "../rankingError";

export default function useRankingData({
  competitionId,
  period,
  page,
  onError,
}: {
  competitionId: number;
  period: RankingPeriod;
  page: number;
  onError: (error: ApiError) => void;
}) {
  const rankingViewKey = `${competitionId}:${period}:${page}`;
  const myRankingKey = `${competitionId}:${period}`;
  const [rankings, setRankings] = useState<RankingState[]>([]);
  const [loadedRankingViewKey, setLoadedRankingViewKey] = useState<
    string | null
  >(null);
  const [settledRankingViewKey, setSettledRankingViewKey] = useState<
    string | null
  >(null);
  const [unavailableRankingViewKey, setUnavailableRankingViewKey] = useState<
    string | null
  >(null);
  const [myRanking, setMyRanking] = useState<RankingState | null>(null);
  const [loadedMyRankingKey, setLoadedMyRankingKey] = useState<string | null>(
    null,
  );
  const [totalPage, setTotalPage] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyRankingLoading, setIsMyRankingLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const isRankingCurrent = loadedRankingViewKey === rankingViewKey;
  const currentRankings = isRankingCurrent ? rankings : [];
  const currentTotalPage = isRankingCurrent ? totalPage : 0;
  const currentMyRanking =
    loadedMyRankingKey === myRankingKey &&
    unavailableRankingViewKey !== rankingViewKey
      ? myRanking
      : null;
  const isRankingLoading =
    isLoading || settledRankingViewKey !== rankingViewKey;
  const isCurrentMyRankingLoading =
    isMyRankingLoading || loadedMyRankingKey !== myRankingKey;

  useEffect(() => {
    let ignore = false;

    const loadRankings = async () => {
      try {
        const res = await getRankingsAction(competitionId, period, page);

        if (ignore) return;

        if (!res.ok) {
          if (isSilentRankingError(res.error)) {
            setRankings([]);
            setTotalPage(0);
            setLoadedRankingViewKey(rankingViewKey);
            setUnavailableRankingViewKey(rankingViewKey);
            setLastUpdatedAt(null);
            return;
          }

          onError(res.error);
          return;
        }

        setTotalPage(res.data.totalPages);
        setRankings(res.data.content);
        setLastUpdatedAt(new Date());
        setLoadedRankingViewKey(rankingViewKey);
        setUnavailableRankingViewKey(null);
      } catch {
        if (ignore) return;

        onError({
          code: "UNKNOWN_ERROR",
          message: "랭킹을 불러오지 못했습니다.",
        });
      } finally {
        if (!ignore) {
          setSettledRankingViewKey(rankingViewKey);
          setIsLoading(false);
        }
      }
    };

    void loadRankings();

    return () => {
      ignore = true;
    };
  }, [competitionId, period, page, rankingViewKey, refreshCount, onError]);

  useEffect(() => {
    let ignore = false;

    const loadMyRanking = async () => {
      try {
        const res = await getMyRankingAction(competitionId, period);

        if (ignore) return;

        if (!res.ok) {
          setMyRanking(null);
          if (isSilentRankingError(res.error)) {
            setLoadedMyRankingKey(myRankingKey);
            return;
          }

          onError(res.error);
          return;
        }

        setMyRanking(res.data);
        setLoadedMyRankingKey(myRankingKey);
      } catch {
        if (ignore) return;

        setMyRanking(null);
        onError({
          code: "UNKNOWN_ERROR",
          message: "랭킹을 불러오지 못했습니다.",
        });
      } finally {
        if (!ignore) setIsMyRankingLoading(false);
      }
    };

    void loadMyRanking();

    return () => {
      ignore = true;
    };
  }, [competitionId, period, myRankingKey, refreshCount, onError]);

  const preparePeriodChange = () => {
    setMyRanking(null);
    setRankings([]);
    setTotalPage(0);
    setIsMyRankingLoading(true);
    setIsLoading(true);
  };

  const markRankingsLoading = () => setIsLoading(true);
  const markRankingUnavailable = () => {
    setMyRanking(null);
    setUnavailableRankingViewKey(rankingViewKey);
  };

  const refresh = () => {
    setIsMyRankingLoading(true);
    setIsLoading(true);
    setRefreshCount((count) => count + 1);
  };

  return {
    rankingViewKey,
    currentRankings,
    currentTotalPage,
    currentMyRanking,
    isRankingCurrent,
    isRankingLoading,
    isCurrentMyRankingLoading,
    lastUpdatedAt: isRankingCurrent ? lastUpdatedAt : null,
    preparePeriodChange,
    markRankingsLoading,
    markRankingUnavailable,
    replaceRankings: setRankings,
    refresh,
  };
}
