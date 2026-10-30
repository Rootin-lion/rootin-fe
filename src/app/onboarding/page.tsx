import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SESSION_TOKEN_COOKIE } from "@/constants/auth/sessionTokenCookie";
import OnboardingProfileForm from "@/components/onboarding/OnboardingProfileForm";
import OnboardingProfileRecovery from "@/components/onboarding/OnboardingProfileRecovery";
import { isValidProfileEmail } from "@/lib/profile/isValidProfileEmail";
import { getMemberSnapshot } from "@/lib/auth/getMemberSnapshot";

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

  const member = await getMemberSnapshot();

  if (
    !isValidProfileEmail(member?.email) ||
    typeof member?.profileCompleted !== "boolean"
  ) {
    return <OnboardingProfileRecovery />;
  }

  if (member.profileCompleted) redirect("/");

  return <OnboardingProfileForm email={member.email.trim()} />;
}
