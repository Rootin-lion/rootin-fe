export default function QuestionSurface({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-33.5 min-w-53.5 rounded-lg bg-white px-6 py-7">
      {children}
    </div>
  );
}
