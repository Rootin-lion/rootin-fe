"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import type { RankingPeriod } from "@/types/competitions/ranking";

export default function useRankingView() {
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

  return { rankingView: { period, page }, updateRankingUrl };
}
