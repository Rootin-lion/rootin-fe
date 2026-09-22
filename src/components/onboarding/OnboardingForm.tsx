"use client";

import { useState } from "react";
import InputWrapper from "../shared/InputWrapper";
import Button from "../shared/Button";
import FieldSelect from "./FieldSelect";
import { OnboardingPayload } from "@/types/auth/auth";

const CREATE_OPTIONS = [
  { label: "데이터베이스", value: "DATABASE" },
  { label: "인프라(Docker/AWS)", value: "INFRA_CLOUD" },
  { label: "자료구조/알고리즘", value: "DATA_STRUCTURE_ALGORITHM" },
  { label: "네트워크", value: "NETWORK" },
  { label: "자바/스프링", value: "JAVA_SPRING" },
  { label: "운영체제", value: "OPERATING_SYSTEM" },
];

export default function OnboardingForm({ email }: { email: string }) {
  const [info, setInfo] = useState<OnboardingPayload>({
    nickname: "",
    ageGroup: 0,
    interestFields: [],
  });

  const handleAgeGroupClick = (targetAge: number) => {
    setInfo((prev) => ({
      ...prev,
      ageGroup: prev.ageGroup === targetAge ? 0 : targetAge,
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
      interestFields: prev.interestFields.includes(targetInterest)
        ? prev.interestFields.filter(
            (interestFields) => interestFields !== targetInterest,
          )
        : [...prev.interestFields, targetInterest],
    }));
  };

  const isSubmitEnabled =
    info.nickname.trim() !== "" &&
    info.ageGroup !== 0 &&
    info.interestFields.length > 0;

  return (
    <main className="bg-primary-50 flex min-h-dvh flex-col items-center justify-center">
      <h1 className="text-text text-[28px] font-bold">프로필 설정</h1>

      <form className="mt-8 flex w-full max-w-108 flex-col gap-6">
        <InputWrapper>
          <InputWrapper.Label>이메일</InputWrapper.Label>
          <InputWrapper.Input
            type="email"
            disabled
            readOnly
            value={email}
            placeholder="이메일을 입력해주세요."
            className="bg-bg-green-100 border-[#D5D9DD]"
          />
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label htmlFor="nickname">닉네임</InputWrapper.Label>
          <InputWrapper.Input
            type="text"
            id="nickname"
            name="nickname"
            required
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
              isActive={info.ageGroup === 10}
              aria-pressed={info.ageGroup === 10}
              onClick={() => handleAgeGroupClick(10)}
            >
              10대
            </Button>
            <Button
              isActive={info.ageGroup === 20}
              aria-pressed={info.ageGroup === 20}
              onClick={() => handleAgeGroupClick(20)}
            >
              20대
            </Button>
            <Button
              isActive={info.ageGroup === 30}
              aria-pressed={info.ageGroup === 30}
              onClick={() => handleAgeGroupClick(30)}
            >
              30대
            </Button>
            <Button
              isActive={info.ageGroup === 40}
              aria-pressed={info.ageGroup === 40}
              onClick={() => handleAgeGroupClick(40)}
            >
              40대
            </Button>
          </div>
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>관심분야</InputWrapper.Label>
          <FieldSelect
            value={info.interestFields}
            options={CREATE_OPTIONS}
            onClick={handleInterestClick}
          />
        </InputWrapper>

        <Button
          type="submit"
          disabled={!isSubmitEnabled}
          isActive={isSubmitEnabled}
        >
          저장하기
        </Button>
      </form>
    </main>
  );
}
