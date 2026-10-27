export default function InterviewResultAccuracyBar({
  accuracy,
  label,
  className,
}: {
  accuracy: number;
  label: string;
  className: string;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={accuracy}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`${className} overflow-hidden rounded-full bg-[#E5E7EB]`}
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#6FB377_0%,#69AC70_50%,#36723E_100%)]"
        style={{ width: `${accuracy}%` }}
      />
    </div>
  );
}
