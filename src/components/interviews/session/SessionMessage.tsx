import Image from "next/image";
import CharImg from "@/assets/images/shared/success_char.png";
import AiImg from "@/assets/images/interviews/msg_char.png";
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
      className={`flex min-w-0 flex-row gap-2 md:gap-3 ${type === "ANSWER" ? "justify-end" : ""}`}
    >
      {type === "QUESTION" && (
        <div className="bg-primary-200 flex h-9 w-9 shrink-0 items-center justify-center rounded-[50%] md:h-15 md:w-15">
          <Image
            src={AiImg}
            alt="char"
            className="h-auto w-6 md:h-10.25 md:w-10"
          />
        </div>
      )}

      <div
        className={`min-w-0 ${type === "QUESTION" ? "pr-2 md:pr-15" : "pl-2 md:pl-18"}`}
      >
        <MessageBubble
          text={text}
          type={type}
          loading={isTyping}
          animate={animate}
          onTextAnimationComplete={onTextAnimationComplete}
        />
      </div>
      {type === "ANSWER" && (
        <div className="bg-primary-200 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full md:h-12 md:w-12">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="내 프로필"
              width={48}
              height={48}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={CharImg}
              alt=""
              className="h-7 w-7 object-contain md:h-10 md:w-10"
            />
          )}
        </div>
      )}
    </div>
  );
}
