import Image from "next/image";
import type { InterviewFieldType } from "@/types/interviews/interview";
import { INTERVIEW_LIST } from "@/constants/interviews/interview";

export default function InterviewPreview({
  field = "OPERATING_SYSTEM",
}: {
  field: InterviewFieldType;
}) {
  const data = INTERVIEW_LIST[field as keyof typeof INTERVIEW_LIST];

  return (
    <div className="bg-primary-50 border-bg-green-50 max-h-70 rounded-[14px] border px-6 pt-2">
      <div className="flex flex-row items-center gap-1">
        <Image
          src={data.img}
          alt={data.alt}
          width={80}
          height={77}
          className="w-20"
        />
        <p className="text-title-4 text-black">{data.title}</p>
      </div>
      <p className="mt-1 w-78.5 text-[13px] leading-6 font-medium whitespace-pre-wrap text-[#6C6A6A]">
        {data.content}
      </p>
    </div>
  );
}
