"use client";

import BookmarkIcon from "@/assets/bookmark.svg";
import useModal from "@/hooks/useModal";
import BookmarkModal from "./BookmarkModal";

export default function BookmarkAction({
  isBookmarked,
  onClick,
}: {
  isBookmarked: boolean;
  onClick: () => Promise<boolean>;
}) {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      {isModalOpen && <BookmarkModal onClose={closeModal} />}

      <div
        onClick={async () => {
          const added = await onClick();
          if (added) openModal();
        }}
        className="cursor-pointer"
      >
        <BookmarkIcon
          className={`h-6 w-6 shrink-0 ${isBookmarked ? "text-primary fill-primary" : "text-disabled-text"}`}
          role="img"
          aria-label="북마크"
        />
      </div>
    </>
  );
}
