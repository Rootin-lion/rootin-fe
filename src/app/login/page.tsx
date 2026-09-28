import { Metadata } from "next";
import LoginHeroSection from "@/components/login/LoginHeroSection";
import SocialLoginSection from "@/components/login/SocialLoginSection";

export const metadata: Metadata = {
  title: "로그인 | ROOTIN",
  description:
    "카카오 또는 구글 계정으로 ROOTIN에 로그인하고 CS 학습을 시작하세요.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-row">
      <LoginHeroSection />
      <SocialLoginSection />
    </main>
  );
}
