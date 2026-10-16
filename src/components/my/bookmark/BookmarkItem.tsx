import BookmarkIcon from "@/assets/icon/shared/bookmark.svg";

export default function BookmarkItem() {
  return (
    <div className="relative w-full rounded-xl border border-[#E1E1E1] bg-white px-4 py-6">
      <BookmarkIcon
        aria-hidden="true"
        className="fill-primary text-primary absolute top-6 left-4 h-6 w-6"
      />
      <div className="flex flex-row items-center justify-between pl-9">
        <div className="flex flex-col gap-2">
          <p className="self-start rounded-xl bg-[#EDF2FB] px-2 py-1 text-[11px] font-semibold text-[#3A7C1E]">
            네트워크
          </p>
          <h3 className="text-subtitle text-[#1a1a1a]">
            TCP 3-way Handshake의 동작 원리
          </h3>
          <p className="text-body-3 text-black">
            프로세스(Process)와 스레드(Thread)의 관계에 대한 설명으로 옳은 것은?
          </p>
        </div>
        <p className="text-sub-text text-[11px] font-normal">2026.04.14</p>
      </div>
    </div>
  );
}
