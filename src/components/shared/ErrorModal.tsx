import ModalWrapper from "./ModalWrapper";

export default function ErroModal({
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
    </ModalWrapper>
  );
}
