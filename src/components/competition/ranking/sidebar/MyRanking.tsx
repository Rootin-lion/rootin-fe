import type { RankingState } from "@/types/competitions/competition";

export default function MyRanking({
  myRanking,
  isMyPositionDisabled,
  onShowMyPosition,
}: {
  myRanking: RankingState | null;
  isMyPositionDisabled: boolean;
  onShowMyPosition: () => void;
}) {
  return (
    <div className="bg-gradient-primary flex w-full items-center justify-between gap-3 rounded-lg px-4 py-4 md:block">
      <div>
        <h2 className="text-primary-900 text-[14px] font-semibold md:text-[16px]">
          내 랭킹
        </h2>
        <p className="text-title-2 text-gradient-primary w-fit max-md:text-[24px]">
          {myRanking ? `${myRanking.rank}` : 0}위
        </p>
      </div>
      <button
        type="button"
        disabled={isMyPositionDisabled}
        onClick={onShowMyPosition}
        className="text-body-3 text-primary-900 bg-bg-green-100 border-primary-300 ml-auto flex min-h-11 w-24.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border disabled:cursor-default disabled:opacity-50 max-md:text-xs md:mt-2 md:h-7.5 md:min-h-0"
      >
        내 순위 보기
      </button>
    </div>
  );
}
