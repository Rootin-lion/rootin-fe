import Image from "next/image";
import React from "react";
import TrophyImg from "@/assets/competitions/trophy.png";
import type { TodayCompetitionState } from "@/types/competitions/competition";
import GradientOutlineButton from "@/components/shared/GradientOutlineButton";
import ContestCountdown from "./CompetitionCountdown";

const Status = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-primary text-primary-900 max-w-16 rounded-[18px] border px-2 py-1 text-center text-[12px] font-semibold">
      {children}
    </div>
  );
};

const EndContest = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-5 md:flex-row md:px-4">
      <div>
        <Status>종료</Status>
        <h1 className="mt-2 bg-[linear-gradient(180deg,#305035_0%,#4B6D50_49.52%,#A1CCA7_100%)] bg-clip-text text-[20px] font-bold break-keep whitespace-pre-wrap text-transparent md:text-[24px]">
          오늘의 대회가 종료되었습니다.{"\n"}내일 다시 참여해주세요!
        </h1>
        <p className="text-sub-text mt-2 text-[12px] font-normal">
          매일 진행되는 CS 대회에 참여하고 실력을 증명해보세요.
        </p>
      </div>
      <Image
        src={TrophyImg}
        alt=""
        className="hidden h-auto w-24 shrink-0 md:mr-8 md:flex md:w-30 lg:mr-30"
      />
    </div>
  );
};

export default function CompetitionBanner({
  competition,
  onClick,
  onExpire,
}: {
  competition: TodayCompetitionState;
  onClick: () => void;
  onExpire: () => void;
}) {
  return (
    <div className="bg-gradient-primary w-full">
      <div className="mx-auto flex max-w-5xl flex-col items-stretch justify-between gap-6 px-5 py-6 md:flex-row md:items-center md:px-6 md:py-5 lg:px-0">
        {competition.status === "CLOSED" ? (
          <EndContest />
        ) : (
          <>
            <div className="flex min-w-0 flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center md:gap-5 lg:gap-14 lg:pl-5">
              {competition.status === "BEFORE_START" ? (
                <div>
                  <Status>준비중</Status>
                  <p className="mt-2 bg-[linear-gradient(180deg,#305035_0%,#4B6D50_49.52%,#A1CCA7_100%)] bg-clip-text text-[20px] leading-relaxed font-bold break-keep whitespace-pre-wrap text-transparent md:text-[24px] md:leading-8.5">
                    오늘의 대회가 준비중입니다.{"\n"}조금만 기다려 주세요!
                  </p>
                  <p className="text-sub-text mt-2 text-[12px] font-normal">
                    매일 진행되는 CS 대회에 참여하고 실력을 증명해보세요.
                  </p>
                </div>
              ) : (
                <div>
                  <Status>진행중</Status>
                  <p className="mt-2 bg-[linear-gradient(180deg,#305035_0%,#4B6D50_49.52%,#A1CCA7_100%)] bg-clip-text text-[20px] leading-relaxed font-bold break-keep whitespace-pre-wrap text-transparent md:text-[24px] md:leading-8.5">
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
                className="hidden h-auto w-20 shrink-0 self-center sm:w-24 md:flex lg:w-32.5"
              />
            </div>
            <div className="text-primary-900 shrink-0 text-center text-[12px] font-normal lg:pr-35">
              {competition.status === "BEFORE_START" ? (
                <>
                  <p>대회 입장까지</p>
                  <ContestCountdown
                    initialSeconds={competition.remainingSeconds}
                    status={competition.status}
                    onExpire={onExpire}
                  />
                  <div className="mt-6">
                    <GradientOutlineButton
                      variant="gradient"
                      className="min-h-11 w-full md:w-auto"
                    >
                      대회 준비중
                    </GradientOutlineButton>
                  </div>
                </>
              ) : (
                <>
                  <p>대회 입장 마감</p>
                  <ContestCountdown
                    initialSeconds={competition.remainingSeconds}
                    status={competition.status}
                    onExpire={onExpire}
                  />
                  <p>{competition.participantCount}명이 참가했어요.</p>
                  <div className="mt-3">
                    <GradientOutlineButton
                      variant="gradient"
                      className="min-h-11 w-full md:w-auto"
                      onClick={onClick}
                    >
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
