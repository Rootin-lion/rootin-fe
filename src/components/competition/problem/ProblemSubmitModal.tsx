import Button from "@/components/shared/Button";
import ModalWrapper from "@/components/shared/ModalWrapper";

export default function ProblemSubmitModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <ModalWrapper onClose={onClose} className="max-md:gap-4 max-md:py-5">
      <ModalWrapper.Box>
        <ModalWrapper.Title className="max-md:text-[14px]">
          정말 제출하시겠습니까?
        </ModalWrapper.Title>
        <ModalWrapper.Content className="max-md:text-[12px]">
          제출 후에는 답안을 수정할 수 없습니다.
        </ModalWrapper.Content>
      </ModalWrapper.Box>
      <ModalWrapper.Box>
        <div className="flex flex-row gap-3 md:gap-9">
          <Button
            onClick={onClose}
            className="max-md:min-h-9 max-md:py-1.5 max-md:text-[12px] md:max-h-7.5"
          >
            취소
          </Button>
          <Button
            isActive={true}
            className="max-md:min-h-9 max-md:py-1.5 max-md:text-[12px] md:max-h-7.5"
            onClick={onSubmit}
          >
            제출하기
          </Button>
        </div>
      </ModalWrapper.Box>
    </ModalWrapper>
  );
}
