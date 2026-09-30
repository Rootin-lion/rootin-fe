import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthSession } from "@/types/oauth/oauth";
import type { Metadata } from "next";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
import OnboardingProfileForm from "@/components/onboarding/OnboardingProfileForm";

export const metadata: Metadata = {
  title: "프로필 설정 | ROOTIN",
  description: "ROOTIN 프로필을 설정하세요.",
  robots: { index: false },
};

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const rawMemberSnapshot = cookieStore.get(MEMBER_SNAPSHOT_COOKIE)?.value;

  // 토큰 쿠기 검증
  if (!cookieStore.get("sessionToken")?.value) {
    redirect("/login");
  }

  // 맴버 쿠키 검증
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
