"use client";

import BookmarkIcon from "@/assets/bookmark.svg";
import useModal from "@/hooks/useModal";
import BookmarkModal from "./BookmarkModal";

export default function BookmarkAction({
  selected = false,
}: {
  selected?: boolean;
}) {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      {isModalOpen && <BookmarkModal onClose={closeModal} />}

      <div onClick={openModal} className="cursor-pointer">
        <BookmarkIcon
          className="text-disabled-text h-6 w-6 shrink-0"
          role="img"
          aria-label="북마크"
        />
      </div>
    </>
  );
}
