import SendIcon from "@/assets/interviews/send.svg";

export default function SessionwForm({
  answer,
  onChange,
  onSubmit,
  disabled = false,
}: {
  answer: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="w-full border-t border-t-[#E5E7EB] bg-white py-3">
      <form
        className="relative mx-auto w-full max-w-5xl"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          aria-label="답변 입력"
          value={answer}
          onChange={onChange}
          disabled={disabled}
          className="bg-bg-ivory focus:border-primary focus:ring-primary border-primary-300 w-full rounded-xl border-2 py-3 pr-12 pl-4 focus:border focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          aria-label="답변 보내기"
          type="submit"
          disabled={disabled}
          className="bg-primary absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
}
