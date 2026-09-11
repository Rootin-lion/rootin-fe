"use client";

import CareerSelect from "@/components/onboarding/CareerSelect";
import Button from "@/components/shared/Button";
import InputWrapper from "@/components/shared/InputWrapper";
import { useState } from "react";

interface OnBoardingInfo {
  nickname: string;
  ageGrop: number;
  interestFields: string[];
}

const careerOptions = [
  { label: "데이터베이스", value: "데이터베이스" },
  { label: "인프라(Docker/AWS)", value: "인프라(Docker/AWS)" },
  { label: "자료구조/알고리즘", value: "자료구조/알고리즘" },
  { label: "네트워크", value: "네트워크" },
  { label: "자바/스프링", value: "자바/스프링" },
  { label: "운영체제", value: "운영체제" },
];

export default function OnBoardingPage() {
  const [info, setInfo] = useState<OnBoardingInfo>({
    nickname: "",
    ageGrop: 0,
    interestFields: [],
  });

  const handleAgeGroupClick = (targetAge: number) => {
    setInfo((prev) => ({
      ...prev,
      ageGrop: prev.ageGrop === targetAge ? 0 : targetAge,
    }));
  };

  const handleInterestClick = (targetInterest: string) => {
    if (
      info.interestFields.length >= 3 &&
      !info.interestFields.includes(targetInterest)
    )
      return;

    setInfo((prev) => ({
      ...prev,
      career: prev.interestFields.includes(targetInterest)
        ? prev.interestFields.filter(
            (interestFields) => interestFields !== targetInterest,
          )
        : [...prev.interestFields, targetInterest],
    }));
  };

  const isSubmitEnabled =
    info.nickname.trim() !== "" &&
    info.ageGrop !== 0 &&
    info.interestFields.length > 0;

  return (
    <div className="bg-primary-50 flex min-h-dvh flex-col items-center justify-center">
      <p className="text-text text-[28px] font-bold">프로필 설정</p>

      <div className="mt-8 flex w-full max-w-108 flex-col gap-6">
        <InputWrapper>
          <InputWrapper.Label>이메일</InputWrapper.Label>
          <InputWrapper.Input
            type="email"
            disabled
            readOnly
            value="이메일@example.com"
            placeholder="이메일을 입력해주세요."
            className="bg-bg-green-100 border-[#D5D9DD]"
          />
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>닉네임</InputWrapper.Label>
          <InputWrapper.Input
            type="text"
            placeholder="닉네임을 입력해주세요."
            value={info.nickname}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, nickname: e.target.value }));
            }}
            onDelete={() => {
              setInfo((prev) => ({ ...prev, nickname: "" }));
            }}
          />
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>연령대</InputWrapper.Label>
          <div className="flex justify-center gap-2">
            <Button
              isActive={info.ageGrop === 10}
              onClick={() => handleAgeGroupClick(10)}
            >
              10대
            </Button>
            <Button
              isActive={info.ageGrop === 20}
              onClick={() => handleAgeGroupClick(20)}
            >
              20대
            </Button>
            <Button
              isActive={info.ageGrop === 30}
              onClick={() => handleAgeGroupClick(30)}
            >
              30대
            </Button>
            <Button
              isActive={info.ageGrop === 40}
              onClick={() => handleAgeGroupClick(40)}
            >
              40대
            </Button>
          </div>
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>관심분야</InputWrapper.Label>
          <CareerSelect
            value={info.interestFields}
            options={careerOptions}
            onClick={handleInterestClick}
          />
        </InputWrapper>

        <Button disabled={!isSubmitEnabled} isActive={isSubmitEnabled}>
          저장하기
        </Button>
      </div>
    </div>
  );
}
