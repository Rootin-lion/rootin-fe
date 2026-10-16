export default function ProblemCategory({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <p
      className={`self-start rounded-xl px-2 py-1 text-[11px] font-semibold text-[#3A7C1E] ${className}`}
    >
      {label}
    </p>
  );
}
