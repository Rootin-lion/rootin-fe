import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMemberSnapshot } from "@/lib/auth/getMemberSnapshot";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default async function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  if (!cookieStore.get("sessionToken")?.value) {
    redirect("/login");
  }

  const member = await getMemberSnapshot();

  return (
    <div className="bg-bg-ivory flex min-h-dvh flex-col">
      <Header member={member} />
      <main className="bg-bg-green-50 flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
