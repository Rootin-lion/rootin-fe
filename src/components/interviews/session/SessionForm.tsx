import SendIcon from "@/assets/interviews/send.svg";

export default function SessionwForm({
  answer,
  onChange,
  onSubmit,
}: {
  answer: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="w-full border-t border-t-[#E5E7EB] bg-white py-3">
      <div className="relative mx-auto w-full max-w-5xl">
        <input
          value={answer}
          onChange={onChange}
          className="bg-bg-ivory focus:border-primary focus:ring-primary border-primary-300 w-full rounded-xl border-2 py-3 pr-12 pl-4 focus:border focus:ring-1 focus:outline-none"
        />
        <button
          type="button"
          onClick={onSubmit}
          className="bg-primary absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
