import RankingPagination from "./RankingPagination";
import { RankingState } from "@/types/competitions/competition";

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

// const rankProfileStyles : Record<number, string> = {
//   1 : "bg-war"
// }

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

const TableItem = ({ ranking }: { ranking: RankingState }) => {
  const rankBoxStyle = rankBoxStyles[ranking.rank];
  const rankItemStyle = rankItemStyles[ranking.rank];

  return (
    <div
      className={`${rowLayout} ${rankBoxStyle ? `${rankBoxStyle}` : ""} border-b border-[#E1E1E1]`}
    >
      <p
        className={`${rankItemStyle ? `flex h-6.5 w-6.5 shrink-0 items-center justify-center justify-self-center rounded-[50%] ${rankItemStyle}` : ""}`}
      >
        {ranking.rank ?? 0}
      </p>
      <div className="flex -translate-x-6 flex-row items-center justify-center gap-3 py-1.5">
        <div className="h-10 w-10 shrink-0 rounded-[50%] bg-amber-400" />
        <p>{ranking.nickname ?? "-"}</p>
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
  onClick,
}: {
  rankings: RankingState[];
  currentPage: number;
  totalPage: number;
  onClick: (page: number) => void;
}) {
  return (
    <div className="text-body-3 mt-4 w-full rounded-lg bg-white p-5 text-black">
      <TableHeader />
      <div>
        {rankings.map((ranking) => (
          <TableItem key={ranking.rank} ranking={ranking} />
        ))}
      </div>
      <RankingPagination
        currentPage={currentPage}
        totalPage={totalPage}
        onClick={onClick}
      />
    </div>
  );
}
