"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/types/api/error";
import { submitContestAction } from "@/app/(service)/competitions/action";

type SubmitModalType = "confirm" | "autoSubmitted" | null;
type SubmitTrigger = "manual" | "timeout";

export default function useCompetitionSubmission(
  competitionId: number,
  onError: (error: ApiError) => void,
  answers: {
    lockAnswers: (expired: boolean) => void;
    waitForPendingSaves: () => Promise<boolean>;
    resumeAnswers: () => void;
  },
) {
  const router = useRouter();
  const submittingRef = useRef(false);
  const expiredRef = useRef(false);
  const [activeSubmitModal, setActiveSubmitModal] =
    useState<SubmitModalType>(null);

  const openSubmitConfirmModal = () => {
    setActiveSubmitModal("confirm");
  };

  const openAutoSubmitModal = () => {
    setActiveSubmitModal("autoSubmitted");
  };

  const closeSubmitModal = () => {
    if (submittingRef.current) return;
    setActiveSubmitModal(null);
  };

  const submitCompetition = async (trigger: SubmitTrigger) => {
    if (trigger === "timeout") expiredRef.current = true;
    answers.lockAnswers(expiredRef.current);
    if (submittingRef.current) return;

    submittingRef.current = true;
    let submitted = false;

    try {
      const saved = await answers.waitForPendingSaves();
      if (!saved && !expiredRef.current) {
        setActiveSubmitModal(null);
        return;
      }

      // At the deadline, submit even when a pending save was rejected as late.
      const res = await submitContestAction(competitionId);

      if (!res.ok) {
        setActiveSubmitModal(null);
        onError(res.error);

        return;
      }

      submitted = true;
      if (expiredRef.current) {
        openAutoSubmitModal();

        return;
      }

      setActiveSubmitModal(null);
      router.replace(`/competitions/${competitionId}/result`);
    } catch {
      setActiveSubmitModal(null);
      onError({
        code: "UNKNOWN_ERROR",
        message: "대회 제출에 실패했습니다.",
      });
    } finally {
      submittingRef.current = false;
      if (!submitted && !expiredRef.current) answers.resumeAnswers();
    }
  };

  return {
    activeSubmitModal,
    openSubmitConfirmModal,
    closeSubmitModal,
    submitCompetition,
  };
}
