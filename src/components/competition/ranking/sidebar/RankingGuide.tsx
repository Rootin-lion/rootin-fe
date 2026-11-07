export default function RankingGuide() {
  return (
    <div className="w-full rounded-lg bg-white px-4 py-4">
      <h3 className="text-subtitle text-text max-md:text-[14px]">랭킹 안내</h3>
      <div className="text-body-3 text-sub-text mt-2 flex flex-col gap-3">
        <p>
          점수는 대회에서 획득한 총점
          <br className="hidden lg:block" />
          (정답 수 기준)으로 결정됩니다.
        </p>
        <p>
          동점일 경우, 제출 시간이{" "}
          <span className="text-primary font-medium">빠른 순</span>
          <br className="hidden lg:block" />
          으로 순위가 결정됩니다.
        </p>
      </div>
    </div>
  );
}
