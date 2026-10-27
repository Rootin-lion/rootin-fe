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
    <div className="bg-gradient-primary w-56 rounded-lg px-4 py-4">
      <div>
        <h2 className="text-primary-900 text-[16px] font-semibold">내 랭킹</h2>
        <p className="text-title-2 text-gradient-primary w-fit">
          {myRanking ? `${myRanking.rank}` : 0}위
        </p>
      </div>
      <button
        type="button"
        disabled={isMyPositionDisabled}
        onClick={onShowMyPosition}
        className="text-body-3 text-primary-900 bg-bg-green-100 border-primary-300 mt-2 ml-auto flex h-7.5 w-24.5 cursor-pointer items-center justify-center rounded-lg border disabled:cursor-default disabled:opacity-50"
      >
        내 순위 보기
      </button>
    </div>
  );
}
