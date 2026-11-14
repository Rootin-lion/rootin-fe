import SendIcon from "@/assets/icons/interviews/send.svg";

export default function SessionForm({
  answer,
  onChange,
  onSubmit,
  disabled = false,
  onCompositionStart,
  onCompositionEnd,
}: {
  answer: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  disabled?: boolean;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
}) {
  return (
    <div className="w-full shrink-0 border-t border-t-[#E5E7EB] bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] md:px-6 md:py-3">
      <form
        className="relative mx-auto w-full max-w-5xl"
        onSubmit={(event) => {
          event.preventDefault();
          const nativeEvent = event.nativeEvent as Event & {
            isComposing?: boolean;
          };
          if (nativeEvent.isComposing) return;
          onSubmit();
        }}
      >
        <input
          aria-label="답변 입력"
          value={answer}
          onChange={onChange}
          disabled={disabled}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.nativeEvent.isComposing)
              event.preventDefault();
          }}
          className="bg-bg-ivory focus:border-primary focus:ring-primary border-primary-300 min-h-12 w-full rounded-xl border-2 py-3 pr-14 pl-3 text-[16px] focus:border focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:pr-12 md:pl-4"
        />
        <button
          aria-label="답변 보내기"
          type="submit"
          disabled={disabled}
          className="bg-primary absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50 md:right-2 md:h-8 md:w-8"
        >
          <SendIcon
            viewBox="0 0 11 11"
            className="h-3 w-3 md:h-2.75 md:w-2.75"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
}
