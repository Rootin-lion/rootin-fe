import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { AuthInitializer } from "@/stores/useAuthStore";
import { AuthSession } from "@/types/oauth/auth";

export default async function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  if (!cookieStore.get("sessionToken")?.value) {
    redirect("/login");
  }

  const rawSession = cookieStore.get("memberSnapshot")?.value;
  let session: AuthSession | null = null;

  if (rawSession) {
    try {
      session = JSON.parse(rawSession) as AuthSession;
    } catch {
      session = null;
    }
  }

  return (
    <div className="bg-bg-ivory flex min-h-dvh flex-col">
      <AuthInitializer session={session} />
      <Header />
      <main className="bg-bg-green-50 flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
