"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import CharImg from "@/assets/competitions/result/char.png";
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
    <div className="flex max-h-122.5 w-37 shrink-0 flex-col items-center rounded-lg bg-white px-5 py-7">
      <div className="border-primary-300 flex h-20 w-20 shrink-0 flex-col items-center justify-center overflow-hidden rounded-full border">
        <Image
          src={profileImageUrl || CharImg}
          alt="프로필 이미지"
          width={73}
          height={80}
          unoptimized={Boolean(profileImageUrl)}
          className={profileImageUrl ? "h-full w-full object-cover" : undefined}
        />
      </div>
      <p className="mt-4 text-[15px] font-semibold">CS 대회 결과</p>
      <p className="mt-2 text-[12px] font-medium">
        {formatCompetitionDateWithWeekday(competitionResult.competitionDate)}
      </p>
      <ScoreSection competitionResult={competitionResult} />
      <RankSection competitionResult={competitionResult} />
      <PrimaryDarkButton
        className="mt-4 py-2 text-center text-[12px]"
        onClick={handleRankingClick}
      >
        랭킹 보기
      </PrimaryDarkButton>
    </div>
  );
}
