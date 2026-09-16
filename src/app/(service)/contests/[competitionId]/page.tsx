"use client";

import useModal from "@/hooks/useModal";
import QuestionSidebar from "@/components/contests/solve/QuestionSidebar";
import QuestionPanel from "@/components/contests/shared/QuestionPanel";
import ModalWrapper from "@/components/shared/ModalWrapper";
import Button from "@/components/shared/Button";

export default function ContestSolvePage() {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <div className="bg-primary-50 min-h-dvh">
      {isModalOpen && (
        <ModalWrapper onClose={closeModal}>
          <ModalWrapper.Box>
            <ModalWrapper.Title>정말 제출하시겠습니까?</ModalWrapper.Title>
            <ModalWrapper.Content>
              제출 후에는 답안을 수정할 수 없습니다.
            </ModalWrapper.Content>
          </ModalWrapper.Box>
          <ModalWrapper.Box>
            <div className="flex flex-row gap-9">
              <Button onClick={closeModal} className="max-h-7.5">
                취소
              </Button>
              <Button isActive={true} className="max-h-7.5">
                제출하기
              </Button>
            </div>
          </ModalWrapper.Box>
        </ModalWrapper>
      )}

      <div className="mx-auto flex w-full max-w-5xl flex-row gap-4 pt-9">
        <QuestionSidebar />
        <QuestionPanel onNext={openModal} />
      </div>
    </div>
  );
}
