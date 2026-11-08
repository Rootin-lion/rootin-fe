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
      <h3 className={`text-subtitle text-[#1a1a1a] ${titleClassName}`}>
        {title}
      </h3>
      <p className={`text-body-3 ${descriptionClassName}`}>{description}</p>
    </div>
  );
}
