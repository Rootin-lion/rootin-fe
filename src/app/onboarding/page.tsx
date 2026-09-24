import OnboardingProfileForm from "@/components/onboarding/OnboardingProfileForm";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
import { AuthSession } from "@/types/oauth/oauth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const rawMemberSnapshot = cookieStore.get(MEMBER_SNAPSHOT_COOKIE)?.value;

  if (!cookieStore.get("sessionToken")?.value) {
    redirect("/login");
  }

  if (!rawMemberSnapshot) redirect("/login");

  let memberSnapshot: AuthSession;
  try {
    memberSnapshot = JSON.parse(rawMemberSnapshot) as AuthSession;
  } catch {
    redirect("/login");
  }

  if (typeof memberSnapshot.member?.email !== "string") redirect("/login");

  return <OnboardingProfileForm email={memberSnapshot.member.email} />;
}
