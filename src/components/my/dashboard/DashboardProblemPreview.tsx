import type { BookmarksState, WrongAnswersState } from "@/types/my/dashboard";
import BookmarkPreview from "./BookmarkPreview";
import ReviewPreview from "./ReviewPreview";

export default function DashboardProblemPreview({
  bookmarks,
  reviews,
}: {
  bookmarks: BookmarksState[];
  reviews: WrongAnswersState[];
}) {
  return (
    <div className="border-primary-200 flex flex-col gap-5 rounded-[14px] border px-6 pt-4 pb-7">
      <p className="pl-2 text-[14px] font-semibold text-[#1a1a1a]">
        나의 문제들
      </p>
      <div className="flex flex-row justify-between">
        <BookmarkPreview bookmarks={bookmarks} />
        <ReviewPreview reviews={reviews} />
      </div>
    </div>
  );
}
