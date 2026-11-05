import Image from "next/image";
import SuccessCharacterImage from "@/assets/success_char.png";
import type { Metadata } from "next";
import AutoRedirect from "@/components/onboarding/AutoRedirect";

export const metadata: Metadata = {
  title: "가입 완료 | ROOTIN",
  description: "가입을 완료하고 ROOTIN을 시작하세요.",
  robots: { index: false },
};

export default function OnboardingSuccessPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#f7faf5_0%,#edf7ef_50%,#eaf3e8_100%)] px-6 py-10">
      <AutoRedirect />
      <section
        aria-labelledby="success-title"
        className="relative w-full max-w-md rounded-4xl px-2 py-6 md:px-8 md:py-10"
      >
        <div className="relative mx-auto mb-8 flex items-center justify-center rounded-full">
          <Image
            src={SuccessCharacterImage}
            alt="루틴 시작을 환영하는 모코 캐릭터"
            preload
            className="relative h-auto w-full max-w-70 drop-shadow-[0_12px_24px_rgba(31,41,55,0.14)]"
            sizes="(max-width: 343px) calc(100vw - 64px), 280px"
          />
        </div>

        <div className="space-y-3 text-center">
          <h1
            id="success-title"
            className="text-gradient-primary text-title-3 font-semibold lg:leading-10.5"
          >
            환영합니다!
          </h1>
          <p className="text-[15px] leading-5.75 font-medium text-black">
            회원가입이 완료됐어요.
          </p>
        </div>
      </section>
    </main>
  );
}
