import { BOOKMARK_CATEGORY_OPTIONS } from "@/constants/my/bookmark";
import type { BookmarkCategory } from "@/constants/my/bookmark";

export default function BookmarkTitle({
  category,
  onCategoryChange,
  totalElements,
}: {
  category: BookmarkCategory;
  onCategoryChange: (category: BookmarkCategory) => void;
  totalElements: number;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <h3 className="md:text-subtitle text-[14px] text-[#1a1a1a]">
          북마크한 문제
        </h3>
        <p className="rounded-xl bg-[#E8EDE0] px-2 py-1 text-[10px] font-semibold text-[#4A6E35] md:px-3 md:text-[11px]">
          총 {totalElements}개
        </p>
      </div>
      <div
        className="flex flex-wrap gap-1.5 md:gap-2"
        role="group"
        aria-label="북마크 카테고리"
      >
        {BOOKMARK_CATEGORY_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.value}
            onClick={() => onCategoryChange(item.value)}
            className="focus-visible:outline-primary cursor-pointer rounded-full bg-[linear-gradient(90deg,var(--color-primary-600),var(--color-primary-900))] p-px focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div
              className={`${category === item.value ? "bg-primary text-white" : "text-sub-text bg-white"} md:text-caption flex min-h-6.5 items-center rounded-full px-2.5 text-[10px] md:min-h-0 md:px-2.5 md:py-1`}
            >
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
