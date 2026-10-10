import BookmarkIcon from "@/assets/bookmark.svg";
import PreviewItem from "./PreviewItem";
import { BookmarksState } from "@/types/my/dashboard";

export default function BookmarkPreview({
  bookmarks,
}: {
  bookmarks: BookmarksState[];
}) {
  return (
    <div className="w-full max-w-98.75 rounded-lg bg-green-50 p-2.5">
      <div className="flex flex-row items-center justify-between">
        <div className="text-primary flex flex-row gap-2">
          <BookmarkIcon className="h-6 w-6" />
          <p className="text-[14px] font-semibold">북마크한 문제</p>
        </div>
        <p className="text-sub-text cursor-pointer text-[10px] font-medium">
          더보기
        </p>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <PreviewItem key={bookmark.problemId} item={bookmark} />
          ))
        ) : (
          <p className="text-sub-text rounded-lg border border-[#E1E1E1] py-5 text-center text-xs font-medium">
            북마크가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
