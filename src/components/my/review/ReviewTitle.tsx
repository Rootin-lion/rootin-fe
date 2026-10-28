export default function ReviewTitle({
  totalElements,
}: {
  totalElements: number;
}) {
  return (
    <div className="flex flex-row gap-2">
      <h3 className="text-subtitle text-[#1a1a1a]">오답 노트</h3>
      <p className="rounded-xl bg-[#FEF3F2] px-2 py-1 text-[11px] font-semibold text-[#DC2626]">
        총 {totalElements}개
      </p>
    </div>
  );
}
