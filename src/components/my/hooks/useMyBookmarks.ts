"use client";

import { useEffect, useState } from "react";
import { getMyBookmarksAction } from "@/app/(service)/my/action";
import type { BookmarkCategory } from "@/constants/my/bookmark";
import type { MyBookmarkItem } from "@/types/my/bookmark";

type BookmarkState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      bookmarks: MyBookmarkItem[];
      totalElements: number;
      pageSize: number;
    };

export default function useMyBookmarks(
  category: BookmarkCategory,
  currentPage: number,
) {
  const [state, setState] = useState<BookmarkState>({ status: "loading" });

  useEffect(() => {
    let ignore = false;

    const loadBookmarks = async () => {
      try {
        const firstPage = await getMyBookmarksAction(1);
        if (ignore) return;
        if (!firstPage.ok) {
          setState({ status: "error" });
          return;
        }

        const bookmarks = [...firstPage.data.content];
        for (let page = 2; page <= firstPage.data.totalPages; page++) {
          const nextPage = await getMyBookmarksAction(page);
          if (ignore) return;
          if (!nextPage.ok) {
            setState({ status: "error" });
            return;
          }
          bookmarks.push(...nextPage.data.content);
        }

        setState({
          status: "ready",
          bookmarks,
          totalElements: firstPage.data.totalElements,
          pageSize: Math.max(firstPage.data.content.length, 1),
        });
      } catch {
        if (!ignore) setState({ status: "error" });
      }
    };

    void loadBookmarks();

    return () => {
      ignore = true;
    };
  }, []);

  const removeBookmark = (problemId: number) => {
    setState((current) => {
      if (current.status !== "ready") return current;
      const bookmarks = current.bookmarks.filter(
        (bookmark) => bookmark.problemId !== problemId,
      );
      if (bookmarks.length === current.bookmarks.length) return current;

      return {
        ...current,
        bookmarks,
        totalElements: Math.max(0, current.totalElements - 1),
      };
    });
  };

  const bookmarks = state.status === "ready" ? state.bookmarks : [];
  const pageSize = state.status === "ready" ? state.pageSize : 1;
  const filteredBookmarks =
    category === "all"
      ? bookmarks
      : bookmarks.filter((bookmark) => bookmark.category === category);
  const totalPages = Math.ceil(filteredBookmarks.length / pageSize);
  const visiblePage = Math.min(currentPage, Math.max(1, totalPages));
  const visibleBookmarks = filteredBookmarks.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  return {
    visibleBookmarks,
    visiblePage,
    totalPages,
    totalElements: state.status === "ready" ? state.totalElements : 0,
    isLoading: state.status === "loading",
    hasLoadError: state.status === "error",
    removeBookmark,
  };
}
