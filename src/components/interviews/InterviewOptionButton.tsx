export default function InterviewOptionButton({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${isActive ? "bg-[#DFF0E4]" : "bg-white"} text-body-3 cursor-pointer rounded-lg border border-[#DDE8D0] py-3 text-[#6C6A6A]`}
    >
      {children}
    </button>
  );
}
