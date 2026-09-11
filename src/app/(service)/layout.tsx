import Header from "@/components/shared/Header";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-ivory flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
