import Button from "@/components/shared/Button";
import ModalWrapper from "@/components/shared/ModalWrapper";

export default function BookmarkModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalWrapper onClose={onClose}>
      <ModalWrapper.Box>
        <ModalWrapper.Title>북마크에 저장되었습니다.</ModalWrapper.Title>
      </ModalWrapper.Box>
      <ModalWrapper.Box>
        <div className="mx-auto">
          <Button
            isActive={true}
            className="max-h-7.5 max-w-25"
            onClick={onClose}
          >
            확인
          </Button>
        </div>
      </ModalWrapper.Box>
    </ModalWrapper>
  );
}
