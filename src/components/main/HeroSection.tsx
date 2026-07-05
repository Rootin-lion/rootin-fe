import Image from "next/image";
import HeroImg from "../../assets/main/hero.png";
import { SectionWrapper } from "../shared/main/SectionWrapper";

const HeroButton = () => {
  return (
    <button
      type="button"
      className="bg-primary-900 max-w-48 cursor-pointer rounded-lg px-7 py-4 text-[20px] font-semibold text-white"
    >
      지금 시작하기 →
    </button>
  );
};

export function HeroSection() {
  return (
    <SectionWrapper variant={"primary"}>
      <div className="flex h-full max-h-200 flex-col justify-between pt-24 pb-35">
        <div>
          <p className="text-primary-900 text-[26px] font-semibold">
            개발자 취업 준비를 위한 CS 통합 학습 플랫폼
          </p>
          <p className="text-[48px] font-bold whitespace-pre-wrap">
            실력은 연습으로,{"\n"}성장은{" "}
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
          </p>
          <p className="text-disabled-text text-[18px] font-medium whitespace-pre-wrap">
            CS 대회, 모의 면접, 개인 분석을 통해{"\n"}
            나만의 성장을 체계적으로 만들어보세요
          </p>
        </div>
        <HeroButton />
      </div>
      <div>
        <Image
          src={HeroImg}
          alt="hero"
          width={604}
          height={400}
          loading="lazy"
        />
      </div>
    </SectionWrapper>
  );
}
