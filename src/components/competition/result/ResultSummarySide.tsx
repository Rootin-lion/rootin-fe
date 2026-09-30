"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import CharImg from "@/assets/competitions/result/char.png";
import type { CompetitionResultState } from "@/types/competitions/competition";
import PrimaryDarkButton from "@/components/shared/PrimaryDarkButton";
import RankSection from "./RankSection";
import ScoreSection from "./ScoreSection";

export default function ResultSummarySide({
  competitionId,
  competitionResult,
  profileImageUrl,
}: {
  competitionId: number;
  competitionResult: CompetitionResultState;
  profileImageUrl: string | null;
}) {
  const router = useRouter();
  const competitionDate = new Date(competitionResult.competitionDate);
  const competitionWeekday = Number.isNaN(competitionDate.getTime())
    ? null
    : competitionDate.toLocaleDateString("ko-KR", {
        weekday: "short",
        timeZone: "Asia/Seoul",
      });

  return (
    <div className="flex max-h-122.5 min-w-37 flex-col items-center rounded-lg bg-white px-5 py-7">
      <div className="border-primary-300 flex h-20 w-20 flex-col items-center justify-center rounded-[50%] border">
        <Image
          src={profileImageUrl || CharImg}
          alt="프로필 이미지"
          width={73}
          height={80}
          unoptimized={Boolean(profileImageUrl)}
        />
      </div>
      <p className="mt-4 text-[15px] font-semibold">CS 대회 결과</p>
      <p className="mt-2 text-[12px] font-medium">
        {competitionResult.competitionDate.replaceAll("-", ".")}
        {competitionWeekday && ` (${competitionWeekday})`}
      </p>
      <ScoreSection competitionResult={competitionResult} />
      <RankSection />
      <PrimaryDarkButton
        className="mt-4 py-2 text-center text-[12px]"
        onClick={() => router.push(`/competitions/${competitionId}/ranking`)}
      >
        랭킹 보기
      </PrimaryDarkButton>
    </div>
  );
}
