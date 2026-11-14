"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
} from "react";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ModalAccessibilityContext = createContext<{
  titleId: string;
  descriptionId: string;
} | null>(null);

function ModalBox({ children }: ModalProps) {
  return (
    <div className="mx-auto flex w-63 max-w-[calc(100%-32px)] flex-col gap-3">
      {children}
    </div>
  );
}

function ModalNoticeBox({ children }: ModalProps) {
  return (
    <div className="mx-auto w-76 max-w-[calc(100%-32px)] rounded-lg bg-[#F0F0F0] px-4 py-3 text-left">
      {children}
    </div>
  );
}

function ModalWrapperContent({ children, className = "" }: ModalProps) {
  const accessibility = useContext(ModalAccessibilityContext);

  return (
    <div
      id={accessibility?.descriptionId}
      className={`text-body-3 text-center text-black ${className}`}
    >
      {children}
    </div>
  );
}

function ModalWrapperTitle({ children, className = "" }: ModalProps) {
  const accessibility = useContext(ModalAccessibilityContext);

  return (
    <h2
      id={accessibility?.titleId}
      className={`text-subtitle text-center text-black ${className}`}
    >
      {children}
    </h2>
  );
}

function ModalWrapperMain({
  children,
  onClose,
  className = "",
  describedByContent = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  describedByContent?: boolean;
}) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement;
    dialog.showModal();

    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, []);

  return (
    <ModalAccessibilityContext.Provider value={{ titleId, descriptionId }}>
      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={describedByContent ? descriptionId : undefined}
        onCancel={(event) => {
          // 실제 닫힘 여부는 시작 중 닫기 제한 등을 가진 부모가 결정한다.
          event.preventDefault();
          onClose();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-black/20 p-0 backdrop-blur-[3px] backdrop:bg-transparent"
      >
        <div
          className={`fixed top-1/2 left-1/2 z-100 flex max-h-[calc(100dvh-32px)] min-h-44 min-w-95 -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-lg bg-white py-8 text-center max-sm:w-[calc(100%-32px)] max-sm:min-w-0 sm:justify-center ${className}`}
        >
          {children}
        </div>
      </dialog>
    </ModalAccessibilityContext.Provider>
  );
}

const ModalWrapper = Object.assign(ModalWrapperMain, {
  Box: ModalBox,
  Notice: ModalNoticeBox,
  Title: ModalWrapperTitle,
  Content: ModalWrapperContent,
});

export default ModalWrapper;
