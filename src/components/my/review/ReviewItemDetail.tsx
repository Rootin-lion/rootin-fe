export default function ReviewItemDetail() {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-primary-200 bg-bg-green-50 flex flex-col gap-3 rounded-xl border p-4">
        <p className="text-text text-[14px] font-semibold">내 답변 비교</p>
        <div className="flex items-start gap-3 rounded-lg border border-[#F5D6D2] bg-[#FFF7F6] px-4 py-3">
          <p className="shrink-0 text-[12px] font-semibold text-[#DC2626]">
            내 답변
          </p>
          <p className="text-text text-body-3 min-w-0 leading-5">
            공개키만 사용하여 암호화한다
          </p>
        </div>
        <div className="border-primary-200 bg-primary-50 flex items-start gap-3 rounded-lg border px-4 py-3">
          <p className="text-primary-900 shrink-0 text-[12px] font-semibold">
            정답
          </p>
          <p className="text-text text-body-3 min-w-0 leading-5">
            비대칭키로 세션키를 교환 후 대칭키 암호화를 사용한다
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-[#E1E1E1] pt-4">
        <p className="text-text text-[14px] font-semibold">해설</p>
        <p className="text-body-3 text-sub-text leading-6">
          프로세스는 독립적인 메모리 공간을 가지며, 스레드는 프로세스 내에서
          코드, 데이터, 힙 영역을 공유합니다.
        </p>
      </div>
    </div>
  );
}
