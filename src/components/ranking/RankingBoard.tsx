"use client";

import { TabType } from "@/types/ranking/ranking";
import { useState } from "react";
import RankingTable from "./board/RankingTable";

const RankingTabs = ({
  tab,
  onClick,
}: {
  tab: TabType;
  onClick: (tab: TabType) => void;
}) => {
  return (
    <div className="flex h-11 w-full flex-row items-center rounded-lg bg-white px-2">
      <TabItem isActive={tab === "DAILY"} onClick={() => onClick("DAILY")}>
        일간(실시간)
      </TabItem>
      <TabItem isActive={tab === "WEEKLY"} onClick={() => onClick("WEEKLY")}>
        주 간
      </TabItem>
      <TabItem isActive={tab === "MONTHLY"} onClick={() => onClick("MONTHLY")}>
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

export default function RankingBoard() {
  const [tab, setTab] = useState<TabType>("DAILY");

  const handleTabChange = (tab: TabType) => {
    setTab(tab);
  };

  return (
    <div className="w-full">
      <RankingTabs tab={tab} onClick={handleTabChange} />
      <RankingTable />
    </div>
  );
}
