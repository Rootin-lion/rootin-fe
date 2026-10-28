import { cookies } from "next/headers";
import type { AuthSession } from "@/types/oauth/oauth";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
import MyContent from "@/components/my/MyContent";

export default async function MyPage(props: PageProps<"/my">) {
  const { section } = await props.searchParams;
  const rawSession = (await cookies()).get(MEMBER_SNAPSHOT_COOKIE)?.value;
  let member: AuthSession["member"] | null = null;

  if (rawSession) {
    try {
      member = (JSON.parse(rawSession) as AuthSession).member ?? null;
    } catch {
      member = null;
    }
  }

  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("-", ".");

  return (
    <MyContent
      member={member}
      today={today}
      initialSection={section === "bookmark" ? "bookmark" : "dashboard"}
    />
  );
}
