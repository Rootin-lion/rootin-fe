"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import CharImg from "@/assets/images/competitions/result/char.png";
import type { CompetitionResultState } from "@/types/competitions/competition";
import PrimaryDarkButton from "@/components/shared/PrimaryDarkButton";
import { formatCompetitionDateWithWeekday } from "@/lib/competitions/formatCompetitionDateWithWeekday";
import { useTodayCompetitionStore } from "@/stores/useTodayCompetitionStore";
import RankSection from "./RankSection";
import ScoreSection from "./ScoreSection";

export default function ResultSummarySide({
  competitionResult,
  profileImageUrl,
}: {
  competitionResult: CompetitionResultState;
  profileImageUrl: string | null;
}) {
  const router = useRouter();
  const handleRankingClick = () => {
    const { todayCompetition, clearTodayCompetition } =
      useTodayCompetitionStore.getState();
    const today = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (
      !todayCompetition ||
      !Number.isSafeInteger(todayCompetition.competitionId) ||
      todayCompetition.competitionId <= 0 ||
      todayCompetition.competitionDate.slice(0, 10) !== today
    ) {
      clearTodayCompetition();
      router.push("/competitions");
      return;
    }

    router.push(
      `/competitions/${todayCompetition.competitionId}/ranking?period=DAILY&page=1`,
    );
  };

  return (
    <div className="w-full shrink-0 rounded-lg bg-white p-4 md:max-h-122.5 md:w-37 md:px-5 md:py-7">
      <div className="flex items-center gap-3 md:flex-col md:gap-0">
        <div className="border-primary-300 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border md:h-20 md:w-20">
          <Image
            src={profileImageUrl || CharImg}
            alt="프로필 이미지"
            width={73}
            height={80}
            unoptimized={Boolean(profileImageUrl)}
            className={
              profileImageUrl
                ? "h-full w-full object-cover"
                : "h-full w-auto object-contain"
            }
          />
        </div>
        <div className="min-w-0 md:text-center">
          <h1 className="text-[16px] font-semibold md:mt-4 md:text-[15px]">
            CS 대회 결과
          </h1>
          <p className="mt-1 text-[12px] font-medium md:mt-2">
            {formatCompetitionDateWithWeekday(
              competitionResult.competitionDate,
            )}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:mt-0 md:block">
        <ScoreSection competitionResult={competitionResult} />
        <RankSection competitionResult={competitionResult} />
        <PrimaryDarkButton
          className="py-1.5 text-center text-[11px] max-md:col-start-2 max-md:row-start-2 max-md:block max-md:min-h-8 max-md:w-auto max-md:self-center max-md:justify-self-end max-md:px-3 md:mt-4 md:py-2 md:text-[12px]"
          onClick={handleRankingClick}
        >
          랭킹 보기
        </PrimaryDarkButton>
      </div>
    </div>
  );
}
