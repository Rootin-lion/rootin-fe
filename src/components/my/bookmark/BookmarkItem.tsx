import Link from "next/link";
import BookmarkIcon from "@/assets/icons/shared/bookmark.svg";
import { CATEGORY_LABEL } from "@/constants/shared/category";
import { formatDottedDate } from "@/lib/shared/formatDottedDate";
import type { MyBookmarkItem } from "@/types/my/bookmark";
import ProblemCategory from "../shared/ProblemCategory";
import ProblemDate from "../shared/ProblemDate";
import ProblemText from "../shared/ProblemText";

export default function BookmarkItem({
  item,
  onRemove,
  disabled,
}: {
  item: MyBookmarkItem;
  onRemove: (problemId: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative w-full min-w-0 rounded-xl border border-[#E1E1E1] bg-white p-2.5 md:px-4 md:py-6">
      <button
        type="button"
        aria-label={`${item.title} 북마크 해제`}
        disabled={disabled}
        onClick={() => onRemove(item.problemId)}
        className="focus-visible:outline-primary absolute top-1 left-1 flex size-11 cursor-pointer items-center justify-center focus-visible:rounded-sm focus-visible:outline-2 disabled:cursor-wait md:top-6 md:left-4 md:size-6"
      >
        <BookmarkIcon
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="fill-primary text-primary size-5 md:size-6"
        />
      </button>
      <Link
        href={`/my/bookmarks/${item.competitionId}/${item.competitionProblemId}`}
        className="focus-visible:outline-primary flex min-w-0 flex-col items-start gap-1 rounded-sm pl-9 focus-visible:outline-2 md:flex-row md:items-center md:justify-between md:gap-0"
      >
        <div className="flex min-w-0 flex-col gap-1 md:gap-2">
          <ProblemCategory
            label={CATEGORY_LABEL[item.category] ?? item.category}
            className="bg-[#EDF2FB] max-md:text-[10px]"
          />
          <ProblemText
            className="max-md:gap-1"
            title={item.title}
            description={item.problemContent}
            titleClassName="[overflow-wrap:anywhere] max-md:text-[13px]"
            descriptionClassName="text-black leading-relaxed [overflow-wrap:anywhere]"
          />
        </div>
        <div className="shrink-0 md:ml-4">
          <ProblemDate date={formatDottedDate(item.participationDate)} />
        </div>
      </Link>
    </div>
  );
}
