"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BarPagination from "@/components/shared/BarPagination";
import { removeProblemBookmarkAction } from "@/components/bookmark/action";
import ErrorModal from "@/components/shared/ErrorModal";
import { getMyListHref } from "@/constants/my/navigation";
import type { BookmarkCategory } from "@/constants/my/bookmark";
import useErrorModal from "@/hooks/useErrorModal";
import BookmarkItem from "./BookmarkItem";
import BookmarkTitle from "./BookmarkTitle";
import useMyBookmarks from "./useMyBookmarks";

export default function MyBookmark({
  category,
  currentPage,
}: {
  category: BookmarkCategory;
  currentPage: number;
}) {
  const router = useRouter();
  const {
    visibleBookmarks,
    visiblePage,
    totalPages,
    totalElements,
    isLoading,
    hasLoadError,
    removeBookmark,
  } = useMyBookmarks(category, currentPage);
  const [removingProblemId, setRemovingProblemId] = useState<number | null>(
    null,
  );
  const isRemovingRef = useRef(false);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  const handleCategoryChange = (nextCategory: BookmarkCategory) => {
    router.push(getMyListHref("bookmark", 1, nextCategory), { scroll: false });
  };

  const handleRemoveBookmark = async (problemId: number) => {
    if (isRemovingRef.current) return;
    isRemovingRef.current = true;
    setRemovingProblemId(problemId);

    try {
      const result = await removeProblemBookmarkAction(problemId);
      if (!result.ok) {
        setErrorContext(result.error);
        openModal();
        return;
      }

      removeBookmark(problemId);
    } catch {
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "북마크 해제에 실패했습니다.",
      });
      openModal();
    } finally {
      isRemovingRef.current = false;
      setRemovingProblemId(null);
    }
  };

  useEffect(() => {
    if (!isLoading && !hasLoadError && currentPage !== visiblePage) {
      router.replace(getMyListHref("bookmark", visiblePage, category), {
        scroll: false,
      });
    }
  }, [category, currentPage, hasLoadError, isLoading, router, visiblePage]);

  return (
    <div>
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}
      <BookmarkTitle
        category={category}
        onCategoryChange={handleCategoryChange}
        totalElements={totalElements}
      />
      <div className="mt-9 flex flex-col gap-6">
        {isLoading ? (
          <p className="text-sub-text mt-12 text-center text-sm" role="status">
            북마크를 불러오는 중입니다.
          </p>
        ) : hasLoadError ? (
          <p className="text-sub-text mt-12 text-center text-sm">
            북마크를 불러오지 못했습니다.
          </p>
        ) : visibleBookmarks.length ? (
          visibleBookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.problemId}
              item={bookmark}
              onRemove={handleRemoveBookmark}
              disabled={removingProblemId !== null}
            />
          ))
        ) : (
          <p className="text-sub-text mt-12 text-center text-sm">
            {category === "all"
              ? "아직 북마크한 문제가 없습니다."
              : "선택한 카테고리에 북마크한 문제가 없습니다."}
          </p>
        )}
      </div>
      {!isLoading && !hasLoadError && (
        <BarPagination
          currentPage={visiblePage}
          totalPages={totalPages}
          onPageChange={(page) =>
            router.push(getMyListHref("bookmark", page, category), {
              scroll: false,
            })
          }
          className="mt-20"
        />
      )}
    </div>
  );
}
