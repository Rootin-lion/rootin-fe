import Image from "next/image";
import SuccessImg from "@/assets/success_char.png";
import AutoRedirect from "@/components/onboarding/AutoRedirect";

export default function SuccessPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#f7faf5_0%,#edf7ef_50%,#eaf3e8_100%)] px-6 py-10">
      <AutoRedirect />
      <section
        aria-labelledby="onboarding-success"
        className="relative w-full max-w-md rounded-4xl px-8 py-10"
      >
        <div className="relative mx-auto mb-8 flex items-center justify-center rounded-full">
          <Image
            src={SuccessImg}
            alt="루틴 시작을 환영하는 모코 캐릭터"
            preload
            className="relative h-70 w-70 drop-shadow-[0_12px_24px_rgba(31,41,55,0.14)]"
          />
        </div>

        <div className="space-y-3 text-center">
          <h1
            id="success-title"
            className="text-gradient-primary text-[28px] leading-10.5 font-semibold"
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
