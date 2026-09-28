import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { AuthSession } from "@/types/oauth/oauth";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";

export default async function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(MEMBER_SNAPSHOT_COOKIE)?.value;
  let member: AuthSession["member"] | null = null;

  if (!cookieStore.get("sessionToken")?.value) {
    redirect("/login");
  }

  if (rawSession) {
    try {
      member = (JSON.parse(rawSession) as AuthSession).member ?? null;
    } catch {
      redirect("/login");
    }
  }

  return (
    <div className="bg-bg-ivory flex min-h-dvh flex-col">
      <Header member={member} />
      <main className="bg-bg-green-50 flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
