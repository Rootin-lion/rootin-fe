import RefreshIcon from "@/assets/ranking/refresh.svg";

const formatUpdatedAt = (date: Date) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(date)
    .replaceAll("-", ".");

const RefreshButton = ({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={onClick}
      className="text-body-3 text-text flex cursor-pointer flex-row items-center gap-1 rounded-[5px] border border-[#F0F0F0] bg-white px-2 py-1 disabled:cursor-default disabled:opacity-50"
    >
      <RefreshIcon />
      새로고침
    </button>
  );
};

export default function RankingTitleSection({
  lastUpdatedAt,
  isLoading,
  onRefresh,
}: {
  lastUpdatedAt: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col justify-between">
        <h1 className="text-title-2 text-primary-900">전체 랭킹</h1>
        <p className="text-body-3 text-sub-text">
          대회에 참여한 모든 유저의 실시간 랭킹을 확인해보세요.
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="text-body-3 text-sub-text">마지막 업데이트</p>
        <p className="text-body-3 text-primary-900" aria-live="polite">
          {lastUpdatedAt ? formatUpdatedAt(lastUpdatedAt) : "0000.00.00 00:00"}
        </p>
        <RefreshButton isLoading={isLoading} onClick={onRefresh} />
      </div>
    </div>
  );
}
