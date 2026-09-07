import Image from "next/image";
import { SectionWrapper } from "./SectionWrapper";
import CtaImg from "../../assets/main/cta.png";
import { MainButton } from "./MainButton";

export function CTASection() {
  return (
    <SectionWrapper variant={"primary"}>
      <div className="flex gap-70">
        <div className="flex flex-col gap-4">
          <p className="text-[42px] font-bold whitespace-pre-wrap">
            지금 바로,
            {"\n"}
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
          </p>
          <p className="text-sub-text text-[24px] font-medium">
            ROOTIN과 함께라면 매일 조금씩 더 강해질 수 있어요.
          </p>

          <div className="mt-14 w-80">
            <MainButton text={"ROOTIN 시작하기  →"} />
          </div>
        </div>
        <div>
          <Image
            src={CtaImg}
            width={292}
            height={328}
            alt="cta"
            className="duration-300 ease-in-out hover:scale-120"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
