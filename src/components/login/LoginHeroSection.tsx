import Image from "next/image";
import LoginImg from "@/assets/images/shared/hero.png";

export default function LoginHeroSection() {
  return (
    <section className="hidden min-w-0 flex-1 flex-col items-end justify-center bg-[#EEF3E7] px-6 py-12 md:flex lg:px-10 xl:pr-26">
      <div className="flex w-full max-w-132.5 flex-col items-center justify-center">
        <h1 className="w-full text-left text-[28px] leading-snug font-bold lg:text-[36px] xl:text-[40px]">
          CS 실력 성장의 시작,
          <br />
          <span className="text-[#36723E]">ROOTIN</span>과 함께하세요
        </h1>
        <Image
          src={LoginImg}
          width={530}
          height={353}
          alt=""
          className="mt-12 h-auto w-full"
          sizes="(min-width: 1280px) 530px, 42vw"
          loading="eager"
        />
      </div>
    </section>
  );
}
