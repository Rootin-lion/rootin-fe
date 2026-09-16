"use client";

import BookmarkIcon from "@/assets/bookmark.svg";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import useModal from "@/hooks/useModal";

export default function BookmarkAction({
  selected = false,
}: {
  selected?: boolean;
}) {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      {isModalOpen && (
        <ModalWrapper onClose={closeModal}>
          <ModalWrapper.Box>
            <ModalWrapper.Title>북마크에 저장되었습니다.</ModalWrapper.Title>
          </ModalWrapper.Box>
          <ModalWrapper.Box>
            <div className="mx-auto">
              <Button
                isActive={true}
                className="max-h-7.5 max-w-25"
                onClick={closeModal}
              >
                확인
              </Button>
            </div>
          </ModalWrapper.Box>
        </ModalWrapper>
      )}

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
