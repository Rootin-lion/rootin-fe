import Image from "next/image";
import BannerImg from "@/assets/images/competitions/bannerImg.png";
import type { CompetitionStatus } from "@/types/competitions/competition";
import GradientOutlineButton from "@/components/shared/GradientOutlineButton";

export default function CompetitionCtaBanner({
  isOpen,
  onClick,
}: {
  isOpen: CompetitionStatus;
  onClick: () => void;
}) {
  return (
    <div className="bg-gradient-primary mt-3 w-full md:mt-8">
      <div className="mx-auto flex max-w-5xl flex-col items-stretch justify-between gap-5 px-5 py-6 md:flex-row md:items-center md:px-6 md:py-9 lg:px-0">
        <div className="flex min-w-0 items-center gap-3 md:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_30%,#DAEBD9_100%)] md:h-18 md:w-18">
            <Image src={BannerImg} width={50} height={59} alt="" />
          </div>
          <div className="flex flex-col">
            <h2 className="bg-[linear-gradient(180deg,#305035_0%,#4B6D50_50%,#A1CCA7_100%)] bg-clip-text text-[17px] leading-relaxed font-bold break-keep text-transparent md:text-[22px]">
              매일 도전하고 실력을 성장시켜보세요!
            </h2>
            <p className="text-primary-900 text-[12px] font-normal">
              꾸준한 도전이 최고의 개발자를 만듭니다.
            </p>
          </div>
        </div>

        {isOpen !== "CLOSED" && (
          <GradientOutlineButton
            variant="gradient"
            className="min-h-11 shrink-0"
            onClick={onClick}
          >
            {isOpen === "BEFORE_START" ? "대회 준비 중" : "대회 참여하기"}
          </GradientOutlineButton>
        )}
      </div>
    </div>
  );
}
