"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiError } from "@/types/api/error";
import type { RankingState } from "@/types/competitions/competition";
import type {
  RankingFocusTarget,
  RankingPeriod,
  RankingViewState,
} from "@/types/competitions/ranking";
import {
  getMyRankingAction,
  getRankingsAction,
} from "@/app/(service)/competitions/action";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import RankingContentSection from "./RankingContentSection";
import RankingTitleSection from "./RankingTitleSection";

export default function RankingContent({
  competitionId,
}: {
  competitionId: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const periodParam = searchParams.get("period");
  const pageParam = searchParams.get("page");
  const period: RankingPeriod =
    periodParam === "WEEKLY" || periodParam === "MONTHLY"
      ? periodParam
      : "DAILY";
  const pageNumber = Number(pageParam);
  const page =
    pageParam !== null &&
    /^[1-9]\d*$/.test(pageParam) &&
    Number.isSafeInteger(pageNumber)
      ? pageNumber - 1
      : 0;
  const rankingView: RankingViewState = { period, page };
  const rankingViewKey = `${period}:${page}`;
  const [rankings, setRankings] = useState<RankingState[]>([]);
  const [loadedRankingViewKey, setLoadedRankingViewKey] = useState<
    string | null
  >(null);
  const [settledRankingViewKey, setSettledRankingViewKey] = useState<
    string | null
  >(null);
  const [myRanking, setMyRanking] = useState<RankingState | null>(null);
  const [loadedMyRankingPeriod, setLoadedMyRankingPeriod] =
    useState<RankingPeriod | null>(null);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyRankingLoading, setIsMyRankingLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [focusTarget, setFocusTarget] = useState<RankingFocusTarget | null>(
    null,
  );
  const [focusTargetViewKey, setFocusTargetViewKey] = useState<string | null>(
    null,
  );
  const positionRequestId = useRef(0);
  const isFindingPosition = useRef(false);
  const previousRankingViewKey = useRef(rankingViewKey);
  const hasNavigatedBack = useRef(false);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();
  const isRankingCurrent = loadedRankingViewKey === rankingViewKey;
  const currentRankings = isRankingCurrent ? rankings : [];
  const currentTotalPage = isRankingCurrent ? totalPage : 0;
  const currentFocusTarget =
    focusTargetViewKey === rankingViewKey ? focusTarget : null;
  const currentMyRanking = loadedMyRankingPeriod === period ? myRanking : null;
  const isRankingLoading =
    isLoading || settledRankingViewKey !== rankingViewKey;
  const isCurrentMyRankingLoading =
    isMyRankingLoading || loadedMyRankingPeriod !== period;

  const updateRankingUrl = useCallback(
    (nextPeriod: RankingPeriod, nextPage: number, replace = false) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", nextPeriod);
      params.set("page", String(nextPage + 1));
      const url = `${pathname}?${params.toString()}`;

      if (replace) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (periodParam === period && pageParam === String(page + 1)) return;

    updateRankingUrl(period, page, true);
  }, [page, pageParam, period, periodParam, updateRankingUrl]);

  useEffect(() => {
    if (previousRankingViewKey.current === rankingViewKey) return;

    previousRankingViewKey.current = rankingViewKey;
    positionRequestId.current += 1;
    isFindingPosition.current = false;
  }, [rankingViewKey]);

  const goBackIfUnavailable = useCallback(
    (error: ApiError) => {
      if (
        error.code !== "C404-1" &&
        !/제출하지\s*않|제출되지\s*않|미제출/.test(error.message)
      ) {
        return false;
      }

      if (!hasNavigatedBack.current) {
        hasNavigatedBack.current = true;
        router.back();
      }

      return true;
    },
    [router],
  );

  const clearPositionSearch = () => {
    positionRequestId.current += 1;
    isFindingPosition.current = false;
    setFocusTarget(null);
    setFocusTargetViewKey(null);
  };

  const handlePeriodChange = (period: RankingPeriod) => {
    if (period === rankingView.period) return;
    clearPositionSearch();
    setMyRanking(null);
    setRankings([]);
    setTotalPage(0);
    setIsMyRankingLoading(true);
    setIsLoading(true);
    updateRankingUrl(period, 0);
  };

  const handlePageChange = (page: number) => {
    if (page === rankingView.page) return;
    clearPositionSearch();
    setIsLoading(true);
    updateRankingUrl(rankingView.period, page);
  };

  const handleRefresh = () => {
    if (isRankingLoading) return;
    clearPositionSearch();
    setIsMyRankingLoading(true);
    setIsLoading(true);
    setRefreshCount((count) => count + 1);
  };

  const handleShowMyPosition = async () => {
    if (
      !currentMyRanking ||
      currentMyRanking.rank < 1 ||
      isRankingLoading ||
      !isRankingCurrent ||
      isCurrentMyRankingLoading ||
      totalPage < 1 ||
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
      let lastPage = totalPage - 1;

      while (firstPage <= lastPage) {
        const page = Math.floor((firstPage + lastPage) / 2);
        const res = await getRankingsAction(competitionId, period, page);

        if (requestId !== positionRequestId.current) return;

        if (!res.ok) {
          if (goBackIfUnavailable(res.error)) return;

          setErrorContext(res.error);
          openModal();
          return;
        }

        const pageRankings = res.data.content as RankingState[];
        if (pageRankings.some((ranking) => ranking.memberId === memberId)) {
          setFocusTarget({ memberId, requestId });
          setFocusTargetViewKey(`${period}:${page}`);

          if (page === rankingView.page) {
            setRankings(pageRankings);
          } else {
            setIsLoading(true);
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

      setErrorContext({
        code: "RANKING_FAILED",
        message:
          "현재 기간의 랭킹에서 내 순위를 찾지 못했습니다. 새로고침 후 다시 시도해 주세요.",
      });
      openModal();
    } catch {
      if (requestId !== positionRequestId.current) return;

      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "내 순위를 찾지 못했습니다.",
      });
      openModal();
    } finally {
      if (requestId === positionRequestId.current) {
        isFindingPosition.current = false;
      }
    }
  };

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
          if (goBackIfUnavailable(res.error)) return;

          setErrorContext(res.error);
          openModal();
          return;
        }

        setTotalPage(res.data.totalPages);
        setRankings(res.data.content);
        setLastUpdatedAt(new Date());
        setLoadedRankingViewKey(rankingViewKey);
      } catch {
        if (ignore) return;

        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "랭킹을 불러오지 못했습니다.",
        });
        openModal();
      } finally {
        if (!ignore) {
          setSettledRankingViewKey(rankingViewKey);
          setIsLoading(false);
        }
      }
    };

    void getRankings();

    return () => {
      ignore = true;
    };
  }, [
    competitionId,
    rankingView.period,
    rankingView.page,
    rankingViewKey,
    refreshCount,
    goBackIfUnavailable,
    setErrorContext,
    openModal,
  ]);

  useEffect(() => {
    let ignore = false;

    const getMyRanking = async () => {
      try {
        const res = await getMyRankingAction(competitionId, rankingView.period);

        if (ignore) return;

        if (!res.ok) {
          setMyRanking(null);
          if (goBackIfUnavailable(res.error)) return;

          setErrorContext(res.error);
          openModal();
          return;
        }

        setMyRanking(res.data);
        setLoadedMyRankingPeriod(rankingView.period);
      } catch {
        if (ignore) return;

        setMyRanking(null);
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "랭킹을 불러오지 못했습니다.",
        });
        openModal();
      } finally {
        if (!ignore) setIsMyRankingLoading(false);
      }
    };

    void getMyRanking();

    return () => {
      ignore = true;
    };
  }, [
    competitionId,
    rankingView.period,
    refreshCount,
    goBackIfUnavailable,
    setErrorContext,
    openModal,
  ]);

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
          lastUpdatedAt={lastUpdatedAt}
          isLoading={isRankingLoading}
          onRefresh={handleRefresh}
        />
        <RankingContentSection
          myRanking={currentMyRanking}
          rankings={currentRankings}
          rankingView={rankingView}
          totalPage={currentTotalPage}
          focusTarget={currentFocusTarget}
          isMyPositionDisabled={
            !currentMyRanking ||
            currentMyRanking.rank < 1 ||
            isRankingLoading ||
            !isRankingCurrent ||
            isCurrentMyRankingLoading ||
            currentTotalPage < 1
          }
          onPeriodChange={handlePeriodChange}
          onPageChange={handlePageChange}
          onShowMyPosition={() => void handleShowMyPosition()}
        />
      </div>
    </div>
  );
}
