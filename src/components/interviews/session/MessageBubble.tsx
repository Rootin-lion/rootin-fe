import type { MessageType } from "@/types/interviews/interview";

const MESSAGE_STYLES = {
  AI: "rounded-tr-2xl rounded-b-2xl border-[#DDE8D0] bg-white",
  CLIENT: "bg-primary-200 border-bg-green-50 rounded-tl-2xl rounded-b-2xl",
};

export default function MessageBubble({
  type = "AI",
  text,
}: {
  type: MessageType;
  text: string;
}) {
  return (
    <div
      className={`${MESSAGE_STYLES[type]} left-6 border px-4 py-3 text-[14px] font-normal text-[#1A1A1A]`}
    >
      {text}
    </div>
  );
}
