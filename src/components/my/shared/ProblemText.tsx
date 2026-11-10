export default function ProblemText({
  title,
  description,
  descriptionClassName,
  titleClassName = "",
  className = "",
}: {
  title: string;
  description: string;
  descriptionClassName: string;
  titleClassName?: string;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <h3
        className={`text-[13px] leading-snug font-semibold text-[#1a1a1a] md:text-[16px] ${titleClassName}`}
      >
        {title}
      </h3>
      <p
        className={`text-[12px] leading-relaxed md:text-[13px] ${descriptionClassName}`}
      >
        {description}
      </p>
    </div>
  );
}
