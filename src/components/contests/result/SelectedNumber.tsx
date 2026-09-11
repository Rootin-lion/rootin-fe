export default function SelectedNumber({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="text-primary-900 text-[22px] font-semibold">
      {children}
    </span>
  );
}
