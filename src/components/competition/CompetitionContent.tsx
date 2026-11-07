"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type {
  CompetitionStatus,
  TodayCompetitionState,
} from "@/types/competitions/competition";
import {
  getCompetitionStatusAction,
  getTodayCompetitionAction,
  joinCompetitionAction,
} from "@/app/(service)/competitions/action";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import useModal from "@/hooks/useModal";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import { useTodayCompetitionStore } from "@/stores/useTodayCompetitionStore";
import CompetitionBanner from "./CompetitionBanner";
import CompetitionCtaBanner from "./CompetitionCtaBanner";
import CompetitionJoinModal from "./CompetitionJoinModal";
import PastCompetitionSection from "./PastCompetitionSection";
import RankingSection from "./RankingSection";
import WarningBanner from "./WarningBanner";

export default function CompetitionContent() {
  const router = useRouter();
  const [expiredStatus, setExpiredStatus] = useState<CompetitionStatus | null>(
    null,
  );
  // 오늘의 대회 상태
  const [todayCompetition, setTodayCompetition] =
    useState<TodayCompetitionState>({
      competitionId: 0,
      competitionDate: "",
      startAt: "",
      endAt: "",
      status: "CLOSED",
      remainingSeconds: 0,
      participantCount: 0,
    });
  const setParticipation = useCompetitionParticipationStore(
    (state) => state.setParticipation,
  );
  const saveTodayCompetition = useTodayCompetitionStore(
    (state) => state.saveTodayCompetition,
  );
  const clearTodayCompetition = useTodayCompetitionStore(
    (state) => state.clearTodayCompetition,
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
  const loadTodayCompetition = useCallback(async () => {
    try {
      const res = await getTodayCompetitionAction();

      if (!res.ok) {
        clearTodayCompetition();
        setErrorContext(res.error);
        setTodayCompetition((prev) => ({
          ...prev,
          status: "CLOSED",
        }));
        openErrorModal();

        return null;
      }

      const competition: TodayCompetitionState = res.data;
      setTodayCompetition(competition);
      saveTodayCompetition({
        competitionId: competition.competitionId,
        competitionDate: competition.competitionDate,
      });

      return competition;
    } catch {
      clearTodayCompetition();
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "대회를 불러오지 못했습니다.",
      });
      setTodayCompetition((prev) => ({
        ...prev,
        status: "CLOSED",
      }));
      openErrorModal();

      return null;
    }
  }, [
    clearTodayCompetition,
    openErrorModal,
    saveTodayCompetition,
    setErrorContext,
  ]);

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

  // 최초 대회 조회
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTodayCompetition();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTodayCompetition]);

  // 만료 직후 서버의 상태 전환이 늦어져도 새로고침 없이 다시 확인한다.
  useEffect(() => {
    if (expiredStatus === null) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const refreshExpiredCompetition = async () => {
      const competition = await loadTodayCompetition();
      if (cancelled) return;

      if (competition && competition.status === expiredStatus) {
        timeoutId = window.setTimeout(refreshExpiredCompetition, 1000);
        return;
      }

      setExpiredStatus(null);
    };

    void refreshExpiredCompetition();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [expiredStatus, loadTodayCompetition]);

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
        onExpire={() => setExpiredStatus(todayCompetition.status)}
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 md:px-6 lg:px-0">
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
