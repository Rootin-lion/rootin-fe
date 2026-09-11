export default function DetailWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="w-full rounded-lg bg-white">{children}</section>;
}
