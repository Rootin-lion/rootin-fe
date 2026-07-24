import Image from "next/image";
import TrophyImg from "../../../assets/contests/trophy.png";
import BannerButton from "./BannerButton";

const Status = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-primary text-primary-900 max-w-18 rounded-[18px] border px-3 py-1 text-center text-[16px] font-medium">
      {children}
    </div>
  );
};

export default function Banner() {
  return (
    <div className="w-full bg-[radial-gradient(100%_100%_at_0%_50%,#EEF3E7_0%,#E4EFE0_50%,#DAEBD9_100%)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between py-7">
        <div className="flex items-center gap-20 pl-5">
          <div>
            <Status>진행중</Status>
            <p className="mt-2 bg-[linear-gradient(180deg,#305035_0%,#4B6D50_49.52%,#A1CCA7_100%)] bg-clip-text text-[30px] font-bold whitespace-pre-wrap text-transparent">
              오늘의 대회가 열렸습니다.{"\n"}지금 바로 참여해주세요!
            </p>
            <p className="text-sub-text text-[14px] font-normal">
              매일 진행되는 CS 대회에 참여하고 실력을 증명해보세요.
            </p>
          </div>
          <Image src={TrophyImg} width={160} height={160} alt="trophy" />
        </div>
        <div className="text-primary-900 pr-35 text-center text-[16px] font-normal">
          <p>대회 입장 마감</p>
          <p className="text-[24px] font-bold">12분 30초</p>
          <p>132명이 참가했어요.</p>
          <div className="mt-3">
            <BannerButton>대회 참여하기</BannerButton>
          </div>
        </div>
      </div>
    </div>
  );
}
