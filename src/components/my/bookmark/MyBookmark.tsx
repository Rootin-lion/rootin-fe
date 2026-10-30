"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyBookmarksAction } from "@/app/(service)/my/action";
import BarPagination from "@/components/shared/BarPagination";
import { removeProblemBookmarkAction } from "@/components/bookmark/action";
import ErrorModal from "@/components/shared/ErrorModal";
import { getMyListHref } from "@/constants/my/navigation";
import type { BookmarkCategory } from "@/constants/my/bookmark";
import useErrorModal from "@/hooks/useErrorModal";
import type { MyBookmarkItem } from "@/types/my/bookmark";
import BookmarkItem from "./BookmarkItem";
import BookmarkTitle from "./BookmarkTitle";

export default function MyBookmark({
  category,
  currentPage,
}: {
  category: BookmarkCategory;
  currentPage: number;
}) {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<MyBookmarkItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [removingProblemId, setRemovingProblemId] = useState<number | null>(
    null,
  );
  const isRemovingRef = useRef(false);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  useEffect(() => {
    let ignore = false;

    const loadBookmarks = async () => {
      try {
        const firstPage = await getMyBookmarksAction(1);
        if (ignore) return;
        if (!firstPage.ok) {
          setHasLoadError(true);
          return;
        }

        const allBookmarks = [...firstPage.data.content];
        for (let page = 2; page <= firstPage.data.totalPages; page++) {
          const nextPage = await getMyBookmarksAction(page);
          if (ignore) return;
          if (!nextPage.ok) {
            setHasLoadError(true);
            return;
          }
          allBookmarks.push(...nextPage.data.content);
        }

        setBookmarks(allBookmarks);
        setTotalElements(firstPage.data.totalElements);
        setPageSize(Math.max(firstPage.data.content.length, 1));
      } catch {
        if (!ignore) setHasLoadError(true);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    void loadBookmarks();

    return () => {
      ignore = true;
    };
  }, []);

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

      setBookmarks((current) =>
        current.filter((bookmark) => bookmark.problemId !== problemId),
      );
      setTotalElements((current) => Math.max(0, current - 1));
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

  const filteredBookmarks =
    category === "all"
      ? bookmarks
      : bookmarks.filter((bookmark) => bookmark.category === category);
  const filteredTotalPages = Math.ceil(filteredBookmarks.length / pageSize);
  const visiblePage = Math.min(currentPage, Math.max(1, filteredTotalPages));

  useEffect(() => {
    if (!isLoading && !hasLoadError && currentPage !== visiblePage) {
      router.replace(getMyListHref("bookmark", visiblePage, category), {
        scroll: false,
      });
    }
  }, [category, currentPage, hasLoadError, isLoading, router, visiblePage]);

  const visibleBookmarks = filteredBookmarks.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

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
          totalPages={filteredTotalPages}
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
