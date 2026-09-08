export default function InterviewCount({
  questionCount,
  onChange,
}: {
  questionCount: null | number;
  onChange: (count: null | number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-body-3 text-text">문항 개수</div>
      <input
        type="number"
        min={1}
        max={5}
        placeholder="0"
        value={questionCount ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-text w-full rounded-lg border border-[#E1E1E1] bg-white px-4 py-3 text-[14px] font-normal"
      />
      <p className="text-caption text-disabled-text ml-2">1 ~ 5개 선택 가능</p>
    </div>
  );
}
