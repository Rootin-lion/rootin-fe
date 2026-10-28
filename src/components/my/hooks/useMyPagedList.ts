"use client";

import { useEffect, useState } from "react";
import type { ApiError } from "@/types/api/error";

type PageResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export default function useMyPagedList<T>(
  loadPage: (page: number) => Promise<PageResult<T>>,
  onLoadError?: (error: ApiError) => void,
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const result = await loadPage(currentPage);
        if (ignore) return;

        if (!result.ok) {
          setPageData(null);
          setHasLoadError(true);
          onLoadError?.(result.error);
          return;
        }

        setPageData(result.data);
        setHasLoadError(false);
      } catch {
        if (ignore) return;
        setPageData(null);
        setHasLoadError(true);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    void load();
    return () => {
      ignore = true;
    };
  }, [currentPage, loadPage, onLoadError]);

  const changePage = (page: number) => {
    if (page === currentPage) return;
    setIsLoading(true);
    setHasLoadError(false);
    setCurrentPage(page);
  };

  return { currentPage, pageData, isLoading, hasLoadError, changePage };
}
