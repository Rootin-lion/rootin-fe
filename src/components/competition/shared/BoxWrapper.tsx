export default function BoxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="border-primary-100 min-w-0 rounded-lg border p-4 md:p-6">
      {children}
    </section>
  );
}
