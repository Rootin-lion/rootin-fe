"use client";

import Image from "next/image";
import PageIcon from "@/assets/my/report/page.png";
import type { MyReportsPage } from "@/types/my/report";
import { getMyReportsAction } from "@/app/(service)/my/action";
import BarPagination from "@/components/shared/BarPagination";
import useMyPagedList from "../hooks/useMyPagedList";
import ReportItem from "./ReportItem";

export default function MyReport() {
  const {
    currentPage,
    pageData: reportsPage,
    isLoading,
    hasLoadError,
    changePage,
  } = useMyPagedList<MyReportsPage>(getMyReportsAction);

  return (
    <div className="flex flex-col justify-between">
      <div className="max-h-129">
        <div className="flex flex-row gap-2">
          <h3 className="text-subtitle text-text">면접 리포트</h3>
          <div className="bg-primary-100 flex flex-row items-center gap-1 rounded-xl px-2 py-1 text-[12px] font-medium text-[#6C6A6A]">
            <Image src={PageIcon} alt="" className="h-3 w-3" />총{" "}
            {reportsPage?.totalElements ?? 0}개
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
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
        <BarPagination
          currentPage={currentPage}
          totalPages={reportsPage?.totalPages ?? 0}
          onPageChange={changePage}
          className="mt-20"
        />
      )}
    </div>
  );
}
