import Image from "next/image";
import SuccessImg from "../../../assets/success_char.png";

export default function SuccessPage() {
  return (
    <main className=" flex min-h-dvh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#f7faf5_0%,#edf7ef_50%,#eaf3e8_100%)] px-6 py-10">
      <section className="relative w-full max-w-md rounded-4xl px-8 py-10">
        <div className="relative mx-auto mb-8 flex h-56 w-56 items-center justify-center rounded-full">
          <Image
            src={SuccessImg}
            alt="루틴 시작을 환영하는 모코 캐릭터"
            width={200}
            height={210}
            priority
            className="relative h-auto w-47 drop-shadow-[0_12px_24px_rgba(31,41,55,0.14)]"
          />
        </div>

        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-primary-800">
            WELCOME TO ROOTIN
          </p>
          <h1 className="text-[30px] font-semibold leading-tight text-text">
            모코가 기다리고 있었어요
          </h1>
          <p className="text-[15px] leading-6 text-sub-text whitespace-pre-wrap">
            프로필 설정이 끝났어요.{"\n"} 이제 모코와 함께 나만의 루틴을
            차근차근 시작해볼까요?
          </p>
        </div>
      </section>
    </main>
  );
}
