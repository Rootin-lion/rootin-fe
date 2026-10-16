import BookmarkIcon from "@/assets/icon/shared/bookmark.svg";
import ProblemCategory from "../shared/ProblemCategory";
import ProblemDate from "../shared/ProblemDate";
import ProblemText from "../shared/ProblemText";

export default function BookmarkItem() {
  return (
    <div className="relative w-full rounded-xl border border-[#E1E1E1] bg-white px-4 py-6">
      <BookmarkIcon className="fill-primary text-primary absolute top-6 left-4 h-6 w-6 cursor-pointer" />
      <div className="flex cursor-pointer flex-row items-center justify-between pl-9">
        <div className="flex min-w-0 flex-col gap-2">
          <ProblemCategory label="네트워크" className="bg-[#EDF2FB]" />
          <ProblemText
            title="TCP 3-way Handshake의 동작 원리"
            description="프로세스(Process)와 스레드(Thread)의 관계에 대한 설명으로 옳은 것은?"
            descriptionClassName="text-black"
          />
        </div>
        <div className="ml-4 shrink-0">
          <ProblemDate date="2026.04.14" />
        </div>
      </div>
    </div>
  );
}
