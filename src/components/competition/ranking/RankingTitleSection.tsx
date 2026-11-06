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
      className="text-body-3 text-text flex min-h-8 shrink-0 cursor-pointer flex-row items-center gap-1 rounded-[5px] border border-[#F0F0F0] bg-white px-1.5 py-1 disabled:cursor-default disabled:opacity-50 max-md:text-[11px] md:min-h-0 md:px-2"
    >
      <RefreshIcon
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 shrink-0 md:h-6 md:w-6"
        aria-hidden="true"
      />
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
    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
      <div className="flex min-w-0 flex-col justify-between gap-2">
        <h1 className="text-title-2 text-primary-900 max-md:text-[24px]">
          전체 랭킹
        </h1>
        <p className="text-body-3 text-sub-text break-keep max-md:text-xs">
          대회에 참여한 모든 유저의 실시간 랭킹을 확인해보세요.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:shrink-0 md:flex-col md:items-end md:gap-1">
        <p className="text-body-3 text-sub-text break-keep max-md:text-xs">
          마지막 업데이트
        </p>
        <p
          className="text-body-3 text-primary-900 max-md:text-xs"
          aria-live="polite"
        >
          {lastUpdatedAt ? formatUpdatedAt(lastUpdatedAt) : "0000.00.00 00:00"}
        </p>
        <RefreshButton isLoading={isLoading} onClick={onRefresh} />
      </div>
    </div>
  );
}
