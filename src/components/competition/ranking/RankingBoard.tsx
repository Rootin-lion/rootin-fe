"use client";

import { RankingState } from "@/types/competitions/competition";
import { RankingPeriod, RankingViewState } from "@/types/competitions/ranking";
import RankingTable from "./board/RankingTable";

const RankingTabs = ({
  period,
  onClick,
}: {
  period: RankingPeriod;
  onClick: (period: RankingPeriod) => void;
}) => {
  return (
    <div className="flex h-11 w-full flex-row items-center rounded-lg bg-white px-2">
      <TabItem isActive={period === "DAILY"} onClick={() => onClick("DAILY")}>
        일간(실시간)
      </TabItem>
      <TabItem isActive={period === "WEEKLY"} onClick={() => onClick("WEEKLY")}>
        주 간
      </TabItem>
      <TabItem
        isActive={period === "MONTHLY"}
        onClick={() => onClick("MONTHLY")}
      >
        월 간
      </TabItem>
    </div>
  );
};

const TabItem = ({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => {
  const TabStyle = isActive
    ? "banner-gradient-border text-primary-900 bg-bg-green-50 rounded-lg text-[14px] font-medium "
    : "text-text text-body-3";

  return (
    <button
      type="button"
      className={`${TabStyle} h-8 w-37.5 cursor-pointer transition-colors duration-300 ease-out`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function RankingBoard({
  rankings,
  rankingView,
  totalPage,
  onPeriodChange,
  onPageChange,
}: {
  rankings: RankingState[];
  rankingView: RankingViewState;
  totalPage: number;
  onPeriodChange: (period: RankingPeriod) => void;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="w-full">
      <RankingTabs period={rankingView.period} onClick={onPeriodChange} />
      <RankingTable
        rankings={rankings}
        currentPage={rankingView.page}
        totalPage={totalPage}
        onClick={onPageChange}
      />
    </div>
  );
}
