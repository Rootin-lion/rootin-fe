"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ChevronIcon from "@/assets/icons/shared/chevron.svg";
import PageIcon from "@/assets/icons/my/report/page.png";
import type { MyReportsPage } from "@/types/my/report";
import { getMyReportsAction } from "@/app/(service)/my/action";
import BarPagination from "@/components/shared/BarPagination";
import { getMyListHref } from "@/constants/my/navigation";
import useMyPagedList from "../hooks/useMyPagedList";
import ReportItem from "./ReportItem";

export default function MyReport({ currentPage }: { currentPage: number }) {
  const router = useRouter();
  const {
    pageData: reportsPage,
    isLoading,
    hasLoadError,
  } = useMyPagedList<MyReportsPage>(getMyReportsAction, currentPage);

  const totalPages = reportsPage?.totalPages ?? 0;
  const handlePageChange = (page: number) => {
    router.push(getMyListHref("interview", page), { scroll: false });
  };

  return (
    <div className="flex min-w-0 flex-col">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="md:text-subtitle text-text text-[14px]">
            면접 리포트
          </h3>
          <div className="bg-primary-100 flex items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium text-[#6C6A6A] md:text-[12px]">
            <Image src={PageIcon} alt="" className="size-3 shrink-0" />총{" "}
            {reportsPage?.totalElements ?? 0}개
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 md:mt-6 md:gap-4">
          {isLoading ? null : hasLoadError ? (
            <div className="text-sub-text text-sm">
              리포트를 불러오지 못했습니다.
            </div>
          ) : reportsPage?.content.length ? (
            reportsPage.content.map((report) => (
              <ReportItem key={report.reportId} report={report} />
            ))
          ) : (
            <p className="text-sub-text text-sm">
              아직 면접 리포트가 없습니다.
            </p>
          )}
        </div>
      </div>

      {!isLoading && !hasLoadError && (
        <>
          {totalPages > 1 && (
            <nav
              aria-label="면접 리포트 페이지 이동"
              className="mt-6 flex items-center justify-between gap-2 md:hidden"
            >
              <button
                type="button"
                aria-label="이전 페이지"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-primary-900 focus-visible:outline-primary flex min-h-11 items-center gap-2 rounded-lg px-2 text-[12px] focus-visible:outline-2 enabled:cursor-pointer disabled:opacity-40"
              >
                <ChevronIcon
                  aria-hidden="true"
                  className="h-4 w-2 rotate-180"
                />
                이전
              </button>
              <p
                className="text-sub-text text-[12px] whitespace-nowrap tabular-nums"
                aria-live="polite"
              >
                <span className="text-primary-900 font-semibold">
                  {currentPage}
                </span>{" "}
                / {totalPages}
              </p>
              <button
                type="button"
                aria-label="다음 페이지"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="text-primary-900 focus-visible:outline-primary flex min-h-11 items-center gap-2 rounded-lg px-2 text-[12px] focus-visible:outline-2 enabled:cursor-pointer disabled:opacity-40"
              >
                다음
                <ChevronIcon aria-hidden="true" className="h-4 w-2" />
              </button>
            </nav>
          )}
          <div className="hidden md:block">
            <BarPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-20"
            />
          </div>
        </>
      )}
    </div>
  );
}
