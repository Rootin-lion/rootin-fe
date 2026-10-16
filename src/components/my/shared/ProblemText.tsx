export default function ProblemText({
  title,
  description,
  descriptionClassName,
}: {
  title: string;
  description: string;
  descriptionClassName: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="text-subtitle text-[#1a1a1a]">{title}</h3>
      <p className={`text-body-3 ${descriptionClassName}`}>{description}</p>
    </div>
  );
}
