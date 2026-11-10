"use client";

import { useState } from "react";
import ChevronIcon from "@/assets/icons/shared/chevron.svg";
import OptionButton from "@/components/shared/OptionButton";

type InterestFieldOption = {
  label: string;
  value: string;
};

interface InterestFieldSelectorProps {
  value: string[];
  options: InterestFieldOption[];
  onClick: (value: string) => void;
  defaultOpen?: boolean;
}

export default function InterestFieldSelector({
  value,
  options,
  onClick,
  defaultOpen = false,
}: InterestFieldSelectorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const selectedOption = options.find((option) => value.includes(option.value));
  const message =
    isOpen && value.length === 0
      ? "최대 3개까지 선택할 수 있어요"
      : "관심분야를 선택해주세요";

  const selectedLabelsText = value
    .map(
      (selectedValue) =>
        options.find((option) => option.value === selectedValue)?.label ??
        selectedValue,
    )
    .join(", ");

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`rounded-lg bg-white ${isOpen || selectedOption ? "border-2 border-[#9FD1A5]" : ""}`}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-sub-text flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-left text-[12px] md:min-h-12 md:px-4 md:py-3"
        >
          <span
            className={`min-w-0 text-[14px] break-keep max-md:text-[11px] md:max-lg:text-[13px] ${selectedOption ? "text-[#1A1A1A]" : ""}`}
          >
            {value && value.length > 0 ? selectedLabelsText : message}
          </span>

          <ChevronIcon
            strokeWidth={1.5}
            className={`text-primary h-2.5 w-1.5 shrink-0 transition-transform ${isOpen ? "rotate-90" : "-rotate-90"}`}
          />
        </button>
        {isOpen && (
          <div className="p-2 md:p-3">
            <div className="flex w-full max-w-97 flex-wrap gap-2 md:gap-y-4 max-md:[&_button]:min-h-9 max-md:[&_button]:px-2.5 max-md:[&_button]:py-1">
              {options.map((option, index) => {
                const isSelected = value.includes(option.value);

                return (
                  <p key={index}>
                    <OptionButton
                      variant="outline"
                      selected={isSelected}
                      onClick={() => onClick(option.value)}
                    >
                      {option.label}
                    </OptionButton>
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
