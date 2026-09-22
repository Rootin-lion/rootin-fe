import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { AuthSession } from "@/types/oauth/oauth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnBoardingPage() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get("memberSnapshot")?.value;

  if (!cookieStore.get("sessionToken")?.value) {
    redirect("/login");
  }

  if (!rawSession) redirect("/login");

  let session: AuthSession;
  try {
    session = JSON.parse(rawSession) as AuthSession;
  } catch {
    redirect("/login");
  }

  if (typeof session.member?.email !== "string") redirect("/login");

  return <OnboardingForm email={session.member.email} />;
}
