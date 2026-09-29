"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  getCompetitionStatusAction,
  getTodayCompetitionAction,
  joinCompetitionAction,
} from "@/app/(service)/competitions/action";
import useErrorModal from "@/hooks/useErrorModal";
import useModal from "@/hooks/useModal";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import { TodayCompetitionState } from "@/types/competitions/competition";
import ErrorModal from "../shared/ErrorModal";
import CompetitionBanner from "./CompetitionBanner";
import CompetitionCtaBanner from "./CompetitionCtaBanner";
import CompetitionJoinModal from "./CompetitionJoinModal";
import PastCompetitionSection from "./PastCompetitionSection";
import ProblemAutoSubmitModal from "./problem/ProblemAutoSubmitModal";
import RankingSection from "./RankingSection";
import WarningBanner from "./WarningBanner";

export default function CompetitionContent() {
  const router = useRouter();
  // 오늘의 대회 정보
  const [todayCompetition, setTodayCompetition] =
    useState<TodayCompetitionState>({
      competitionId: 0,
      competitionDate: "",
      startAt: "",
      endAt: "",
      status: "CLOSED",
      remainingSeconds: 0,
    });
  const setParticipation = useCompetitionParticipationStore(
    (state) => state.setParticipation,
  );

  // 에러 모달 상태
  const {
    error,
    setErrorContext,
    isModalOpen: isErrorModalOpen,
    openModal: openErrorModal,
    closeModal: closeErrorModal,
  } = useErrorModal();

  // 모달 상태
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
      const statusRes = await getCompetitionStatusAction(
        todayCompetition.competitionId,
      );

      if (statusRes.ok) {
        setParticipation({
          participantId: statusRes.data.participantId,
          startedAt: statusRes.data.startedAt,
          expiresAt: statusRes.data.expiresAt,
        });
        closeModal();
        router.push(
          statusRes.data.submitted
            ? `/competitions/${todayCompetition.competitionId}/result`
            : `/competitions/${todayCompetition.competitionId}`,
        );

        return;
      }

      const res = await joinCompetitionAction(todayCompetition.competitionId);

      if (!res.ok) {
        closeModal();
        setErrorContext(res.error);
        openErrorModal();

        return;
      }
      setParticipation(res.data);
      closeModal();
      router.push(`/competitions/${todayCompetition.competitionId}`);
    } catch {
      closeModal();
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "대회에 참가하지 못했습니다.",
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
        <CompetitionJoinModal onClose={closeModal} onStart={joinCompetition} />
      )}

      <CompetitionBanner
        competition={todayCompetition}
        onClick={openModal}
        onExpire={getCompetition}
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <RankingSection competitionId={todayCompetition.competitionId} />
        <PastCompetitionSection />
        <WarningBanner />
      </div>
      <CompetitionCtaBanner
        isOpen={todayCompetition.status}
        onClick={openModal}
      />
    </div>
  );
}
