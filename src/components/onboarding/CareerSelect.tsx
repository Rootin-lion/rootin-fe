"use client";

import { useState } from "react";
import OptionButton from "./OptionButton";

type CareerOption = {
  label: string;
  value: string;
};

interface CareerSelectProps {
  label?: string;
  placeholder?: string;
  options: CareerOption[];
  value: string;
  onChange: (value: string) => void;
  defaultOpen?: boolean;
}

export default function CareerSelect({
  placeholder = "경력을 선택해주세요",
  options,
  value,
  onChange,
  defaultOpen = false,
}: CareerSelectProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-[#9FD1A5] bg-white px-4 py-3 text-left text-[12px] text-[#6B7280] cursor-pointer"
      >
        <span className={selectedOption ? "text-[#1A1A1A]" : ""}>
          {selectedOption?.label ?? placeholder}
        </span>

        <svg
          className={`h-4 w-4 text-[#51A05C] transition-transform ${isOpen ? "rotate-180" : ""}`}
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
        <div className="rounded-xl border border-[#9FD1A5] bg-white p-3">
          <div className="grid grid-cols-3 gap-2">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <>
                  <OptionButton
                    isSelected={isSelected}
                    onClick={() => onChange(option.value)}
                  >
                    {option.label}
                  </OptionButton>
                </>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
