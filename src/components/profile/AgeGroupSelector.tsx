import { AGE_GROUP_OPTIONS } from "@/constants/onboarding/onboarding";
import Button from "@/components/shared/Button";

export default function AgeGroupSelector({
  value,
  onSelect,
  variant,
}: {
  value: string;
  onSelect: (value: string) => void;
  variant: "onboarding" | "settings";
}) {
  if (variant === "onboarding") {
    return (
      <div className="flex justify-center gap-2">
        {AGE_GROUP_OPTIONS.map((option) => (
          <Button
            key={option.value}
            isActive={value === option.value}
            aria-pressed={value === option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-7">
      {AGE_GROUP_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onSelect(option.value)}
          className={`h-10 cursor-pointer rounded-lg text-[14px] ${value === option.value ? "bg-primary text-white" : "bg-[#F2F2F2] text-[#888F9C]"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
