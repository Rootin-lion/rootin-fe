"use client";

import CareerSelect from "@/components/onboarding/CareerSelect";
import Button from "@/components/shared/Button";
import InputWrapper from "@/components/shared/InputWrapper";
import { useState } from "react";

const careerOptions = [
  { label: "0~1년차", value: "0-1" },
  { label: "2~3년차", value: "2-3" },
  { label: "4~6년차", value: "4-6" },
  { label: "7~9년차", value: "7-9" },
  { label: "10년차 이상", value: "10+" },
  { label: "그 외 (학생)", value: "student" },
];

export default function OnBoardingPage() {
  const [info, setInfo] = useState({
    nickname: "",
    age: 0,
    career: "",
  });

  const handleAgeClick = (targetAge: number) => {
    setInfo((prev) => ({
      ...prev,
      age: prev.age === targetAge ? 0 : targetAge,
    }));
  };

  const isSubmitDisabled = !info.nickname || info.age === 0 || !info.career;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg-green-50">
      <p className="text-[28px] font-bold text-text">프로필 설정</p>

      <div className="mt-8 flex w-full max-w-108 flex-col gap-6">
        <InputWrapper>
          <InputWrapper.Label>이메일</InputWrapper.Label>
          <InputWrapper.Input
            type="email"
            disabled
            readOnly
            value="이메일@example.com"
            placeholder="이메일을 입력해주세요."
            className="border-[#D5D9DD] bg-bg-green-100"
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
              isActive={info.age === 10}
              onClick={() => handleAgeClick(10)}
            >
              10대
            </Button>
            <Button
              isActive={info.age === 20}
              onClick={() => handleAgeClick(20)}
            >
              20대
            </Button>
            <Button
              isActive={info.age === 30}
              onClick={() => handleAgeClick(30)}
            >
              30대
            </Button>
            <Button
              isActive={info.age === 40}
              onClick={() => handleAgeClick(40)}
            >
              40대
            </Button>
          </div>
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>경력</InputWrapper.Label>
          <CareerSelect
            value={info.career}
            options={careerOptions}
            onChange={(career) => {
              setInfo((prev) => ({ ...prev, career }));
            }}
          />
        </InputWrapper>

        <Button disabled={isSubmitDisabled}>저장하기</Button>
      </div>
    </div>
  );
}
