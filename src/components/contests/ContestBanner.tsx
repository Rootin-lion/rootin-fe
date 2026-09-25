import React from "react";
import Image from "next/image";
import TrophyImg from "@/assets/contests/trophy.png";
import type { TodayCompetitionState } from "@/types/contests/competition";
import GradientOutlineButton from "@/components/shared/GradientOutlineButton";

const Status = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-primary text-primary-900 max-w-16 rounded-[18px] border px-2 py-1 text-center text-[12px] font-semibold">
      {children}
    </div>
  );
};

const EndContest = () => {
  return (
    <div className="flex w-full justify-between px-4">
      <div>
        <Status>종료</Status>
        <h1 className="mt-2 bg-[linear-gradient(180deg,#305035_0%,#4B6D50_49.52%,#A1CCA7_100%)] bg-clip-text text-[24px] font-bold whitespace-pre-wrap text-transparent">
          오늘의 대회가 종료되었습니다.{"\n"}내일 다시 참여해주세요!
        </h1>
        <p className="text-sub-text mt-2 text-[12px] font-normal">
          매일 진행되는 CS 대회에 참여하고 실력을 증명해보세요.
        </p>
      </div>
      <Image src={TrophyImg} alt="" className="mr-30 h-auto w-30 shrink-0" />
    </div>
  );
};

export default function ContestBanner({
  competition,
  onClick,
}: {
  competition: TodayCompetitionState;
  onClick: () => void;
}) {
  const formatRemainingTime = (remainingTime: number) => {
    const m = Math.floor(remainingTime / 60);
    const s = remainingTime % 60;

    return `${m}분 ${s}초`;
  };

  const timeColor =
    competition.remainingSeconds >= 300 ? "text-primary-900" : "text-error";

  return (
    <div className="bg-gradient-primary w-full">
      <div className="mx-auto flex max-w-5xl items-center justify-between py-5">
        {competition.status === "CLOSED" ? (
          <EndContest />
        ) : (
          <>
            <div className="flex items-center gap-14 pl-5">
              {competition.status === "BEFORE_START" ? (
                <div>
                  <Status>준비중</Status>
                  <p className="mt-2 bg-[linear-gradient(180deg,#305035_0%,#4B6D50_49.52%,#A1CCA7_100%)] bg-clip-text text-[24px] leading-8.5 font-bold whitespace-pre-wrap text-transparent">
                    오늘의 대회가 준비중입니다.{"\n"}조금만 기다려 주세요!
                  </p>
                  <p className="text-sub-text mt-2 text-[12px] font-normal">
                    매일 진행되는 CS 대회에 참여하고 실력을 증명해보세요.
                  </p>
                </div>
              ) : (
                <div>
                  <Status>진행중</Status>
                  <p className="mt-2 bg-[linear-gradient(180deg,#305035_0%,#4B6D50_49.52%,#A1CCA7_100%)] bg-clip-text text-[24px] leading-8.5 font-bold whitespace-pre-wrap text-transparent">
                    오늘의 대회가 열렸습니다.{"\n"}지금 바로 참여해주세요!
                  </p>
                  <p className="text-sub-text mt-2 text-[12px] font-normal">
                    매일 진행되는 CS 대회에 참여하고 실력을 증명해보세요.
                  </p>
                </div>
              )}
              <Image
                src={TrophyImg}
                alt="trophy"
                className="h-auto w-32.5 shrink-0"
              />
            </div>
            <div className="text-primary-900 pr-35 text-center text-[12px] font-normal">
              {competition.status === "BEFORE_START" ? (
                <>
                  <p>대회 입장까지</p>
                  <p className="text-[20px] font-bold">
                    {formatRemainingTime(competition.remainingSeconds)}
                  </p>
                  <div className="mt-6">
                    <GradientOutlineButton variant="gradient">
                      대회 준비중
                    </GradientOutlineButton>
                  </div>
                </>
              ) : (
                <>
                  <p>대회 입장 마감</p>
                  <p className={`${timeColor} text-[20px] font-bold`}>
                    {formatRemainingTime(competition.remainingSeconds)}
                  </p>
                  <p>132명이 참가했어요.</p>
                  <div className="mt-3">
                    <GradientOutlineButton variant="gradient" onClick={onClick}>
                      대회 참여하기
                    </GradientOutlineButton>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
