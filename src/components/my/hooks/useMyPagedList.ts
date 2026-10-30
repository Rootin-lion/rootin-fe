"use client";

import { useEffect, useState } from "react";
import type { ApiError } from "@/types/api/error";

type PageResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export default function useMyPagedList<T>(
  loadPage: (page: number) => Promise<PageResult<T>>,
  currentPage: number,
  onLoadError?: (error: ApiError) => void,
) {
  const [pageState, setPageState] = useState({
    page: currentPage,
    data: null as T | null,
    hasLoadError: false,
    isLoading: true,
  });

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const result = await loadPage(currentPage);
        if (ignore) return;

        if (!result.ok) {
          setPageState({
            page: currentPage,
            data: null,
            hasLoadError: true,
            isLoading: false,
          });
          onLoadError?.(result.error);
          return;
        }

        setPageState({
          page: currentPage,
          data: result.data,
          hasLoadError: false,
          isLoading: false,
        });
      } catch {
        if (ignore) return;
        setPageState({
          page: currentPage,
          data: null,
          hasLoadError: true,
          isLoading: false,
        });
      }
    };

    void load();
    return () => {
      ignore = true;
    };
  }, [currentPage, loadPage, onLoadError]);

  const isCurrentPage = pageState.page === currentPage;
  return {
    pageData: isCurrentPage ? pageState.data : null,
    isLoading: !isCurrentPage || pageState.isLoading,
    hasLoadError: isCurrentPage && pageState.hasLoadError,
  };
}
