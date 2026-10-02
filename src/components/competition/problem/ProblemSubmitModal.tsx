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
    <ModalWrapper onClose={onClose}>
      <ModalWrapper.Box>
        <ModalWrapper.Title>정말 제출하시겠습니까?</ModalWrapper.Title>
        <ModalWrapper.Content>
          제출 후에는 답안을 수정할 수 없습니다.
        </ModalWrapper.Content>
      </ModalWrapper.Box>
      <ModalWrapper.Box>
        <div className="flex flex-row gap-9">
          <Button onClick={onClose} className="max-h-7.5">
            취소
          </Button>
          <Button isActive={true} className="max-h-7.5" onClick={onSubmit}>
            제출하기
          </Button>
        </div>
      </ModalWrapper.Box>
    </ModalWrapper>
  );
}
