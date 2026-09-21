import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-ivory flex min-h-dvh flex-col">
      <Header />
      <main className="bg-bg-green-50 flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
