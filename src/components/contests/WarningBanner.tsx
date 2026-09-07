export default function WarningBanner() {
  return (
    <div className="rounded-lg border border-[#F0F0F030] bg-[#F0F0F0] px-6 py-4">
      <p className="text-text text-[15px] font-medium">대회 참여 안내</p>
      <p className="text-sub-text mt-1 ml-4 text-[13px] font-normal">
        대회는 매일 정오에 자동으로 생성되며 참여 후 제한 시간이 초과되면
        자동으로 제출됩니다. 또한 대회 결과는 실시간 랭킹에 반영되며 정답률에
        따라 포인트가 지급됩니다.
      </p>
    </div>
  );
}
