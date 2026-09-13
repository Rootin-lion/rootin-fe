import Image from "next/image";
import BannerImg from "../../assets/contests/bannerImg.png";

const CtaButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-primary-900 border-primary-900 cursor-pointer rounded-xl border px-5 py-2 text-[14px] font-semibold"
    >
      대회 참여하기
    </button>
  );
};

export default function ContestCtaBanner({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-8 w-full bg-[radial-gradient(100%_100%_at_0%_50%,#EEF3E7_0%,#E4EFE0_50%,#DAEBD9_100%)]">
      <div className="mx-auto flex max-w-5xl items-end justify-between py-9">
        <div className="flex items-center gap-5">
          <div className="flex h-18 w-18 items-center justify-center rounded-[50%] bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_30%,#DAEBD9_100%)]">
            <Image src={BannerImg} width={50} height={59} alt="banner" />
          </div>
          <div className="flex flex-col">
            <p className="bg-[linear-gradient(180deg,#305035_0%,#4B6D50_50%,#A1CCA7_100%)] bg-clip-text text-[22px] font-bold text-transparent">
              매일 도전하고 실력을 성장시켜보세요!
            </p>
            <p className="text-primary-900 text-[12px] font-normal">
              꾸준한 도전이 최고의 개발자를 만듭니다.
            </p>
          </div>
        </div>
        <div>
          <CtaButton onClick={onClick} />
        </div>
      </div>
    </div>
  );
}
