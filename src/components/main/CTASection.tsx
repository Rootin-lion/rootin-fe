"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import CtaImg from "@/assets/images/main/cta.png";
import PrimaryDarkButton from "@/components/shared/PrimaryDarkButton";
import SectionWrapper from "./SectionWrapper";

export function CTASection() {
  const router = useRouter();

  return (
    <SectionWrapper variant={"primary"}>
      <div className="flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:justify-between lg:gap-12">
        <div className="flex w-full flex-col items-center gap-4 text-center md:w-auto md:items-start md:text-left">
          <h1 className="text-[24px] font-bold md:text-[32px] lg:text-[42px]">
            지금 바로,
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #36723E 0%, #000000 79.81%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              당신의 성장
            </span>
            을 시작하세요!
          </h1>
          <p className="text-sub-text text-[13px] leading-relaxed font-medium md:text-[16px] lg:text-[24px]">
            ROOTIN과 함께라면 매일 조금씩 더 강해질 수 있어요.
          </p>

          <div className="mt-3 w-full max-w-80 lg:mt-14">
            <PrimaryDarkButton
              className="px-5 py-3 text-[14px] duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(31,41,55,0.12)] lg:px-7 lg:py-4 lg:text-[20px]"
              onClick={() => router.push("/competitions")}
            >
              ROOTIN 시작하기 →
            </PrimaryDarkButton>
          </div>
        </div>
        <div className="hidden md:flex">
          <Image
            src={CtaImg}
            width={292}
            height={328}
            alt=""
            className="h-auto w-36 duration-300 ease-in-out md:w-48 lg:w-73 lg:hover:scale-110"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
