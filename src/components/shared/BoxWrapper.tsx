export default function BoxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-primary-100 p-6">{children}</div>
  );
}
