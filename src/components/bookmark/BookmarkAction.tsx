"use client";

import BookmarkIcon from "@/assets/icons/shared/bookmark.svg";
import useModal from "@/hooks/useModal";
import BookmarkModal from "./BookmarkModal";

export default function BookmarkAction({
  isBookmarked,
  onClick,
  className = "",
}: {
  isBookmarked: boolean;
  onClick: () => Promise<boolean>;
  className?: string;
}) {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      {isModalOpen && <BookmarkModal onClose={closeModal} />}

      <button
        type="button"
        aria-label={isBookmarked ? "북마크 해제" : "북마크 저장"}
        aria-pressed={isBookmarked}
        onClick={async () => {
          const added = await onClick();
          if (added) openModal();
        }}
        className={`focus-visible:outline-primary-900 shrink-0 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      >
        <BookmarkIcon
          className={`h-6 w-6 shrink-0 ${isBookmarked ? "text-primary fill-primary" : "text-disabled-text"}`}
        />
      </button>
    </>
  );
}
