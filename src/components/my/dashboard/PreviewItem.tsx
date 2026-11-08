import type { BookmarksState, WrongAnswersState } from "@/types/my/dashboard";
import type { CategoryType } from "@/types/shared/category";
import { CATEGORY_LABEL } from "@/constants/shared/category";

export default function PreviewItem({
  type = "bookmark",
  item,
}: {
  type?: string;
  item?: WrongAnswersState | BookmarksState;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[#E1E1E1] px-1.5 py-1 lg:px-2 lg:py-1.5">
      <div className="flex min-w-0 flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-2.5">
        <div
          className={`max-w-full rounded-md px-1.5 py-0.5 text-[9px] font-semibold [overflow-wrap:anywhere] lg:shrink-0 lg:rounded-lg lg:px-2 lg:text-[11px] ${type === "bookmark" ? "text-primary-900 bg-[#EDF2FB]" : "text-error bg-[#FEF1EF]"}`}
        >
          {CATEGORY_LABEL[item?.category as CategoryType] ?? item?.category}
        </div>
        <p className="min-w-0 text-[11px] font-medium [overflow-wrap:anywhere] text-black lg:text-[10px]">
          {item?.title}
        </p>
      </div>
    </div>
  );
}
