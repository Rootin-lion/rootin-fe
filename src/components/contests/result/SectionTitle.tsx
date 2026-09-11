export default function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mt-2 text-[12px] font-semibold text-black">{children}</p>
  );
}
