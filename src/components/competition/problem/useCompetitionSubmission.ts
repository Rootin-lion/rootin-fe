"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/types/api/error";
import { submitContestAction } from "@/app/(service)/competitions/action";

type SubmitModalType = "confirm" | "autoSubmitted" | null;
type SubmitTrigger = "manual" | "timeout";

export default function useCompetitionSubmission(
  competitionId: number,
  onError: (error: ApiError) => void,
) {
  const router = useRouter();
  const [activeSubmitModal, setActiveSubmitModal] =
    useState<SubmitModalType>(null);

  const openSubmitConfirmModal = () => {
    setActiveSubmitModal("confirm");
  };

  const openAutoSubmitModal = () => {
    setActiveSubmitModal("autoSubmitted");
  };

  const closeSubmitModal = () => {
    setActiveSubmitModal(null);
  };

  const submitCompetition = async (trigger: SubmitTrigger) => {
    try {
      const res = await submitContestAction(competitionId);

      if (!res.ok) {
        closeSubmitModal();
        onError(res.error);

        return;
      }

      if (trigger === "timeout") {
        openAutoSubmitModal();

        return;
      }

      closeSubmitModal();
      router.replace(`/competitions/${competitionId}/result`);
    } catch {
      closeSubmitModal();
      onError({
        code: "UNKNOWN_ERROR",
        message: "대회 제출에 실패했습니다.",
      });
    }
  };

  return {
    activeSubmitModal,
    openSubmitConfirmModal,
    closeSubmitModal,
    submitCompetition,
  };
}
