interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  disabled,
  isActive = false,
  onClick,
}: ButtonProps) {
  const bgStyle = isActive ? "bg-primary" : "bg-[#D5D9DD]";
  const textStyle = isActive ? "text-green-50" : "text-[#888F9C]";
  const cursorStyle = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`min-w-25 py-2 ${bgStyle} ${textStyle} ${cursorStyle} w-full rounded-lg font-medium`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
