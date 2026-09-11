export default function MyRanking() {
  return (
    <div className="w-50 rounded-lg bg-[radial-gradient(100%_100%_at_0%_50%,#EEF3E7_0%,#E4EFE0_50%,#DAEBD9_100%)] px-3 py-4">
      <div>
        <h3 className="text-primary-900 text-[16px] font-semibold">내 랭킹</h3>
        <h1 className="text-title-2 text-gradient-primary w-fit">13위</h1>
      </div>
      <div className="text-body-3 text-primary-900 bg-bg-green-100 border-primary-300 mt-2 flex h-7.5 w-24.5 flex-1 items-center justify-center rounded-lg border">
        내 위치 보기
      </div>
    </div>
  );
}
