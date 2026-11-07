import Image from "next/image";
import type { InterviewCategoryType } from "@/types/interviews/interview";
import { INTERVIEW_LIST } from "@/constants/interviews/interview";

export default function InterviewPreview({
  category = "OPERATING_SYSTEM",
}: {
  category: InterviewCategoryType;
}) {
  const data = INTERVIEW_LIST[category as keyof typeof INTERVIEW_LIST];

  return (
    <div className="bg-primary-50 border-bg-green-50 hidden min-w-0 rounded-[14px] border px-4 pt-2 pb-4 md:flex md:max-h-70 md:flex-col md:px-6 md:pb-0">
      <div className="flex flex-row items-center gap-1">
        <Image
          src={data.img}
          alt={data.alt}
          width={80}
          height={77}
          className="h-auto w-14 md:w-20"
        />
        <p className="text-title-4 text-black">{data.title}</p>
      </div>
      <p className="mt-1 text-xs leading-5 font-medium whitespace-pre-wrap text-[#6C6A6A] md:w-78.5 md:max-w-full md:text-[13px] md:leading-6">
        {data.content}
      </p>
    </div>
  );
}
