import Link from "next/link";
import BookmarkIcon from "@/assets/icon/shared/bookmark.svg";
import { CATEGORY_LABEL } from "@/constants/shared/category";
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
    <div className="relative w-full rounded-xl border border-[#E1E1E1] bg-white px-4 py-6">
      <button
        type="button"
        aria-label={`${item.title} 북마크 해제`}
        disabled={disabled}
        onClick={() => onRemove(item.problemId)}
        className="focus-visible:outline-primary absolute top-6 left-4 h-6 w-6 cursor-pointer focus-visible:rounded-sm focus-visible:outline-2 disabled:cursor-wait"
      >
        <BookmarkIcon
          aria-hidden="true"
          className="fill-primary text-primary h-full w-full"
        />
      </button>
      <Link
        href={`/my/bookmarks/${item.competitionId}/${item.competitionProblemId}`}
        className="focus-visible:outline-primary flex flex-row items-center justify-between rounded-sm pl-9 focus-visible:outline-2"
      >
        <div className="flex min-w-0 flex-col gap-2">
          <ProblemCategory
            label={CATEGORY_LABEL[item.category] ?? item.category}
            className="bg-[#EDF2FB]"
          />
          <ProblemText
            title={item.title}
            description={item.problemContent}
            descriptionClassName="text-black"
          />
        </div>
        <div className="ml-4 shrink-0">
          <ProblemDate date={item.participationDate.replaceAll("-", ".")} />
        </div>
      </Link>
    </div>
  );
}
