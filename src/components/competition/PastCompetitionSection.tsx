"use client";

import { useEffect, useState } from "react";
import ChevronIcon from "@/assets/icon/shared/chevron.svg";
import type { CompetitionResults } from "@/types/competitions/competition";
import { getPastCompetitionAction } from "@/app/(service)/competitions/action";
import BoxWrapper from "@/components/competition/shared/BoxWrapper";
import BarPagination from "@/components/shared/BarPagination";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import ContestResultCard from "./CompetitionResultCard";
import SectionTitle from "./shared/SectionTitle";

export default function PastCompetitionSection() {
  // 과거 대회 상태
  const [contestResults, setContestResults] = useState<CompetitionResults[]>(
    [],
  );
  // 총 페이지 상태
  const [pages, setPages] = useState<number>(0);
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState<number>(0);
  // 에러 모달 상태
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  // 과거 대회 조회
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

      <div className="flex min-w-0 flex-col lg:px-6">
        <SectionTitle
          title="종료된 대회"
          content="이전 대회의 결과를 확인해보세요."
        />
        <div className="mt-7 flex w-full justify-center">
          <div className="grid w-full max-w-210 grid-cols-1 justify-items-center gap-3 md:grid-cols-2 md:gap-6">
            {hasPastContent ? (
              <div className="border-primary-100 bg-primary-50 col-span-full flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
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

        {/* 페이지네이션 */}
        {pages > 1 && (
          <nav className="mt-6 flex items-center justify-between gap-2 md:hidden">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
              className="text-primary-900 focus-visible:outline-primary-900 flex size-11 items-center justify-center rounded-lg text-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronIcon aria-hidden="true" className="h-4 w-2 rotate-180" />
            </button>
            <p className="text-sub-text text-[13px] whitespace-nowrap tabular-nums">
              <span className="text-primary-900 font-semibold">
                {currentPage + 1}
              </span>{" "}
              / {pages}
            </p>
            <button
              type="button"
              disabled={currentPage >= pages - 1}
              onClick={() =>
                setCurrentPage((page) => Math.min(pages - 1, page + 1))
              }
              className="text-primary-900 focus-visible:outline-primary-900 flex size-11 items-center justify-center rounded-lg text-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronIcon aria-hidden="true" className="h-4 w-2" />
            </button>
          </nav>
        )}
        <div className="hidden md:block">
          <BarPagination
            currentPage={currentPage + 1}
            totalPages={pages}
            onPageChange={(page) => setCurrentPage(page - 1)}
            className="mt-9 flex-wrap"
          />
        </div>
      </div>
    </BoxWrapper>
  );
}
