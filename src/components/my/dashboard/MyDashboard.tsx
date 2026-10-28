"use client";

import { useEffect, useState } from "react";
import CountIcon from "@/assets/my/dashboard/count.png";
import DayIcon from "@/assets/my/dashboard/day.png";
import PointIcon from "@/assets/my/dashboard/point.png";
import RateIcon from "@/assets/my/dashboard/rate.png";
import type { DashboardData } from "@/types/my/dashboard";
import { getMyDashboardAction } from "@/app/(service)/my/action";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import CategoryAccuracyChart from "./CategoryAccuracyChart";
import DashboardGrass from "./DashboardGrass";
import DashboardProblemPreview from "./DashboardProblemPreview";
import DashboardStatCard from "./DashboardStatCard";
import { MySection } from "../MySidebar";

export default function MyDashboard({
  today,
  onSideChange,
}: {
  today: string;
  onSideChange: (side: MySection) => void;
}) {
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await getMyDashboardAction();

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();

          return;
        }

        setDashboardData(res.data);
      } catch {
        setErrorContext({
          code: "DASHBOARD_FAILED",
          message: "대시보드 조회에 실패했습니다.",
        });
        openModal();
      }
    };

    void getDashboard();
  }, [setErrorContext, openModal]);

  const statItems = [
    {
      key: "solved",
      title: "총 풀이 수",
      value: dashboardData?.totalSolvedCounts || 0,
      img: CountIcon,
      unit: "문제",
    },
    {
      key: "accuracy",
      title: "정답률",
      value: dashboardData?.accuracyRate || 0,
      img: RateIcon,
      unit: "%",
    },
    {
      key: "points",
      title: "포인트",
      value: dashboardData?.points || 0,
      img: PointIcon,
      unit: "P",
    },
    {
      key: "streak",
      title: "연속 학습",
      value: dashboardData?.streakDays || 0,
      img: DayIcon,
      unit: "일",
    },
  ];

  const activityByDate: Record<string, number> = Object.fromEntries(
    dashboardData?.dailyActivities?.map(({ date, totalCount }) => [
      date,
      totalCount,
    ]) ?? [],
  );

  return (
    <div className="flex flex-col gap-4.5">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="flex flex-row justify-between">
        {statItems.map((stat) => (
          <DashboardStatCard key={stat.key} stat={stat} />
        ))}
      </div>
      <div className="flex flex-row justify-between">
        <DashboardGrass today={today} activityByDate={activityByDate} />
        <CategoryAccuracyChart
          categoryAccuracies={dashboardData?.categoryAccuracies}
        />
      </div>
      <DashboardProblemPreview
        bookmarks={dashboardData?.bookmarks ?? []}
        reviews={dashboardData?.wrongAnswers ?? []}
        onSideChange={onSideChange}
      />
    </div>
  );
}
