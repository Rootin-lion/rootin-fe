export default function Button({
  children,
  disabled,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const bgStyle = isActive ? "bg-primary" : "bg-[#D5D9DD]";
  const textStyle = isActive ? "text-green-50" : "text-[#888F9C]";
  const cursorStyle = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`py-2 min-w-25 ${bgStyle} ${textStyle} ${cursorStyle} rounded-lg font-medium w-full`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
