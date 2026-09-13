import Image from "next/image";
import AiImg from "../../../assets/interviews/msg_char.png";

import MessageBubble from "./MessageBubble";
import { MessageType } from "@/types/interviews/interview";

export default function InterviewMessage({
  type = "AI",
  text,
}: {
  type: MessageType;
  text: string;
}) {
  return (
    <div className="flex flex-row gap-3">
      {type === "AI" && (
        <div className="bg-primary-200 flex h-15 w-15 shrink-0 items-center justify-center rounded-[50%]">
          <Image src={AiImg} alt="char" className="h-10.25 w-10" />
        </div>
      )}
      <div className={`${type === "AI" ? "pr-15" : "pl-18"}`}>
        <MessageBubble text={text} type={type} />
      </div>
      {type === "CLIENT" && (
        <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-self-center rounded-[50%]"></div>
      )}
    </div>
  );
}
