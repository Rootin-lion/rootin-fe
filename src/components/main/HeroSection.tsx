"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeroImg from "@/assets/images/shared/hero.png";
import PrimaryDarkButton from "@/components/shared/PrimaryDarkButton";
import SectionWrapper from "./SectionWrapper";

export function HeroSection() {
  const router = useRouter();

  return (
    <SectionWrapper variant="primary" className="md:flex-row md:gap-8">
      <div className="w-full text-center max-md:contents md:flex md:w-1/2 md:flex-col md:items-start md:gap-6 md:text-left lg:max-w-140 lg:gap-12">
        <div>
          <p className="text-primary-900 text-[13px] font-semibold md:text-[16px] lg:text-[26px]">
            개발자 취업 준비를 위한 CS 통합 학습 플랫폼
          </p>
          <h1 className="mt-3 text-[24px] font-bold min-[390px]:text-[28px] md:text-[36px] lg:text-[48px]">
            실력은 연습으로,
            <br />
            성장은{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, #87BE8B 0%, #36723E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ROOTIN
            </span>
            으로
          </h1>
          <p className="text-sub-text mt-4 text-[13px] leading-relaxed font-medium md:text-[14px] lg:text-[18px]">
            CS 대회, 모의 면접, 개인 분석을 통해
            <br />
            나만의 성장을 체계적으로 만들어보세요
          </p>
        </div>
        <div className="w-full max-w-80 max-md:order-2 max-md:mt-6 md:w-48">
          <PrimaryDarkButton
            className="px-5 py-3 text-[14px] duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(31,41,55,0.12)] lg:px-7 lg:py-4 lg:text-[20px]"
            onClick={() => router.push("/competitions")}
          >
            지금 시작하기 →
          </PrimaryDarkButton>
        </div>
      </div>
      <div className="mt-6 w-full max-w-60 max-md:order-1 md:mt-0 md:w-1/2 md:max-w-120">
        <Image
          src={HeroImg}
          alt=""
          preload
          sizes="(max-width: 767px) 240px, (max-width: 1023px) 45vw, 480px"
          className="h-auto w-full"
        />
      </div>
    </SectionWrapper>
  );
}
