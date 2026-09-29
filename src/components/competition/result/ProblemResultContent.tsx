"use client";

import ResultSummarySide from "./ResultSummarySide";
import ResultDetailSide from "./ResultDetailSide";
import { useEffect, useState } from "react";
import { getCompetitionResultAction } from "@/app/(service)/competitions/action";
import useModal from "@/hooks/useModal";
import useErrorModal from "@/hooks/useErrorModal";
import ErrorModal from "@/components/shared/ErrorModal";
import { CompetitionResultState } from "@/types/competitions/competition";

export default function ProblemResultContent({
  competitionId,
  profileImageUrl,
}: {
  competitionId: number;
  profileImageUrl: string | null;
}) {
  const [competitionResult, setCompetitionResult] =
    useState<CompetitionResultState>({
      competitionDate: "0000-00-00",
      score: 0,
      totalScore: 0,
      correctCount: 0,
      totalCount: 0,
      solvingTimeSeconds: 0,
      problemResults: [],
      strongCategories: [],
      weakCategories: [],
    });

  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  useEffect(() => {
    const getCompetitionResult = async () => {
      try {
        const res = await getCompetitionResultAction(competitionId);
        if (!res.ok) {
          setErrorContext(res.error);
          openModal();

          return;
        }

        setCompetitionResult(res.data);
      } catch {
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "대회 결과 조회에 실패했습니다.",
        });
        openModal();
      }
    };

    void getCompetitionResult();
  }, [competitionId, setErrorContext, openModal]);

  return (
    <>
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <ResultSummarySide
        competitionId={competitionId}
        competitionResult={competitionResult}
        profileImageUrl={profileImageUrl}
      />
      <ResultDetailSide
        competitionId={competitionId}
        competitionResult={competitionResult}
      />
    </>
  );
}
