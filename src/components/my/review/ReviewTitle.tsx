export default function ReviewTitle({
  totalElements,
}: {
  totalElements: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
      <h3 className="md:text-subtitle text-[14px] text-[#1a1a1a]">오답 노트</h3>
      <p className="rounded-xl bg-[#FEF3F2] px-2 py-1 text-[10px] font-semibold text-[#DC2626] md:text-[11px]">
        총 {totalElements}개
      </p>
    </div>
  );
}
