import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthSession } from "@/types/oauth/oauth";
import type { Metadata } from "next";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
import { SESSION_TOKEN_COOKIE } from "@/constants/auth/sessionTokenCookie";
import OnboardingProfileForm from "@/components/onboarding/OnboardingProfileForm";
import OnboardingProfileRecovery from "@/components/onboarding/OnboardingProfileRecovery";
import { isValidProfileEmail } from "@/lib/profile/isValidProfileEmail";

export const metadata: Metadata = {
  title: "프로필 설정 | ROOTIN",
  description: "ROOTIN 프로필을 설정하세요.",
  robots: { index: false },
};

export default async function OnboardingPage() {
  const cookieStore = await cookies();

  if (!cookieStore.get(SESSION_TOKEN_COOKIE)?.value) {
    redirect("/login");
  }

  const rawMemberSnapshot = cookieStore.get(MEMBER_SNAPSHOT_COOKIE)?.value;
  let member: Partial<AuthSession["member"]> | null = null;

  if (rawMemberSnapshot) {
    try {
      member =
        (JSON.parse(rawMemberSnapshot) as Partial<AuthSession> | null)
          ?.member ?? null;
    } catch {
      member = null;
    }
  }

  if (
    !isValidProfileEmail(member?.email) ||
    typeof member?.profileCompleted !== "boolean"
  ) {
    return <OnboardingProfileRecovery />;
  }

  if (member.profileCompleted) redirect("/");

  return <OnboardingProfileForm email={member.email.trim()} />;
}
