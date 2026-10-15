import Image from "next/image";
import AiImg from "@/assets/interviews/msg_char.png";
import type { MessageType } from "@/types/interviews/interview";
import MessageBubble from "./MessageBubble";

export default function SessionMessage({
  type = "QUESTION",
  text,
  isTyping = false,
  animate = true,
  onTextAnimationComplete,
  profileImageUrl,
}: {
  type: MessageType;
  text: string;
  isTyping?: boolean;
  animate?: boolean;
  onTextAnimationComplete?: () => void;
  profileImageUrl?: string | null;
}) {
  return (
    <div
      className={`flex flex-row gap-3 ${type === "ANSWER" ? "justify-end" : ""}`}
    >
      {type === "QUESTION" && (
        <div className="bg-primary-200 flex h-15 w-15 shrink-0 items-center justify-center rounded-[50%]">
          <Image src={AiImg} alt="char" className="h-10.25 w-10" />
        </div>
      )}

      <div className={`${type === "QUESTION" ? "pr-15" : "pl-18"}`}>
        <MessageBubble
          text={text}
          type={type}
          loading={isTyping}
          animate={animate}
          onTextAnimationComplete={onTextAnimationComplete}
        />
      </div>
      {type === "ANSWER" && (
        <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
          {profileImageUrl && (
            <Image
              src={profileImageUrl}
              alt="내 프로필"
              width={48}
              height={48}
              unoptimized
              className="h-full w-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}
