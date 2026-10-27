"use client";

import { useEffect, useRef } from "react";
import type { Ref } from "react";
import Image from "next/image";
import CharImg from "@/assets/success_char.png";
import type { RankingState } from "@/types/competitions/competition";
import type { RankingFocusTarget } from "@/types/competitions/ranking";
import RankingPagination from "./RankingPagination";

const rowLayout =
  "grid grid-cols-[80px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-4 px-5 text-center";

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
      className={`${rowLayout} rounded-t-lg border border-[#E1E1E1] bg-[#F0F0F0] px-5 py-3`}
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
}: {
  ranking: RankingState;
  rowRef?: Ref<HTMLDivElement>;
}) => {
  const rankBoxStyle = rankBoxStyles[ranking.rank] ?? "bg-white";
  const rankItemStyle = rankItemStyles[ranking.rank];
  const rankProfileStyle = rankProfileStyles[ranking.rank] ?? "bg-primary-200";
  const profileImageUrl = ranking.imgUrl?.trim();

  return (
    <div
      ref={rowRef}
      className={`${rowLayout} ${rankBoxStyle} border-b border-[#E1E1E1]`}
    >
      <p
        className={`${rankItemStyle ? `flex h-6.5 w-6.5 shrink-0 items-center justify-center justify-self-center rounded-[50%] ${rankItemStyle}` : ""}`}
      >
        {ranking.rank ?? 0}
      </p>
      <div className="flex w-full max-w-48 -translate-x-3 items-center gap-3 justify-self-center py-1.5 text-left">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${rankProfileStyle}`}
        >
          <Image
            src={profileImageUrl || CharImg}
            alt=""
            width={40}
            height={40}
            unoptimized={Boolean(profileImageUrl)}
            className={
              profileImageUrl
                ? "h-full w-full object-cover"
                : "h-8 w-8 object-contain"
            }
          />
        </div>
        <p className="min-w-0 truncate">{ranking.nickname ?? "-"}</p>
      </div>
      <p>{ranking.score ?? 0}점</p>
      <p>8P</p>
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
    <div className="text-body-3 mt-4 w-full rounded-lg bg-white p-5 text-black">
      <TableHeader />
      <div>
        {rankings.map((ranking) => {
          const isTarget = focusTarget?.memberId === ranking.memberId;

          return (
            <TableItem
              key={ranking.memberId}
              ranking={ranking}
              rowRef={isTarget ? targetRowRef : undefined}
            />
          );
        })}
      </div>
      <RankingPagination
        currentPage={currentPage}
        totalPage={totalPage}
        onClick={onClick}
      />
    </div>
  );
}
