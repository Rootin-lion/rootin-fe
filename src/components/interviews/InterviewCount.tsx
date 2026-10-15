import React from "react";

export default function InterviewCount({
  questionCount,
  onChange,
}: {
  questionCount: null | number;
  onChange: (count: null | number) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      onChange(null);

      return;
    }

    const count = Number(value);
    if (!Number.isInteger(count) || count < 1 || count > 5) return;

    onChange(count);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-body-3 text-text">문항 개수</div>
      <input
        type="number"
        min={1}
        max={5}
        placeholder="1 ~ 5"
        value={questionCount ?? ""}
        onChange={handleChange}
        className="text-text focus:border-primary focus:ring-primary border-primary-300 w-full rounded-lg border-2 px-4 py-3 text-[14px] font-normal focus:ring-1 focus:outline-none"
      />
      <p className="text-caption text-disabled-text ml-2">1 ~ 5개 선택 가능</p>
    </div>
  );
}
