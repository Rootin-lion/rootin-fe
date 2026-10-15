import ChevronRightIcon from "@/assets/my/dashboard/chevron-right.svg";
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
    <div className="flex cursor-pointer flex-row items-center justify-between rounded-lg border border-[#E1E1E1] px-2 py-1.5">
      <div className="flex flex-row items-center gap-2.5">
        <div
          className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${type === "bookmark" ? "text-primary-900 bg-[#EDF2FB]" : "text-error bg-[#FEF1EF]"}`}
        >
          {CATEGORY_LABEL[item?.category as CategoryType] ?? item?.category}
        </div>
        <p className="text-[10px] font-medium text-black">{item?.title}</p>
      </div>
      <ChevronRightIcon className="text-text ml-2 h-3 w-2.5 shrink-0" />
    </div>
  );
}
