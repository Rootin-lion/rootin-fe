import Button from "./Button";
import ModalWrapper from "./ModalWrapper";

export default function ErrorModal({
  code,
  message,
  onClose,
}: {
  code: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <ModalWrapper onClose={onClose}>
      <ModalWrapper.Box>
        <ModalWrapper.Title>{code}</ModalWrapper.Title>
        <ModalWrapper.Content>{message}</ModalWrapper.Content>
      </ModalWrapper.Box>
      <ModalWrapper.Box>
        <Button isActive={true} onClick={onClose}>
          닫기
        </Button>
      </ModalWrapper.Box>
    </ModalWrapper>
  );
}
