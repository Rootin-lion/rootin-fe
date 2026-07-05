interface OptionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

export default function OptionButton({
  children,
  onClick,
  isSelected,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors ${
        isSelected
          ? "border-[#51A05C] bg-[#51A05C] text-white"
          : "border-[#D5D9DD] bg-white text-[#1A1A1A]"
      }`}
    >
      {children}
    </button>
  );
}
