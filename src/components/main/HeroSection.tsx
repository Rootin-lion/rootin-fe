import Image from "next/image";
import HeroImg from "../../assets/hero.png";
import { SectionWrapper } from "./SectionWrapper";
import { MainButton } from "./MainButton";

export function HeroSection() {
  return (
    <SectionWrapper variant="primary">
      <div className="flex h-full max-h-200 flex-col justify-between gap-4 pt-24 pb-35">
        <div>
          <h2 className="text-primary-900 text-[26px] font-semibold">
            개발자 취업 준비를 위한 CS 통합 학습 플랫폼
          </h2>
          <h1 className="text-[48px] font-bold">
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
          <p className="text-disabled-text text-[18px] font-medium">
            CS 대회, 모의 면접, 개인 분석을 통해
            <br />
            나만의 성장을 체계적으로 만들어보세요
          </p>
        </div>
        <div className="w-48">
          <MainButton text="지금 시작하기 →" />
        </div>
      </div>
      <div>
        <Image
          src={HeroImg}
          alt="hero"
          width={580}
          height={386}
          priority
          style={{ width: "580px", height: "auto" }}
        />
      </div>
    </SectionWrapper>
  );
}
