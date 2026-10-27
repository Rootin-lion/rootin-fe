"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageIcon from "@/assets/my/report/page.png";
import type { MyReportsPage } from "@/types/my/report";
import { getMyReportsAction } from "@/app/(service)/my/action";
import BarPagination from "@/components/shared/BarPagination";
import ReportItem from "./ReportItem";

export default function MyReport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPage, setReportsPage] = useState<MyReportsPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadReports = async () => {
      try {
        const res = await getMyReportsAction(currentPage);
        if (ignore) return;

        if (!res.ok) {
          setReportsPage(null);
          setHasLoadError(true);
          return;
        }

        setReportsPage(res.data);
        setHasLoadError(false);
      } catch {
        if (ignore) return;
        setReportsPage(null);
        setHasLoadError(true);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    void loadReports();

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setIsLoading(true);
    setHasLoadError(false);
    setCurrentPage(page);
  };

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
          onPageChange={handlePageChange}
          className="mt-20"
        />
      )}
    </div>
  );
}
