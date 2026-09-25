"use client";

import { useEffect, useState } from "react";
import type { ContestResultsState } from "@/types/contests/competition";
import BoxWrapper from "@/components/contests/BoxWrapper";
import ContestResultCard from "./ContestResultCard";
import SectionTitle from "./SectionTitle";
import { getPastCompetitionAction } from "@/app/(service)/contests/action";
import useErrorModal from "@/hooks/useErrorModal";
import ErrorModal from "../shared/ErrorModal";

const Bar = ({
  isActive,
  onClick,
}: {
  isActive?: boolean;
  onClick: () => void;
}) => {
  const wdtStyle = isActive ? "w-8" : "w-5";
  const bgStyle = isActive ? "bg-primary" : "bg-[#D9D9D9]";
  return (
    <div
      className={`h-2 w-5 rounded-lg ${wdtStyle} ${bgStyle} cursor-pointer`}
      onClick={onClick}
    />
  );
};

export default function PastContestsSection() {
  const [contestResults, setContestResults] = useState<ContestResultsState[]>([
    {
      competitionId: 1,
      competitionDate: "2026-08-03",
      problemCount: 10,
      timeLimitMinutes: 30,
      participantCount: 1,
      viewable: true,
    },
    {
      competitionId: 2,
      competitionDate: "2026-07-27",
      problemCount: 10,
      timeLimitMinutes: 30,
      participantCount: 0,
      viewable: false,
    },
    {
      competitionId: 3,
      competitionDate: "2026-08-03",
      problemCount: 10,
      timeLimitMinutes: 30,
      participantCount: 1,
      viewable: true,
    },
    {
      competitionId: 4,
      competitionDate: "2026-07-27",
      problemCount: 10,
      timeLimitMinutes: 30,
      participantCount: 0,
      viewable: false,
    },
  ]);
  const [pages, setPages] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  useEffect(() => {
    const getPastCompetitions = async (page: number) => {
      try {
        const res = await getPastCompetitionAction(page);

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();
        }

        setContestResults(res.data.content);
        setPages(res.data.totalPages);
      } catch {
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "과거 대회를 불러오지 못했습니다.",
        });
        openModal();
      }
    };

    getPastCompetitions(currentPage);
  }, [openModal, setErrorContext, currentPage]);

  return (
    <BoxWrapper>
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="flex flex-col px-6">
        <SectionTitle
          title="종료된 대회"
          content="이전 대회의 결과를 확인해보세요."
        />
        <div className="mt-7 flex w-full justify-center">
          <div className="grid w-full max-w-210 grid-cols-2 justify-items-center gap-6">
            {contestResults.map((result) => (
              <ContestResultCard key={result.competitionId} contests={result} />
            ))}
          </div>
        </div>
        <div className="mt-9 flex justify-center gap-2">
          {Array.from({ length: pages + 1 }, (_, index) => (
            <Bar
              key={index}
              isActive={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            />
          ))}
        </div>
      </div>
    </BoxWrapper>
  );
}
