type ButtonType = "button" | "submit";

interface ButtonProps {
  children: React.ReactNode;
  type?: ButtonType;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  "aria-pressed"?: boolean;
}

export default function Button({
  children,
  type = "button",
  disabled,
  isActive = false,
  onClick,
  "aria-pressed": ariaPressed,
}: ButtonProps) {
  const bgStyle = isActive ? "bg-primary" : "bg-[#D5D9DD]";
  const textStyle = isActive ? "text-green-50" : "text-[#888F9C]";
  const cursorStyle = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type={type}
      disabled={disabled}
      aria-pressed={ariaPressed}
      className={`min-w-25 py-2 ${bgStyle} ${textStyle} ${cursorStyle} w-full rounded-lg font-medium`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
