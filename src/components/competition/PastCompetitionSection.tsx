"use client";

import { useEffect, useState } from "react";
import type { ContestResultsState } from "@/types/competitions/competition";
import { getPastCompetitionAction } from "@/app/(service)/competitions/action";
import BoxWrapper from "@/components/competition/shared/BoxWrapper";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import ContestResultCard from "./CompetitionResultCard";
import SectionTitle from "./shared/SectionTitle";

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

export default function PastCompetitionSection() {
  const [contestResults, setContestResults] = useState<ContestResultsState[]>(
    [],
  );
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  useEffect(() => {
    const getPastCompetitions = async (page: number) => {
      try {
        const res = await getPastCompetitionAction(page);

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();

          return;
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

    void getPastCompetitions(currentPage);
  }, [openModal, setErrorContext, currentPage]);

  const hasPastContent = contestResults.length === 0;

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
            {hasPastContent ? (
              <div className="border-primary-100 bg-primary-50 col-span-2 flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
                <p className="text-text text-[16px] font-semibold">
                  아직 종료된 대회가 없어요.
                </p>
                <p className="text-sub-text mt-1 text-[12px] font-medium">
                  대회가 종료되면 참여한 대회의 결과를 확인할 수 있어요.
                </p>
              </div>
            ) : (
              <>
                {contestResults.map((result) => (
                  <ContestResultCard
                    key={result.competitionId}
                    contest={result}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <div className="mt-9 flex justify-center gap-2">
          {pages === 0 ? (
            ""
          ) : (
            <>
              {Array.from({ length: pages }, (_, index) => (
                <Bar
                  key={index}
                  isActive={index === currentPage}
                  onClick={() => {
                    setCurrentPage(index);
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </BoxWrapper>
  );
}
