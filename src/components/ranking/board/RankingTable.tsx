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

const TableItem = ({ rank }: { rank: number }) => {
  const rankBoxStyle = rankBoxStyles[rank];
  const rankItemStyle = rankItemStyles[rank];

  return (
    <div
      className={`${rowLayout} ${rankBoxStyle ? `${rankBoxStyle}` : ""} border-b border-[#E1E1E1]`}
    >
      <p
        className={`${rankItemStyle ? `flex h-6.5 w-6.5 shrink-0 items-center justify-center justify-self-center rounded-[50%] ${rankItemStyle}` : ""}`}
      >
        {rank}
      </p>
      <div className="flex -translate-x-6 flex-row items-center justify-center gap-3 py-1.5">
        <div className="h-10 w-10 shrink-0 rounded-[50%] bg-amber-400" />
        <p>닉네임</p>
      </div>
      <p>1254점</p>
      <p>8P</p>
    </div>
  );
};

export default function RankingTable() {
  return (
    <div className="text-body-3 mt-4 w-full rounded-lg bg-white p-5 text-black">
      <TableHeader />
      <div>
        <TableItem rank={1} />
        <TableItem rank={2} />
        <TableItem rank={3} />
        <TableItem rank={4} />
        <TableItem rank={5} />
        <TableItem rank={6} />
        <TableItem rank={7} />
      </div>
    </div>
  );
}
