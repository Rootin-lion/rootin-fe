import { BOOKMARK_CATEGORY_OPTIONS } from "@/constants/my/bookmark";
import type { CategoryType } from "@/types/shared/category";

export default function BookmarkTitle({
  category,
  onCategoryChange,
  totalElements,
}: {
  category: CategoryType | "all";
  onCategoryChange: (category: CategoryType | "all") => void;
  totalElements: number;
}) {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-3">
        <h3 className="text-subtitle text-[#1a1a1a]">북마크한 문제</h3>
        <p className="rounded-xl bg-[#E8EDE0] px-3 py-1 text-[11px] font-semibold text-[#4A6E35]">
          총 {totalElements}개
        </p>
      </div>
      <div className="flex flex-row gap-2">
        {BOOKMARK_CATEGORY_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.value}
            onClick={() => onCategoryChange(item.value)}
            className="cursor-pointer rounded-full bg-[linear-gradient(90deg,var(--color-primary-600),var(--color-primary-900))] p-px"
          >
            <div
              className={`${category === item.value ? "bg-primary text-white" : "text-sub-text bg-white"} text-caption rounded-full px-2.5 py-1`}
            >
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
