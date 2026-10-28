import type { MyBookmarksResponse } from "@/types/my/bookmark";
import type { MyReportsPage } from "@/types/my/report";
import type { MyReviewsPage } from "@/types/my/review";
import { apiClient } from "./client";

// 대시보드
export const getMyDashboard = async () => {
  const res = await apiClient.get("/mypage/dashboard");

  return res;
};

// 리포트
export const getMyReports = async (page: number) => {
  const res = await apiClient.get<{ data: MyReportsPage }>("/mypage/reports", {
    params: {
      page,
    },
  });

  return res;
};

// 오답 노트
export const getMyReviews = async (page: number) => {
  return apiClient.get<{ data: MyReviewsPage }>("/mypage/errornotes", {
    params: { page },
  });
};

// 북마크
export const getMyBookmarks = async (page: number) => {
  const res = await apiClient.get<MyBookmarksResponse>("/mypage/bookmarks", {
    params: {
      page,
    },
  });

  return res;
};
