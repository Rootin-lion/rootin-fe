"use client";

import RankingSection from "@/components/contests/RankingSection";
import PastContestsSection from "@/components/contests/PastContestsSection";
import WarningBanner from "@/components/contests/WarningBanner";
import ContestCtaBanner from "@/components/contests/ContestCtaBanner";
import Banner from "@/components/contests/Banner";
import { useState } from "react";
import { TodayCompetitionState } from "@/types/contests/competition";
import ModalWrapper from "@/components/shared/ModalWrapper";
import Button from "@/components/shared/Button";
import { useRouter } from "next/navigation";

export default function ContestPage() {
  const router = useRouter();
  const [todayCompetition, setTodayCompetition] =
    useState<TodayCompetitionState>({
      competitionId: 2,
      competitionDate: "2026-08-03",
      startAt: "2026-08-03T12:00:00",
      endAt: "2026-08-03T13:00:00",
      status: "IN_PROGRESS",
      remainingSeconds: 4753,
    });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-bg-green-50 flex w-full flex-col gap-6">
      {isModalOpen && (
        <ModalWrapper onClose={handleModalClose}>
          <ModalWrapper.Box>
            <ModalWrapper.Title>대회에 참여하시겠습니까?</ModalWrapper.Title>
          </ModalWrapper.Box>
          <ModalWrapper.Notice>
            <div className="text-text text-[15px] font-semibold">
              대회 주의사항
            </div>
            <ul className="text-disabled-text mt-3 list-inside list-disc text-[13px] font-medium">
              <li>정답률에 따라 포인트가 지급됩니다.</li>
              <li>제한 시간 초과 시 자동으로 제출됩니다.</li>
              <li>대회 결과는 실시간 랭킹에 반영됩니다.</li>
            </ul>
          </ModalWrapper.Notice>
          <ModalWrapper.Box>
            <div className="flex flex-row gap-6">
              <Button onClick={handleModalClose}>취소</Button>
              <Button
                isActive={true}
                onClick={() =>
                  router.push(`/contests/${todayCompetition.competitionId}`)
                }
              >
                시작하기
              </Button>
            </div>
          </ModalWrapper.Box>
        </ModalWrapper>
      )}

      <Banner competition={todayCompetition} onClick={handleModalOpen} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <RankingSection />
        <PastContestsSection />
        <WarningBanner />
      </div>
      <ContestCtaBanner onClick={handleModalOpen} />
    </div>
  );
}
