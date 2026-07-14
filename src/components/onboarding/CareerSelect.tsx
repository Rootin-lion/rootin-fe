"use client";

import { useState } from "react";
import OptionButton from "./OptionButton";

type CareerOption = {
  label: string;
  value: string;
};

interface CareerSelectProps {
  value: string[];
  options: CareerOption[];
  onClick: (value: string) => void;
  defaultOpen?: boolean;
}

export default function CareerSelect({
  value,
  options,
  onClick,
  defaultOpen = false,
}: CareerSelectProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const selectedOption = options.find((option) => value.includes(option.value));
  const message =
    isOpen && value.length === 0
      ? "최대 3개까지 선택할 수 있어요"
      : "관심분야를 선택해주세요";

  const selectedValues = value.map((career) => career).join(", ");

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`rounded-lg bg-white ${isOpen ? "border border-[#9FD1A5]" : ""} py-2`}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-white px-4 py-3 text-left text-[12px] text-[#6B7280]"
        >
          <span
            className={`text-[12px] ${selectedOption ? "text-[#1A1A1A]" : ""}`}
          >
            {value && value.length > 0 ? selectedValues : message}
          </span>

          <svg
            className={`h-4 w-4 text-[#51A05C] transition-transform ${isOpen ? "rotate-180" : "180"}`}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12.5L10 7.5L15 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="p-3">
            <div className="flex w-full max-w-97 flex-wrap gap-x-2 gap-y-4">
              {options.map((option, index) => {
                const isSelected = value.includes(option.value);

                return (
                  <p key={index}>
                    <OptionButton
                      isSelected={isSelected}
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
