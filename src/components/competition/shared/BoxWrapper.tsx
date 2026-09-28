export default function BoxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="border-primary-100 rounded-lg border p-6">
      {children}
    </section>
  );
}
