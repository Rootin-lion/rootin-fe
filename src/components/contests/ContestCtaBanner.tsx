import Image from "next/image";
import BannerImg from "@/assets/contests/bannerImg.png";
import GradientOutlineButton from "@/components/shared/GradientOutlineButton";

export default function ContestCtaBanner({ onClick }: { onClick: () => void }) {
  return (
    <div className="bg-gradient-primary mt-8 w-full">
      <div className="mx-auto flex max-w-5xl items-center justify-between py-9">
        <div className="flex items-center gap-5">
          <div className="flex h-18 w-18 items-center justify-center rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_30%,#DAEBD9_100%)]">
            <Image src={BannerImg} width={50} height={59} alt="" />
          </div>
          <div className="flex flex-col">
            <h2 className="bg-[linear-gradient(180deg,#305035_0%,#4B6D50_50%,#A1CCA7_100%)] bg-clip-text text-[22px] font-bold text-transparent">
              매일 도전하고 실력을 성장시켜보세요!
            </h2>
            <p className="text-primary-900 text-[12px] font-normal">
              꾸준한 도전이 최고의 개발자를 만듭니다.
            </p>
          </div>
        </div>

        <GradientOutlineButton variant="gradient" onClick={onClick}>
          대회 참여하기
        </GradientOutlineButton>
      </div>
    </div>
  );
}
