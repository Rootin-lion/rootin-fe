"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import InputWrapper from "@/components/shared/InputWrapper";
import Button from "@/components/shared/Button";
import FieldSelect from "./FieldSelect";
import { OnboardingPayload } from "@/types/auth/auth";
import {
  checkNicknameAction,
  completeProfileAction,
} from "@/app/onboarding/action";
import ErroModal from "../shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";

const CREATE_OPTIONS = [
  { label: "데이터베이스", value: "DATABASE" },
  { label: "인프라(Docker/AWS)", value: "INFRA_CLOUD" },
  { label: "자료구조/알고리즘", value: "DATA_STRUCTURE_ALGORITHM" },
  { label: "네트워크", value: "NETWORK" },
  { label: "자바/스프링", value: "JAVA_SPRING" },
  { label: "운영체제", value: "OPERATING_SYSTEM" },
];

export default function OnboardingForm({ email }: { email: string }) {
  const router = useRouter();
  const [info, setInfo] = useState<OnboardingPayload>({
    nickname: "",
    ageGroup: "",
    interestFields: [],
  });
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null,
  );
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();
  const [isCompletePending, startCompleteTransition] = useTransition();
  const [, startNicknameTransition] = useTransition();

  const hanldeNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;

    setInfo((prev) => ({ ...prev, nickname }));

    setNicknameAvailable(null);
  };

  const handleAgeGroupClick = (targetAge: string) => {
    setInfo((prev) => ({
      ...prev,
      ageGroup: prev.ageGroup === targetAge ? "" : targetAge,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isSubmitEnabled || isCompletePending) return;

    startCompleteTransition(async () => {
      try {
        const res = await completeProfileAction(info);

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();
          return;
        }

        router.replace("/onboarding/success");
      } catch {
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "프로필 저장 중 오류가 발생했습니다.",
        });
        openModal();
      }
    });
  };

  const isSubmitEnabled =
    info.nickname.trim() !== "" &&
    info.ageGroup !== "" &&
    info.interestFields.length > 0 &&
    nicknameAvailable === true;

  // 닉네임 검증 로직
  useEffect(() => {
    const nickname = info.nickname.trim();

    if (!nickname) return;

    // 이전 값 보호
    let ignore = false;

    const timeoutId = window.setTimeout(() => {
      startNicknameTransition(async () => {
        try {
          const res = await checkNicknameAction(nickname);
          console.log(res.data);

          if (ignore) return;

          setNicknameAvailable(res?.data?.available);
        } catch (error) {
          if (ignore) return;

          console.log(error);
          setNicknameAvailable(null);
        }
      });
    }, 300);

    return () => {
      ignore = true;
      window.clearTimeout(timeoutId);
    };
  }, [info.nickname]);

  return (
    <main className="bg-primary-50 flex min-h-dvh flex-col items-center justify-center">
      {isModalOpen && (
        <ErroModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <h1 className="text-text text-[28px] font-bold">프로필 설정</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full max-w-108 flex-col gap-6"
      >
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
            isAvailable={nicknameAvailable}
            required
            placeholder="닉네임을 입력해주세요."
            value={info.nickname}
            onChange={hanldeNicknameChange}
            onDelete={() => {
              setInfo((prev) => ({ ...prev, nickname: "" }));
            }}
          />
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>연령대</InputWrapper.Label>
          <div className="flex justify-center gap-2">
            <Button
              isActive={info.ageGroup === "TEENS"}
              aria-pressed={info.ageGroup === "TEENS"}
              onClick={() => handleAgeGroupClick("TEENS")}
            >
              10대
            </Button>
            <Button
              isActive={info.ageGroup === "TWENTIES"}
              aria-pressed={info.ageGroup === "TWENTIES"}
              onClick={() => handleAgeGroupClick("TWENTIES")}
            >
              20대
            </Button>
            <Button
              isActive={info.ageGroup === "THIRTIES"}
              aria-pressed={info.ageGroup === "THIRTIES"}
              onClick={() => handleAgeGroupClick("THIRTIES")}
            >
              30대
            </Button>
            <Button
              isActive={info.ageGroup === "FOURTIES"}
              aria-pressed={info.ageGroup === "FOURTIES"}
              onClick={() => handleAgeGroupClick("FOURTIES")}
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
          disabled={!isSubmitEnabled || isCompletePending}
          isActive={isSubmitEnabled && !isCompletePending}
        >
          {isCompletePending ? "저장 중..." : "저장하기"}
        </Button>
      </form>
    </main>
  );
}
