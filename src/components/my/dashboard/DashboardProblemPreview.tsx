import type { MySection } from "@/constants/my/navigation";
import type { BookmarksState, WrongAnswersState } from "@/types/my/dashboard";
import BookmarkPreview from "./BookmarkPreview";
import ReviewPreview from "./ReviewPreview";

export default function DashboardProblemPreview({
  bookmarks,
  reviews,
  onSideChange,
}: {
  bookmarks: BookmarksState[];
  reviews: WrongAnswersState[];
  onSideChange: (side: MySection) => void;
}) {
  return (
    <div className="border-primary-200 flex min-w-0 flex-col gap-3 rounded-[14px] border p-3 lg:gap-5 lg:px-6 lg:pt-4 lg:pb-7">
      <p className="text-[14px] font-semibold text-[#1a1a1a] lg:pl-2">
        나의 문제들
      </p>
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:justify-between lg:gap-6">
        <BookmarkPreview bookmarks={bookmarks} onSideChange={onSideChange} />
        <ReviewPreview reviews={reviews} onSideChange={onSideChange} />
      </div>
    </div>
  );
}
