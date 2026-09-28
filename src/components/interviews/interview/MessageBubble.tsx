import type { MessageType } from "@/types/interviews/interview";

const MESSAGE_STYLES = {
  AI: "rounded-tr-2xl rounded-b-2xl border-[#DDE8D0] bg-white ",
  CLIENT: "bg-primary-200 border-bg-green-50 rounded-tl-2xl rounded-b-2xl ",
};

export default function MessageBubble({
  type = "AI",
  text,
  loading = false,
}: {
  type: MessageType;
  text: string;
  loading: boolean;
}) {
  return (
    <div
      className={`${MESSAGE_STYLES[type]} left-6 border px-4 py-3 text-[14px] font-normal text-[#1A1A1A] ${loading ? "flex h-15 w-20 justify-center" : ""}`}
    >
      {loading ? (
        <span className="flex items-center gap-2" aria-hidden="true">
          {/* shadow-[0_3px_4px_rgba(81,160,92,0.35)] */}
          <span className="bg-primary animate-typing-bounce h-1.75 w-1.75 rounded-full [animation-delay:-300ms] motion-reduce:animate-none" />
          <span className="bg-primary animate-typing-bounce h-1.75 w-1.75 rounded-full [animation-delay:-150ms] motion-reduce:animate-none" />
          <span className="bg-primary animate-typing-bounce h-1.75 w-1.75 rounded-full motion-reduce:animate-none" />
        </span>
      ) : (
        text
      )}
    </div>
  );
}
