import { apiClient } from "./client";
import type { MyReportsPage } from "@/types/my/report";

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
