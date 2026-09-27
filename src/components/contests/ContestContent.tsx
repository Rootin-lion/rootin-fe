"use client";

import useModal from "@/hooks/useModal";
import { TodayCompetitionState } from "@/types/contests/competition";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ModalWrapper from "../shared/ModalWrapper";
import Button from "../shared/Button";
import ContestBanner from "./ContestBanner";
import ContestCtaBanner from "./ContestCtaBanner";
import WarningBanner from "./WarningBanner";
import PastContestsSection from "./PastContestsSection";
import RankingSection from "./RankingSection";
import {
  getTodayCompetitionAction,
  joinCompetitionAction,
} from "@/app/(service)/contests/action";
import useErrorModal from "@/hooks/useErrorModal";
import ErrorModal from "../shared/ErrorModal";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";

export default function ContestContent() {
  const router = useRouter();
  const [todayCompetition, setTodayCompetition] =
    useState<TodayCompetitionState>({
      competitionId: 0,
      competitionDate: "",
      startAt: "",
      endAt: "",
      status: "CLOSED",
      remainingSeconds: 0,
    });
  const { setParticipation } = useCompetitionParticipationStore();
  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();
  const { isModalOpen, openModal, closeModal } = useModal();

  // 대회 조회
  const getCompetition = useCallback(async () => {
    try {
      const res = await getTodayCompetitionAction();

      if (!res.ok) {
        setErrorContext(res.error);
        setTodayCompetition((prev) => ({
          ...prev,
          status: "CLOSED",
        }));
        openErrorModal();

        return;
      }

      setTodayCompetition(res.data);
    } catch {
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "대회를 불러오지 못했습니다.",
      });
      setTodayCompetition((prev) => ({
        ...prev,
        status: "CLOSED",
      }));
      openErrorModal();
    }
  }, [openErrorModal, setErrorContext]);

  // 대회 진입
  const joinCompetition = async () => {
    try {
      const res = await joinCompetitionAction(todayCompetition.competitionId);

      if (!res.ok) {
        setErrorContext(res.error);
        openErrorModal();

        return;
      }
      setParticipation(res.data);
      router.push(`/contests/${todayCompetition.competitionId}`);
    } catch {
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "대회를 불러오지 못했습니다.",
      });
      openErrorModal();
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void getCompetition();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [getCompetition]);

  return (
    <div className="bg-bg-green-50 flex w-full flex-col gap-6">
      {isErrorModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeErrorModal}
        />
      )}

      {isModalOpen && (
        <ModalWrapper onClose={closeModal}>
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
              <Button onClick={closeModal}>취소</Button>
              <Button isActive={true} onClick={() => joinCompetition()}>
                시작하기
              </Button>
            </div>
          </ModalWrapper.Box>
        </ModalWrapper>
      )}

      <ContestBanner
        competition={todayCompetition}
        onClick={openModal}
        onExpire={getCompetition}
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <RankingSection competitionId={todayCompetition.competitionId} />
        <PastContestsSection />
        <WarningBanner />
      </div>
      <ContestCtaBanner isOpen={todayCompetition.status} onClick={openModal} />
    </div>
  );
}
