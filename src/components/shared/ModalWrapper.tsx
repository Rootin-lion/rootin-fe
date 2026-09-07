interface ModalProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

function ModalBox({ children }: ModalProps) {
  return <div className="mx-auto flex w-63 flex-col gap-3">{children}</div>;
}

function ModalNoticeBox({ children }: ModalProps) {
  return (
    <div className="mx-auto w-75.5 rounded-lg bg-[#F0F0F0] px-3 py-3 text-left">
      {children}
    </div>
  );
}

function ModalWrapperContent({ children }: ModalProps) {
  return <div className="text-body-3 text-center text-black">{children}</div>;
}

function ModalWrapperTitle({ children }: ModalProps) {
  return <div className="text-subtitle text-center text-black">{children}</div>;
}

function ModalWrapperMain({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-90 bg-black/20 backdrop-blur-[3px]" />
      <div className="fixed top-1/2 left-1/2 z-100 min-h-44 min-w-95 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white py-8 text-center">
        {children}
      </div>
    </>
  );
}

const ModalWrapper = Object.assign(ModalWrapperMain, {
  Box: ModalBox,
  Notice: ModalNoticeBox,
  Title: ModalWrapperTitle,
  Content: ModalWrapperContent,
});

export default ModalWrapper;
