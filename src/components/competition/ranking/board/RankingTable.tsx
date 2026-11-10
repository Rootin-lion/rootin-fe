"use client";

import { useEffect, useRef } from "react";
import type { Ref } from "react";
import Image from "next/image";
import CharImg from "@/assets/images/shared/success_char.png";
import type { RankingState } from "@/types/competitions/competition";
import type { RankingFocusTarget } from "@/types/competitions/ranking";
import RankingPagination from "./RankingPagination";

const rowLayout =
  "grid grid-cols-[36px_minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] items-center gap-x-2 px-2 text-center md:grid-cols-[40px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] md:px-3 lg:grid-cols-[80px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-4 lg:px-5";
const rankBadgeLayout =
  "flex h-6.5 w-6.5 shrink-0 items-center justify-center justify-self-center rounded-[50%]";

const rankBoxStyles: Record<number, string> = {
  1: "bg-[#FFFCF5]",
  2: "bg-[#F2F2F1]",
  3: "bg-[#FCF9F6]",
};

const rankItemStyles: Record<number, string> = {
  1: "border-[#F6D14C] bg-[#FDE581] border-2",
  2: "border-[#B8BABE] bg-[#DEDEE0] border-2",
  3: "border-[#D58C47] bg-[#F7CB9A] border-2",
};

const rankProfileStyles: Record<number, string> = {
  1: "bg-[rgba(255,184,77,0.3)]",
  2: "bg-[rgba(156,163,175,0.3)]",
  3: "bg-[rgba(168,125,125,0.3)]",
};

const TableHeader = () => {
  return (
    <div
      className={`${rowLayout} rounded-t-lg border border-[#E1E1E1] bg-[#F0F0F0] py-2 md:py-3`}
    >
      <p>순위</p>
      <p>닉네임</p>
      <p>점수</p>
      <p>포인트</p>
    </div>
  );
};

const TableItem = ({
  ranking,
  rowRef,
  isTarget,
}: {
  ranking: RankingState;
  rowRef?: Ref<HTMLDivElement>;
  isTarget: boolean;
}) => {
  const rankBoxStyle = isTarget
    ? "bg-bg-green-200 text-primary-900 font-medium"
    : (rankBoxStyles[ranking.rank] ?? "bg-white");
  const rankItemStyle = rankItemStyles[ranking.rank];
  const rankProfileStyle = rankProfileStyles[ranking.rank] ?? "bg-primary-200";
  const profileImageUrl = ranking.imgUrl?.trim();
  const rankBadgeClassName = rankItemStyle
    ? `${rankBadgeLayout} ${rankItemStyle}`
    : undefined;

  return (
    <div
      ref={rowRef}
      className={`${rowLayout} ${rankBoxStyle} border-b border-[#E1E1E1] py-2 md:py-0`}
    >
      <p className={rankBadgeClassName}>{ranking.rank ?? 0}</p>
      <div className="flex w-full min-w-0 items-center gap-1.5 py-1.5 text-left md:max-w-48 md:gap-2 md:justify-self-center lg:-translate-x-3 lg:gap-3">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full md:h-10 md:w-10 ${rankProfileStyle}`}
        >
          <Image
            src={profileImageUrl || CharImg}
            alt=""
            width={32}
            height={32}
            unoptimized={Boolean(profileImageUrl)}
            className={
              profileImageUrl
                ? "h-6 w-6 rounded-full object-cover md:h-8 md:w-8"
                : "h-6 w-6 object-contain md:h-8 md:w-8"
            }
          />
        </div>
        <p className="min-w-0 truncate" title={ranking.nickname ?? "-"}>
          {ranking.nickname ?? "-"}
        </p>
      </div>
      <p className="min-w-0 break-all">{ranking.score ?? 0}점</p>
      <p className="min-w-0 break-all">{ranking.point ?? 0}P</p>
    </div>
  );
};

export default function RankingTable({
  rankings,
  currentPage,
  totalPage,
  focusTarget,
  onClick,
}: {
  rankings: RankingState[];
  currentPage: number;
  totalPage: number;
  focusTarget: RankingFocusTarget | null;
  onClick: (page: number) => void;
}) {
  const targetRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !focusTarget ||
      !rankings.some((ranking) => ranking.memberId === focusTarget.memberId)
    ) {
      return;
    }

    targetRowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusTarget, rankings]);

  return (
    <div className="text-body-3 mt-4 min-h-40 w-full rounded-lg bg-white p-2 text-black max-md:text-xs md:p-3 lg:p-5">
      <TableHeader />
      <div>
        {rankings.map((ranking) => {
          const isTarget = focusTarget?.memberId === ranking.memberId;

          return (
            <TableItem
              key={ranking.memberId}
              ranking={ranking}
              rowRef={isTarget ? targetRowRef : undefined}
              isTarget={isTarget}
            />
          );
        })}
      </div>
      {rankings.length > 0 && (
        <RankingPagination
          currentPage={currentPage}
          totalPage={totalPage}
          onClick={onClick}
        />
      )}
    </div>
  );
}
