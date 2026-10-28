import BookmarkIcon from "@/assets/icon/shared/bookmark.svg";
import type { BookmarksState } from "@/types/my/dashboard";
import type { MySection } from "../MySidebar";
import PreviewSection from "./PreviewSection";

export default function BookmarkPreview({
  bookmarks,
  onSideChange,
}: {
  bookmarks: BookmarksState[];
  onSideChange: (side: MySection) => void;
}) {
  return (
    <PreviewSection
      type="bookmark"
      title="북마크한 문제"
      icon={<BookmarkIcon className="h-6 w-6" />}
      titleClassName="text-primary"
      emptyMessage="북마크가 없습니다."
      items={bookmarks}
      onSideChange={onSideChange}
    />
  );
}
