export default function DetailWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full rounded-lg bg-white">{children}</div>;
}
