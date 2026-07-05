interface OptionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected?: boolean;
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
      className={`cursor-pointer rounded-md border bg-white px-3 py-1.5 text-[14px] font-medium text-black transition-colors ${
        isSelected ? "border-2 border-[#51A05C]" : "border-[#D5D9DD]"
      }`}
    >
      {children}
    </button>
  );
}
