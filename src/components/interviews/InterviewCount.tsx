import { useId, type ChangeEvent } from "react";

export default function InterviewCount({
  questionCount,
  onChange,
}: {
  questionCount: null | number;
  onChange: (count: null | number) => void;
}) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      <label htmlFor={inputId} className="text-body-3 text-text">
        문항 개수
      </label>
      <input
        id={inputId}
        aria-describedby={hintId}
        type="number"
        min={1}
        max={5}
        placeholder="1 ~ 5"
        value={questionCount ?? ""}
        onChange={handleChange}
        className="text-text focus:border-primary focus:ring-primary border-primary-300 h-9 w-full rounded-lg border-2 px-3 py-2 text-xs font-normal focus:ring-1 focus:outline-none md:h-auto md:px-4 md:py-3 md:text-[14px]"
      />
      <p id={hintId} className="text-caption text-disabled-text ml-2">
        1 ~ 5개 선택 가능
      </p>
    </div>
  );
}
